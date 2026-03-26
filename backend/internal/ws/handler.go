package ws

import (
	"net/http"

	"github.com/gin-gonic/gin"
	gorilla "github.com/gorilla/websocket"
)

var upgrader = gorilla.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func ServeWS(hub *Hub) gin.HandlerFunc {
	return func(c *gin.Context) {

		userID := c.Query("userId")
		if userID == "" {
			c.JSON(400, gin.H{"error": "userId required"})
			return
		}

		conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
		if err != nil {
			return
		}

		client := &Client{
			ID:   userID,
			Conn: conn,
			Send: make(chan Message, 10), // buffered
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
	defer client.Conn.Close()

	for msg := range client.Send {
		if err := client.Conn.WriteJSON(msg); err != nil {
			break
		}
	}
}
