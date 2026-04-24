package utils

import (
	"fmt"
	"os"
	"strconv"

	gomail "gopkg.in/mail.v2"
)

func SendEmail(to, subject, htmlBody string) error {
	port, err := strconv.Atoi(os.Getenv("SMTP_PORT"))
	if err != nil {
		return err
	}

	msg := gomail.NewMessage()
	msg.SetHeader("From", os.Getenv("FROM_EMAIL"))
	msg.SetHeader("To", to)
	msg.SetHeader("Subject", subject)
	msg.SetBody("text/html", htmlBody)

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
