package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"pear.com/app/config"
	"pear.com/app/models"
)

type CreateOrderRequest struct {
	UserID          string `json:"user_id"`
	ShippingAddress string `json:"shipping_address"`
	Items           []struct {
		ProductID uint `json:"product_id"`
		Quantity  int  `json:"quantity"`
	} `json:"items"`
}

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

func CreateOrder(c *gin.Context) {
	var req CreateOrderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input data"})
		return
	}

	if req.UserID == "" || req.ShippingAddress == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID and Shipping Address are required"})
		return
	}

	tx := config.DB.Begin()

	newOrder := models.Order{
		UserID:          req.UserID,
		Status:          "pending",
		ShippingAddress: req.ShippingAddress,
		TotalAmount:     0,
	}

	if err := tx.Create(&newOrder).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order"})
		return
	}

	var totalAmount float64

	for _, itemReq := range req.Items {
		var product models.Product

		if err := tx.First(&product, itemReq.ProductID).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusBadRequest, gin.H{"error": "Product not found"})
			return
		}

		if product.Stock < itemReq.Quantity {
			tx.Rollback()
			c.JSON(http.StatusBadRequest, gin.H{"error": "Insufficient stock for: " + product.Name})
			return
		}

		product.Stock -= itemReq.Quantity
		
		if err := tx.Save(&product).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update stock"})
			return
		}

		itemTotal := product.Price * float64(itemReq.Quantity)
		totalAmount += itemTotal

		orderItem := models.OrderItem{
			OrderID:         newOrder.ID,
			ProductID:       product.ID,
			Quantity:        itemReq.Quantity,
			PriceAtPurchase: product.Price,
		}

		if err := tx.Create(&orderItem).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save order items"})
			return
		}
	}

	if err := tx.Model(&newOrder).Update("total_amount", totalAmount).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update order total"})
		return
	}

	tx.Commit()

	c.JSON(http.StatusCreated, gin.H{
		"message": "Order placed successfully",
		"order":   newOrder,
	})
}