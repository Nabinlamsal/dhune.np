package controller

import (
	"net/http"
	"strings"

	"github.com/Nabinlamsal/dhune.np/internal/chatbot/service"
	"github.com/Nabinlamsal/dhune.np/internal/utils"
	"github.com/gin-gonic/gin"
)

type ChatbotHandler struct {
	service *service.ChatbotService
}

func NewChatbotHandler(service *service.ChatbotService) *ChatbotHandler {
	return &ChatbotHandler{service: service}
}

type AskRequest struct {
	Message   string `json:"message"`
	SessionID string `json:"session_id"`
}

func (h *ChatbotHandler) Ask(c *gin.Context) {
	var req AskRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Error(c, http.StatusBadRequest, "message is required")
		return
	}

	if strings.TrimSpace(req.Message) == "" {
		utils.Error(c, http.StatusBadRequest, "message is required")
		return
	}

	result, err := h.service.Ask(c.Request.Context(), service.AskInput{
		Message:   req.Message,
		SessionID: req.SessionID,
	})
	if err != nil {
		utils.Error(c, http.StatusBadRequest, "message is required")
		return
	}

	utils.Success(c, result)
}
