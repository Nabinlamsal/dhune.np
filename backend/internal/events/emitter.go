package events

import (
	"sync"

	"github.com/Nabinlamsal/dhune.np/internal/ws"
)

type EventHandler func(Event)

var (
	eventHandler EventHandler
	initOnce     sync.Once
)

func RegisterHandler(handler EventHandler) {
	eventHandler = handler
}

func EmitEvent(event Event) {
	if eventHandler == nil {
		return
	}
	eventHandler(event)
}

func Init(hub *ws.Hub) {
	initOnce.Do(func() {
		ws.SetHub(hub)
		RegisterHandler(HandleEvent)
		ws.SetEventEmitter(func(eventType string, data interface{}) {
			EmitEvent(Event{
				Type: eventType,
				Data: data,
			})
		})
	})
}
