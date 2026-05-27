package service

import (
	"strings"
	"testing"
)

func TestAsksForPrivateData(t *testing.T) {
	privateMessages := []string{
		"Where is my order?",
		"Show my transaction ID",
		"Show my profile",
	}

	for _, message := range privateMessages {
		if !asksForPrivateData(message) {
			t.Fatalf("expected %q to be treated as private", message)
		}
	}

	if asksForPrivateData("How do I track my order?") {
		t.Fatal("expected general tracking guidance question to be allowed")
	}
}

func TestTopChunksFindsDhuneOverview(t *testing.T) {
	chunks := []knowledgeChunk{
		{Title: "About Dhune.np", Body: "Dhune.np is a laundry marketplace."},
		{Title: "Payment Methods", Body: "Khalti, eSewa, and Cash on Delivery are supported."},
	}

	result := topChunks(chunks, "What is Dhune.np?", 3)
	if len(result) == 0 || result[0].Title != "About Dhune.np" {
		t.Fatalf("expected about chunk first, got %#v", result)
	}
}

func TestFallbackPaymentMentionsSupportedMethods(t *testing.T) {
	reply := fallbackFromContext("How can I pay?", "Payment context")
	for _, expected := range []string{"Khalti", "eSewa", "Cash on Delivery"} {
		if !strings.Contains(reply, expected) {
			t.Fatalf("expected payment fallback to mention %s, got %q", expected, reply)
		}
	}
}
