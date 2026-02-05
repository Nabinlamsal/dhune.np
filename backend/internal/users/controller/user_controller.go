package controller

import (
	"strconv"
	"strings"

	"github.com/Nabinlamsal/dhune.np/internal/users/service"
	"github.com/Nabinlamsal/dhune.np/internal/utils"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type UserController struct {
	userService *service.UserService
}

func NewUserController(userService *service.UserService) *UserController {
	return &UserController{userService: userService}
}

func (c *UserController) GetFilteredUsers(ctx *gin.Context) {
	rolesStr := ctx.Query("roles")

	var roles []string
	if rolesStr != "" {
		roles = strings.Split(rolesStr, ",")
	}

	search := ctx.Query("search")
	status := ctx.Query("status")

	var statusPtr *string
	if status != "" {
		statusPtr = &status
	}

	var searchPtr *string
	if search != "" {
		searchPtr = &search
	}

	limit, err := strconv.Atoi(ctx.DefaultQuery("limit", "10"))
	if err != nil {
		utils.Error(ctx, 400, "invalid limit")
		return
	}

	offset, err := strconv.Atoi(ctx.DefaultQuery("offset", "0"))
	if err != nil {
		utils.Error(ctx, 400, "invalid offset")
		return
	}

	users, err := c.userService.GetUsersFiltered(
		ctx,
		roles,
		statusPtr,
		searchPtr,
		int32(limit),
		int32(offset),
	)
	if err != nil {
		utils.Error(ctx, 400, err.Error())
		return
	}

	utils.Success(ctx, gin.H{"users": users})
}

func (c *UserController) GetUserDetail(ctx *gin.Context) {
	userIdStr := ctx.Param("id")
	if userIdStr == "" {
		utils.Error(ctx, 400, "user id is required")
		return
	}

	userId, err := uuid.Parse(userIdStr)
	if err != nil {
		utils.Error(ctx, 400, "invalid user id")
		return
	}

	userDetail, err := c.userService.GetUserDetail(ctx, userId)
	if err != nil {
		utils.Error(ctx, 404, err.Error())
		return
	}

	utils.Success(ctx, gin.H{"userDetail": userDetail})
}
