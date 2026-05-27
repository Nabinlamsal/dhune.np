package service

type AskInput struct {
	Message   string
	SessionID string
}

type AskOutput struct {
	Reply string `json:"reply"`
}
