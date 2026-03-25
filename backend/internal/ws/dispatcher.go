package websockets

import (
	"net/http"

	"github.com/gin-gonic/gin"
	gorilla "github.com/gorilla/websocket"
	"golang.org/x/net/websocket"
)

type Dispatcher struct {
	Hub *websocket.Hub
}

func NewDispatcher(hub *websocket.Hub) *Dispatcher {
	return &Dispatcher{Hub: hub}
}

func (d *Dispatcher) Emit(eventType string, data interface{}, targetID string) {
	msg := websocket.Message{
		Type:     eventType,
		Data:     data,
		TargetID: targetID,
	}

	d.Hub.Broadcast <- msg
}
