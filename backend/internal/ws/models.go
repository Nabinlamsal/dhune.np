package websockets

import "golang.org/x/net/websocket"

type Message struct {
	Type     string      `json:"type"`
	Data     interface{} `json:"data"`
	TargetID string      `json:"targetId"` // user/vendor/admin
}

type Client struct {
	ID   string
	Conn *websocket.Conn
	Send chan Message
}
