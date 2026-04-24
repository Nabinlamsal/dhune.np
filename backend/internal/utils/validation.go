package utils

import "regexp"

var phoneRegex = regexp.MustCompile(`^\d{10}$`)

func IsValidPhone(phone string) bool {
	return phoneRegex.MatchString(phone)
}
