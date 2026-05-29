package utils

import (
	"bytes"
	"encoding/json"
	"fmt"
	"html"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	gomail "gopkg.in/mail.v2"
)

const resendEmailEndpoint = "https://api.resend.com/emails"

type EmailDetailRow struct {
	Label string
	Value string
}

type DhuneEmailInput struct {
	Title       string
	Message     string
	Details     []EmailDetailRow
	ActionLabel string
	ActionURL   string
	Footer      string
}

func BuildDhuneEmail(input DhuneEmailInput) string {
	var details strings.Builder
	if len(input.Details) > 0 {
		details.WriteString(`<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:20px;border-collapse:collapse">`)
		for _, row := range input.Details {
			if strings.TrimSpace(row.Label) == "" && strings.TrimSpace(row.Value) == "" {
				continue
			}
			details.WriteString(`<tr>`)
			details.WriteString(`<td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#64748b;font-size:13px">` + html.EscapeString(row.Label) + `</td>`)
			details.WriteString(`<td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#0f172a;font-size:13px;font-weight:700;text-align:right">` + html.EscapeString(row.Value) + `</td>`)
			details.WriteString(`</tr>`)
		}
		details.WriteString(`</table>`)
	}

	action := ""
	if strings.TrimSpace(input.ActionLabel) != "" && strings.TrimSpace(input.ActionURL) != "" {
		action = `<p style="margin:24px 0 0"><a href="` + html.EscapeString(input.ActionURL) + `" style="display:inline-block;border-radius:8px;background:#040947;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:12px 18px">` + html.EscapeString(input.ActionLabel) + `</a></p>`
	}

	footer := input.Footer
	if strings.TrimSpace(footer) == "" {
		footer = "This is an automated Dhune.np notification."
	}

	return `<!doctype html><html><body style="margin:0;background:#f4f6fb;font-family:Arial,Helvetica,sans-serif;color:#0f172a">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f6fb;padding:28px 12px">
<tr><td align="center">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;border-collapse:collapse">
<tr><td style="padding:0 0 14px;color:#040947;font-size:24px;font-weight:900">Dhune<span style="color:#ebbc01">.np</span></td></tr>
<tr><td style="background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;padding:28px;box-shadow:0 12px 30px rgba(15,23,42,.08)">
<h1 style="margin:0 0 12px;color:#040947;font-size:22px;line-height:1.3">` + html.EscapeString(input.Title) + `</h1>
<p style="margin:0;color:#334155;font-size:15px;line-height:1.7">` + html.EscapeString(input.Message) + `</p>` + details.String() + action + `
</td></tr>
<tr><td style="padding:16px 4px 0;color:#64748b;font-size:12px;line-height:1.6">` + html.EscapeString(footer) + `</td></tr>
</table>
</td></tr>
</table>
</body></html>`
}

func SendEmail(to, subject, htmlBody string) error {
	if strings.TrimSpace(to) == "" {
		return fmt.Errorf("send email: recipient is required")
	}

	if strings.TrimSpace(os.Getenv("RESEND_API_KEY")) != "" {
		return sendEmailWithResend(to, subject, htmlBody)
	}

	if hasSMTPConfig() {
		return sendEmailWithSMTP(to, subject, htmlBody)
	}

	return fmt.Errorf("RESEND_API_KEY is required for sending email")
}

