package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"pear.com/app/config"
	"pear.com/app/models"
)

// GET /orders/user/:user_id
func GetUserOrders(c *gin.Context) {
	userID := c.Param("user_id")

	var orders []models.Order

	err := config.DB.
		Preload("OrderItems.Product").
		Where("user_id = ?", userID).
		Order("created_at DESC").
		Find(&orders).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch orders"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": orders})
}
