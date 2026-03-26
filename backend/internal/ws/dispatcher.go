package ws

type Dispatcher struct {
	Hub *Hub
}

func NewDispatcher(hub *Hub) *Dispatcher {
	return &Dispatcher{Hub: hub}
}

func (d *Dispatcher) Emit(eventType string, data interface{}, targetID string) {
	msg := Message{
		Type:     eventType,
		Data:     data,
		TargetID: targetID,
	}

	d.Hub.Broadcast <- msg
}
