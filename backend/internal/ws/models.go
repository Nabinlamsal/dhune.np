package ws

import (
	gorilla "github.com/gorilla/websocket"
)

type Message struct {
	Type string      `json:"type"`
	Data interface{} `json:"data"`
}

type Client struct {
	ID   string
	Role string
	Conn *gorilla.Conn
	Send chan Message
}
