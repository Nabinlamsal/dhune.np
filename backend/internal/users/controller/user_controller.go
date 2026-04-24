package controller

import (
	"errors"
	"strconv"
	"strings"

	"github.com/Nabinlamsal/dhune.np/internal/users/dto"
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
func (c *UserController) GetMyProfile(ctx *gin.Context) {
	userIdVal, exists := ctx.Get("user_id")
	if !exists {
		utils.Error(ctx, 401, "unauthorized")
		return
	}

	var userId uuid.UUID
	switch v := userIdVal.(type) {
	case uuid.UUID:
		userId = v
	case string:
		parsed, err := uuid.Parse(v)
		if err != nil {
			utils.Error(ctx, 500, "invalid user id in context")
			return
		}
		userId = parsed
	default:
		utils.Error(ctx, 500, "invalid user id in context")
		return
	}

	profile, err := c.userService.GetMyProfile(ctx, userId)
	if err != nil {
		utils.Error(ctx, 404, err.Error())
		return
	}

	utils.Success(ctx, gin.H{"profile": profile})
}

func (c *UserController) UpdateMyProfile(ctx *gin.Context) {
	userID, err := currentUserID(ctx)
	if err != nil {
		utils.Error(ctx, 401, err.Error())
		return
	}

	var body dto.UpdateProfileRequestDTO
	if err := ctx.ShouldBindJSON(&body); err != nil {
		utils.Error(ctx, 400, err.Error())
		return
	}

	profile, err := c.userService.UpdateMyProfile(ctx, userID, body)
	if err != nil {
		utils.Error(ctx, 400, err.Error())
		return
	}

	utils.Success(ctx, gin.H{"profile": profile})
}

func (c *UserController) UploadProfileImage(ctx *gin.Context) {
	userID, err := currentUserID(ctx)
	if err != nil {
		utils.Error(ctx, 401, err.Error())
		return
	}

	file, err := ctx.FormFile("profile_image")
	if err != nil {
		utils.Error(ctx, 400, "profile_image is required")
		return
	}

	profile, err := c.userService.UploadProfileImage(ctx, userID, file)
	if err != nil {
		utils.Error(ctx, 400, err.Error())
		return
	}

	utils.Success(ctx, gin.H{"profile": profile})
}

func currentUserID(ctx *gin.Context) (uuid.UUID, error) {
	userIdVal, exists := ctx.Get("user_id")
	if !exists {
		return uuid.Nil, errors.New("unauthorized")
	}

	switch v := userIdVal.(type) {
	case uuid.UUID:
		return v, nil
	case string:
		return uuid.Parse(v)
	default:
		return uuid.Nil, errors.New("invalid user id in context")
	}
}
