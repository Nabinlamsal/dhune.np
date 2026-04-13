package ws

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	gorilla "github.com/gorilla/websocket"
)

var upgrader = gorilla.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func ServeWS(hub *Hub, validateToken func(string) (string, string, error)) gin.HandlerFunc {
	return func(c *gin.Context) {
		token := extractToken(c)
		if token == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "authorization token required"})
			return
		}

		userID, role, err := validateToken(token)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid or expired token"})
			return
		}

		conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
		if err != nil {
			return
		}

		client := &Client{
			ID:     uuid.NewString(),
			UserID: userID,
			Role:   role,
			Conn:   conn,
			Send:   make(chan Message, 32),
		}

		hub.Register <- client

		go writePump(client)
		go readPump(hub, client)
	}
}

func extractToken(c *gin.Context) string {
	if token := strings.TrimSpace(c.Query("token")); token != "" {
		return token
	}

	authHeader := strings.TrimSpace(c.GetHeader("Authorization"))
	parts := strings.SplitN(authHeader, " ", 2)
	if len(parts) == 2 && strings.EqualFold(parts[0], "Bearer") {
		return strings.TrimSpace(parts[1])
	}

	return ""
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
