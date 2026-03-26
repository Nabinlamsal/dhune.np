package ws

import (
	gorilla "github.com/gorilla/websocket"
)

type Message struct {
	Type     string      `json:"type"`
	Data     interface{} `json:"data"`
	TargetID string      `json:"targetId"` // user/vendor/admin
}

type Client struct {
	ID   string
	Conn *gorilla.Conn
	Send chan Message
}
