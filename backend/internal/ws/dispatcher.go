package ws

type Dispatcher struct {
	Hub *Hub
}

var emitEventFn func(eventType string, data interface{})

func NewDispatcher(hub *Hub) *Dispatcher {
	return &Dispatcher{Hub: hub}
}

func SetEventEmitter(fn func(eventType string, data interface{})) {
	emitEventFn = fn
}

func (d *Dispatcher) Emit(eventType string, data interface{}, targetID string) {
	_ = d.Hub
	_ = targetID
	if emitEventFn != nil {
		emitEventFn(eventType, data)
		return
	}

	d.Hub.Broadcast <- Message{
		Type: eventType,
		Data: data,
	}
}
