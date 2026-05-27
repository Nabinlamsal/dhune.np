package service

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"regexp"
	"sort"
	"strings"
	"time"

	"github.com/Nabinlamsal/dhune.np/internal/chatbot/repository"
	"github.com/Nabinlamsal/dhune.np/internal/config"
)

const (
	privateDataReply = "I cannot access private account details from the public chatbot. Please log in to your account or contact Dhune.np support."
	supportReply     = "I could not find that in the Dhune.np help context. Please contact Dhune.np support for the most accurate help."
	systemPrompt     = `You are Dhune.np Help Assistant.
You answer only general support questions about Dhune.np using the provided context.
You are informational only.
You must not perform actions such as creating orders, processing payments, approving vendors, cancelling orders, or updating accounts.
You must not expose private user, order, payment, address, document, OTP, or vendor financial data.
If a user asks for private/account-specific data, tell them to log in or contact support.
If the answer is not available in the provided context, say that the user should contact Dhune.np support.
Keep answers short, clear, friendly, and professional.`
)

type ChatbotService struct {
	repo       repository.Repository
	httpClient *http.Client
	config     config.EnvConfig
	chunks     []knowledgeChunk
}

type knowledgeChunk struct {
	Title string
	Body  string
}

type scoredChunk struct {
	knowledgeChunk
	Score int
}

func NewChatbotService(repo repository.Repository, cfg config.EnvConfig) *ChatbotService {
	return &ChatbotService{
		repo: repo,
		httpClient: &http.Client{
			Timeout: 20 * time.Second,
		},
		config: cfg,
		chunks: loadKnowledgeChunks(),
	}
}

func (s *ChatbotService) Ask(ctx context.Context, input AskInput) (*AskOutput, error) {
	message := strings.TrimSpace(input.Message)
	if message == "" {
		return nil, errors.New("message is required")
	}

	var reply string
	var source string

	if asksForPrivateData(message) {
		reply = privateDataReply
		source = "safety-rules"
	} else {
		contextText, contextSource := s.retrieveContext(ctx, message)
		source = contextSource
		if strings.TrimSpace(contextText) == "" {
			reply = supportReply
		} else {
			generated, err := s.generateWithGroq(ctx, message, contextText)
			if err != nil {
				log.Println("chatbot groq generation failed:", err)
				reply = fallbackFromContext(message, contextText)
			} else {
				reply = generated
			}
		}
	}

	if err := s.repo.SaveMessage(ctx, input.SessionID, message, reply, source); err != nil {
		log.Println("chatbot message history save failed:", err)
	}

	return &AskOutput{Reply: reply}, nil
}

func (s *ChatbotService) retrieveContext(ctx context.Context, message string) (string, string) {
	chunks := topChunks(s.chunks, message, 5)
	var parts []string
	var sources []string

	for _, chunk := range chunks {
		parts = append(parts, fmt.Sprintf("## %s\n%s", chunk.Title, chunk.Body))
		sources = append(sources, chunk.Title)
	}

	if categories, err := s.repo.ListActiveCategories(ctx); err == nil && len(categories) > 0 {
		var categoryLines []string
		for _, category := range categories {
			line := "- " + category.Name
			if category.Description.Valid && strings.TrimSpace(category.Description.String) != "" {
				line += ": " + strings.TrimSpace(category.Description.String)
			}
			categoryLines = append(categoryLines, line)
		}
		parts = append(parts, "## Active Public Service Categories\n"+strings.Join(categoryLines, "\n"))
		sources = append(sources, "Active Public Service Categories")
	} else if err != nil {
		log.Println("chatbot category retrieval failed:", err)
	}

	return strings.Join(parts, "\n\n"), strings.Join(sources, ", ")
}

func (s *ChatbotService) generateWithGroq(ctx context.Context, message string, contextText string) (string, error) {
	if strings.TrimSpace(s.config.GroqAPIKey) == "" {
		return "", errors.New("GROQ_API_KEY is not configured")
	}

	model := strings.TrimSpace(s.config.GroqModel)
	if model == "" {
		model = "llama-3.1-8b-instant"
	}

	payload := groqRequest{
		Model:       model,
		Temperature: 0.2,
		MaxTokens:   280,
		Messages: []groqMessage{
			{Role: "system", Content: systemPrompt},
			{Role: "user", Content: fmt.Sprintf("Context:\n%s\n\nQuestion:\n%s", contextText, message)},
		},
	}

	body, err := json.Marshal(payload)
	if err != nil {
		return "", err
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, "https://api.groq.com/openai/v1/chat/completions", bytes.NewReader(body))
	if err != nil {
		return "", err
	}
	req.Header.Set("Authorization", "Bearer "+s.config.GroqAPIKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err := s.httpClient.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		io.Copy(io.Discard, resp.Body)
		return "", fmt.Errorf("groq returned status %d", resp.StatusCode)
	}

	var decoded groqResponse
	if err := json.NewDecoder(resp.Body).Decode(&decoded); err != nil {
		return "", err
	}
	if len(decoded.Choices) == 0 {
		return "", errors.New("groq returned no choices")
	}

	reply := strings.TrimSpace(decoded.Choices[0].Message.Content)
	if reply == "" {
		return "", errors.New("groq returned empty reply")
	}

	return reply, nil
}

