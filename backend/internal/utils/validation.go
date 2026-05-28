package utils

import "regexp"

var phoneRegex = regexp.MustCompile(`^\d{10}$`)
var (
	uppercaseRegex = regexp.MustCompile(`[A-Z]`)
	lowercaseRegex = regexp.MustCompile(`[a-z]`)
	numberRegex    = regexp.MustCompile(`\d`)
)

func IsValidPhone(phone string) bool {
	return phoneRegex.MatchString(phone)
}

func IsValidPassword(password string) bool {
	return len(password) >= 6 &&
		uppercaseRegex.MatchString(password) &&
		lowercaseRegex.MatchString(password) &&
		numberRegex.MatchString(password)
}
