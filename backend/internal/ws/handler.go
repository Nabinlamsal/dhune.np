package websockets

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // change in production
	},
}

func ServeWS(hub *Hub) gin.HandlerFunc {
	return func(c *gin.Context) {

		userID := c.Query("userId") // later replace with JWT

		conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
		if err != nil {
			return
		}

		client := &Client{
			ID:   userID,
			Conn: conn,
			Send: make(chan Message),
		}

		hub.Register <- client

		go writePump(client)
		go readPump(hub, client)
	}
}

func readPump(hub *Hub, client *Client) {
	defer func() {
		hub.Unregister <- client
		client.Conn.Close()
	}()

	for {
		var msg Message
		if err := client.Conn.ReadJSON(&msg); err != nil {
			break
		}
	}
}

func writePump(client *Client) {
	for msg := range client.Send {
		client.Conn.WriteJSON(msg)
	}
}