func sendEmailWithResend(to, subject, htmlBody string) error {
	apiKey := strings.TrimSpace(os.Getenv("RESEND_API_KEY"))
	if apiKey == "" {
		return fmt.Errorf("RESEND_API_KEY is required for sending email")
	}

	from := resendFromAddress()
	if from == "" {
		return fmt.Errorf("send email: RESEND_FROM_EMAIL is required for sending email")
	}

	payload := struct {
		From    string   `json:"from"`
		To      []string `json:"to"`
		Subject string   `json:"subject"`
		HTML    string   `json:"html"`
		Text    string   `json:"text"`
	}{
		From:    from,
		To:      []string{strings.TrimSpace(to)},
		Subject: subject,
		HTML:    htmlBody,
		Text:    stripEmailHTML(htmlBody),
	}

	body, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("send email: build resend payload: %w", err)
	}

	req, err := http.NewRequest(http.MethodPost, resendEmailEndpoint, bytes.NewReader(body))
	if err != nil {
		return fmt.Errorf("send email: build resend request: %w", err)
	}
	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("User-Agent", "Dhune.np Backend/1.0")

	client := &http.Client{Timeout: 15 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("send email: resend request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
		responseBody, readErr := io.ReadAll(io.LimitReader(resp.Body, 4096))
		if readErr != nil {
			log.Printf("email: resend failed with status %d and unreadable response body: %v", resp.StatusCode, readErr)
			return fmt.Errorf("send email: resend returned status %d", resp.StatusCode)
		}

		log.Printf("email: resend failed with status %d: %s", resp.StatusCode, strings.TrimSpace(string(responseBody)))
		return fmt.Errorf("send email: resend returned status %d", resp.StatusCode)
	}

	return nil
}

func resendFromAddress() string {
	if from := strings.TrimSpace(os.Getenv("RESEND_FROM_EMAIL")); from != "" {
		return from
	}

	name := strings.TrimSpace(os.Getenv("RESEND_FROM_NAME"))
	email := strings.TrimSpace(os.Getenv("FROM_EMAIL"))
	if name != "" && email != "" {
		return fmt.Sprintf("%s <%s>", name, email)
	}

	return email
}

func hasSMTPConfig() bool {
	return strings.TrimSpace(os.Getenv("SMTP_HOST")) != "" &&
		strings.TrimSpace(os.Getenv("SMTP_PORT")) != "" &&
		strings.TrimSpace(os.Getenv("SMTP_USER")) != "" &&
		strings.TrimSpace(os.Getenv("SMTP_PASS")) != "" &&
		strings.TrimSpace(os.Getenv("FROM_EMAIL")) != ""
}

func sendEmailWithSMTP(to, subject, htmlBody string) error {
	port, err := strconv.Atoi(os.Getenv("SMTP_PORT"))
	if err != nil {
		return fmt.Errorf("send email: invalid SMTP_PORT: %w", err)
	}

	msg := gomail.NewMessage()
	msg.SetHeader("From", os.Getenv("FROM_EMAIL"))
	msg.SetHeader("To", to)
	msg.SetHeader("Subject", subject)
	msg.SetBody("text/html", htmlBody)
	msg.AddAlternative("text/plain", stripEmailHTML(htmlBody))

	dialer := gomail.NewDialer(
		os.Getenv("SMTP_HOST"),
		port,
		os.Getenv("SMTP_USER"),
		os.Getenv("SMTP_PASS"),
	)

	if err := dialer.DialAndSend(msg); err != nil {
		return fmt.Errorf("send email: %w", err)
	}

	return nil
}

func SendEmailAsync(to, subject, htmlBody string) {
	if strings.TrimSpace(to) == "" {
		return
	}
	go func() {
		if err := SendEmail(to, subject, htmlBody); err != nil {
			log.Printf("email: failed to send %q to %s: %v", subject, to, err)
		}
	}()
}

func SendPlatformEmailAsync(subject, htmlBody string) {
	to := strings.TrimSpace(os.Getenv("PLATFORM_NOTIFICATION_EMAIL"))
	if to == "" {
		log.Printf("email: PLATFORM_NOTIFICATION_EMAIL missing, skipped %q", subject)
		return
	}
	SendEmailAsync(to, subject, htmlBody)
}

func stripEmailHTML(value string) string {
	replacer := strings.NewReplacer("<br>", "\n", "<br/>", "\n", "<br />", "\n", "</p>", "\n", "</tr>", "\n")
	plain := replacer.Replace(value)
	var out strings.Builder
	inTag := false
	for _, r := range plain {
		switch r {
		case '<':
			inTag = true
		case '>':
			inTag = false
		default:
			if !inTag {
				out.WriteRune(r)
			}
		}
	}
	return html.UnescapeString(strings.TrimSpace(out.String()))
}
