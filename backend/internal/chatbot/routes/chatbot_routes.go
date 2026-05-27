package routes

import (
	"github.com/Nabinlamsal/dhune.np/internal/chatbot/controller"
	"github.com/gin-gonic/gin"
)

func RegisterChatbotRoutes(router *gin.Engine, chatbotHandler *controller.ChatbotHandler) {
	router.POST("/support/chat", chatbotHandler.Ask)
}
