package controller

import (
	"github.com/Nabinlamsal/dhune.np/internal/utils"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (c *UserController) ApproveVendor(ctx *gin.Context) {
	userId, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		utils.Error(ctx, 400, "invalid user id")
		return
	}

	if err := c.userService.ApproveVendor(ctx, userId); err != nil {
		utils.Error(ctx, 400, err.Error())
		return
	}

	utils.Success(ctx, "vendor approved successfully")
}

func (c *UserController) RejectVendor(ctx *gin.Context) {
	userId, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		utils.Error(ctx, 400, "invalid user id")
		return
	}

	if err := c.userService.RejectVendor(ctx, userId); err != nil {
		utils.Error(ctx, 400, err.Error())
		return
	}

	utils.Success(ctx, "vendor rejected successfully")
}

func (c *UserController) ApproveBusinessUser(ctx *gin.Context) {
	userId, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		utils.Error(ctx, 400, "invalid user id")
		return
	}

	if err := c.userService.ApproveBusinessUser(ctx, userId); err != nil {
		utils.Error(ctx, 400, err.Error())
		return
	}

	utils.Success(ctx, "business user approved successfully")
}

func (c *UserController) RejectBusinessUser(ctx *gin.Context) {
	userId, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		utils.Error(ctx, 400, "invalid user id")
		return
	}

	if err := c.userService.RejectBusinessUser(ctx, userId); err != nil {
		utils.Error(ctx, 400, err.Error())
		return
	}

	utils.Success(ctx, "business user rejected successfully")
}
func (c *UserController) SuspendUser(ctx *gin.Context) {
	userId, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		utils.Error(ctx, 400, "invalid user id")
		return
	}
	if err := c.userService.SuspendUser(ctx, userId); err != nil {
		utils.Error(ctx, 400, err.Error())
		return
	}
	utils.Success(ctx, "user suspended successfully")
}
func (c *UserController) ReactivateUser(ctx *gin.Context) {
	userId, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		utils.Error(ctx, 400, "invalid user id")
		return
	}
	if err := c.userService.ReactivateUser(ctx, userId); err != nil {
		utils.Error(ctx, 400, err.Error())
		return
	}
	utils.Success(ctx, "suspended user reactivated successfully")
}
