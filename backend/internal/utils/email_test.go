package utils

import "testing"

func TestSelectedEmailProviderDeliveryDisabled(t *testing.T) {
	t.Setenv("EMAIL_DELIVERY_ENABLED", "false")
	t.Setenv("EMAIL_PROVIDER", "resend")
	t.Setenv("RESEND_API_KEY", "")

	provider, err := selectedEmailProvider()
	if err != nil {
		t.Fatalf("selectedEmailProvider() error = %v", err)
	}
	if provider != emailProviderDisabled {
		t.Fatalf("selectedEmailProvider() = %q, want %q", provider, emailProviderDisabled)
	}
}

func TestSelectedEmailProviderPrefersResendWhenAPIKeyExists(t *testing.T) {
	t.Setenv("EMAIL_DELIVERY_ENABLED", "true")
	t.Setenv("EMAIL_PROVIDER", "smtp")
	t.Setenv("RESEND_API_KEY", "re_test")
	t.Setenv("SMTP_HOST", "smtp.example.com")
	t.Setenv("SMTP_PORT", "587")
	t.Setenv("SMTP_USER", "user")
	t.Setenv("SMTP_PASS", "pass")
	t.Setenv("FROM_EMAIL", "smtp@example.com")

	provider, err := selectedEmailProvider()
	if err != nil {
		t.Fatalf("selectedEmailProvider() error = %v", err)
	}
	if provider != emailProviderResend {
		t.Fatalf("selectedEmailProvider() = %q, want %q", provider, emailProviderResend)
	}
}

func TestSelectedEmailProviderFallsBackToSMTP(t *testing.T) {
	t.Setenv("EMAIL_DELIVERY_ENABLED", "true")
	t.Setenv("EMAIL_PROVIDER", "")
	t.Setenv("RESEND_API_KEY", "")
	t.Setenv("SMTP_HOST", "smtp.example.com")
	t.Setenv("SMTP_PORT", "587")
	t.Setenv("SMTP_USER", "user")
	t.Setenv("SMTP_PASS", "pass")
	t.Setenv("FROM_EMAIL", "smtp@example.com")

	provider, err := selectedEmailProvider()
	if err != nil {
		t.Fatalf("selectedEmailProvider() error = %v", err)
	}
	if provider != emailProviderSMTP {
		t.Fatalf("selectedEmailProvider() = %q, want %q", provider, emailProviderSMTP)
	}
}

func TestResendFromAddressIncludesNameAndEmail(t *testing.T) {
	t.Setenv("RESEND_FROM_NAME", "Dhune.np")
	t.Setenv("RESEND_FROM_EMAIL", "no-reply@dhune.nabinlamsal.com")

	got := resendFromAddress()
	want := "Dhune.np <no-reply@dhune.nabinlamsal.com>"
	if got != want {
		t.Fatalf("resendFromAddress() = %q, want %q", got, want)
	}
}
