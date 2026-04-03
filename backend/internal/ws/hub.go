package ws

import "sync"

type Hub struct {
	Clients    map[string]*Client
	Register   chan *Client
	Unregister chan *Client
	Broadcast  chan Message
	mu         sync.RWMutex
}

func NewHub() *Hub {
	return &Hub{
		Clients:    make(map[string]*Client),
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Broadcast:  make(chan Message),
	}
}

func (h *Hub) Run() {
	for {
		select {

		case client := <-h.Register:
			h.mu.Lock()
			h.Clients[client.ID] = client
			h.mu.Unlock()

		case client := <-h.Unregister:
			h.mu.Lock()
			if _, ok := h.Clients[client.ID]; ok {
				delete(h.Clients, client.ID)
				close(client.Send)
			}
			h.mu.Unlock()

		case message := <-h.Broadcast:
			h.mu.RLock()
			for _, client := range h.Clients {
				select {
				case client.Send <- message:
				default:
				}
			}
			h.mu.RUnlock()
		}
	}
}

func (h *Hub) SendToUser(userID string, msg Message) {
	h.mu.RLock()
	client, ok := h.Clients[userID]
	h.mu.RUnlock()
	if !ok {
		return
	}
	select {
	case client.Send <- msg:
	default:
	}
}

func (h *Hub) SendToVendor(vendorID string, msg Message) {
	h.SendToUser(vendorID, msg)
}

func (h *Hub) BroadcastToRole(role string, msg Message) {
	h.mu.RLock()
	defer h.mu.RUnlock()
	for _, client := range h.Clients {
		if client.Role != role {
			continue
		}
		select {
		case client.Send <- msg:
		default:
		}
	}
}

var defaultHub *Hub

func SetHub(hub *Hub) {
	defaultHub = hub
}

func SendToUser(userID string, msg Message) {
	if defaultHub == nil {
		return
	}
	defaultHub.SendToUser(userID, msg)
}

func SendToVendor(vendorID string, msg Message) {
	if defaultHub == nil {
		return
	}
	defaultHub.SendToVendor(vendorID, msg)
}

func BroadcastToRole(role string, msg Message) {
	if defaultHub == nil {
		return
	}
	defaultHub.BroadcastToRole(role, msg)
}
