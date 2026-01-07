package utils

import "github.com/gin-gonic/gin"

func Created(utils *gin.Context, responce interface{}) {
	utils.JSON(201, gin.H{"success": true, "data": responce})
}

func Success(utils *gin.Context, responce interface{}) {
	utils.JSON(200, gin.H{"success": true, "data": responce})
}

func Error(utils *gin.Context, status int, msg string) {
	utils.JSON(status, gin.H{"success": false, "error": msg})
}