type groqRequest struct {
	Model       string        `json:"model"`
	Messages    []groqMessage `json:"messages"`
	Temperature float64       `json:"temperature"`
	MaxTokens   int           `json:"max_tokens"`
}

type groqMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type groqResponse struct {
	Choices []struct {
		Message groqMessage `json:"message"`
	} `json:"choices"`
}

func loadKnowledgeChunks() []knowledgeChunk {
	content, err := readKnowledgeFile()
	if err != nil {
		log.Println("chatbot knowledge load failed:", err)
		return nil
	}

	sections := strings.Split(content, "\n## ")
	var chunks []knowledgeChunk
	for _, section := range sections {
		section = strings.TrimSpace(strings.TrimPrefix(section, "# Dhune.np Help Center Knowledge"))
		if section == "" {
			continue
		}
		lines := strings.SplitN(section, "\n", 2)
		if len(lines) != 2 {
			continue
		}
		chunks = append(chunks, knowledgeChunk{
			Title: strings.TrimSpace(strings.TrimPrefix(lines[0], "## ")),
			Body:  strings.TrimSpace(lines[1]),
		})
	}

	return chunks
}

func readKnowledgeFile() (string, error) {
	paths := []string{
		"internal/chatbot/knowledge/dhune_help.md",
		"../backend/internal/chatbot/knowledge/dhune_help.md",
		"../../backend/internal/chatbot/knowledge/dhune_help.md",
	}

	for _, path := range paths {
		content, err := os.ReadFile(path)
		if err == nil {
			return string(content), nil
		}
	}

	return "", errors.New("knowledge file not found")
}

func topChunks(chunks []knowledgeChunk, message string, limit int) []knowledgeChunk {
	keywords := tokenize(message)
	if len(keywords) == 0 {
		if len(chunks) > limit {
			return chunks[:limit]
		}
		return chunks
	}

	var scored []scoredChunk
	for _, chunk := range chunks {
		text := strings.ToLower(chunk.Title + " " + chunk.Body)
		score := 0
		for _, keyword := range keywords {
			if strings.Contains(text, keyword) {
				score++
			}
		}
		if score > 0 {
			scored = append(scored, scoredChunk{knowledgeChunk: chunk, Score: score})
		}
	}

	sort.Slice(scored, func(i, j int) bool {
		return scored[i].Score > scored[j].Score
	})

	if len(scored) > limit {
		scored = scored[:limit]
	}

	result := make([]knowledgeChunk, 0, len(scored))
	for _, chunk := range scored {
		result = append(result, chunk.knowledgeChunk)
	}

	return result
}

func tokenize(input string) []string {
	words := wordPattern.FindAllString(strings.ToLower(input), -1)
	var result []string
	for _, word := range words {
		if len(word) < 3 || stopWords[word] {
			continue
		}
		result = append(result, word)
	}
	return result
}

var wordPattern = regexp.MustCompile(`[a-z0-9]+`)

var stopWords = map[string]bool{
	"the": true, "and": true, "for": true, "with": true, "how": true,
	"what": true, "can": true, "you": true, "your": true,
	"about": true, "does": true, "work": true, "from": true, "this": true,
}

func asksForPrivateData(message string) bool {
	text := strings.ToLower(message)
	privateTerms := []string{
		"where is my order", "show my order", "my order status", "order id", "order number",
		"my payment", "transaction id",
		"my transaction", "my profile", "my address", "my phone", "my email", "my otp",
		"my dispute", "my notification", "vendor earning", "vendor financial", "show me",
		"show my", "who is this vendor",
	}

	for _, term := range privateTerms {
		if strings.Contains(text, term) {
			return true
		}
	}

	return false
}

func fallbackFromContext(message string, contextText string) string {
	lower := strings.ToLower(message)
	switch {
	case strings.Contains(lower, "pay") || strings.Contains(lower, "khalti") || strings.Contains(lower, "esewa") || strings.Contains(lower, "cod"):
		return "Dhune.np supports Khalti, eSewa, and Cash on Delivery when available for an order. The public chatbot cannot process or verify payments."
	case strings.Contains(lower, "request"):
		return "To create a laundry request, choose a service category, add laundry and pickup/delivery details, then submit the request so vendors can send offers."
	case strings.Contains(lower, "offer"):
		return "Vendors send offers with pricing, timing, and service notes. You can compare offers and accept the one that fits your needs."
	case strings.Contains(lower, "dispute"):
		return "You can raise a dispute for order, payment, delivery, or service issues. Please log in or contact Dhune.np support for case-specific help."
	case strings.Contains(lower, "contact") || strings.Contains(lower, "support"):
		return "For help, please contact Dhune.np support at support@dhune.np or log in for account-specific support."
	case strings.TrimSpace(contextText) != "":
		return "Dhune.np is a laundry marketplace where customers create requests, vendors send offers, and accepted offers become trackable orders."
	default:
		return supportReply
	}
}
