package controllers

import (
	"math"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"pear.com/app/config"
	"pear.com/app/models"
)

func AdminCreateProduct(c *gin.Context) {
	var input models.Product
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	input.IsActive = true

	if err := config.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create product: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": input})
}

func AdminGetProducts(c *gin.Context) {
	var products []models.Product
	if err := config.DB.Where("is_active = ?", true).Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch products"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": products})
}

func AdminUpdateProduct(c *gin.Context) {
	id := c.Param("id")
	var product models.Product

	if err := config.DB.First(&product, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}
	var input struct {
		Name          string  `json:"name"`
		Description   string  `json:"description"`
		Price         float64 `json:"price"`
		StockQuantity int     `json:"stock_quantity"`
		ImageURL      string  `json:"image_url"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input data"})
		return
	}

	product.Name = input.Name
	product.Description = input.Description
	product.Price = input.Price
	product.Stock = input.StockQuantity
	product.ImageURL = input.ImageURL

	if err := config.DB.Save(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update product"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": product})
}

func AdminDeleteProduct(c *gin.Context) {
	id := c.Param("id")
	var product models.Product

	if err := config.DB.First(&product, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	config.DB.Model(&product).Update("is_active", false)

	c.JSON(http.StatusOK, gin.H{"message": "Product deleted successfully"})
}

func AdminGetAllOrders(c *gin.Context) {
	var orders []models.Order
	var total int64

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	status := c.Query("status")
	offset := (page - 1) * limit
	query := config.DB.Model(&models.Order{})

	if status != "" {
		if status == "processed" {
			query = query.Where("LOWER(status) IN ?", []string{"pending", "paid"})
		} else {
			query = query.Where("LOWER(status) = ?", status)
		}
	}

	query.Count(&total)

	result := query.
		Preload("OrderItems.Product").
		Order("created_at desc").
		Limit(limit).
		Offset(offset).
		Find(&orders)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch orders"})
		return
	}

	lastPage := math.Ceil(float64(total) / float64(limit))

	c.JSON(http.StatusOK, gin.H{
		"data": orders,
		"meta": gin.H{
			"total":     total,
			"page":      page,
			"last_page": lastPage,
		},
	})
}
func AdminUpdateOrderStatus(c *gin.Context) {
	id := c.Param("id")
	var input struct {
		Status string `json:"status"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	validStatuses := map[string]bool{
		"pending": true, "paid": true, "shipped": true, "arrived": true, "cancelled": true, "being processed": true,
	}
	if !validStatuses[input.Status] {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid status value"})
		return
	}

	result := config.DB.Model(&models.Order{}).Where("id = ?", id).Update("status", input.Status)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update order"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Order status updated", "status": input.Status})
}

func AdminGetProductByID(c *gin.Context) {
	id := c.Param("id")
	var product models.Product

	if err := config.DB.First(&product, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": product})
}

func AdminGetOrderStats(c *gin.Context) {
	var processed, shipped, arrived int64

	config.DB.Model(&models.Order{}).
		Where("LOWER(status) IN ?", []string{"pending"}).
		Count(&processed)

	config.DB.Model(&models.Order{}).
		Where("LOWER(status) = ?", "shipped").
		Count(&shipped)

	config.DB.Model(&models.Order{}).
		Where("LOWER(status) = ?", "arrived").
		Count(&arrived)

	c.JSON(http.StatusOK, gin.H{
		"processed": processed,
		"shipped":   shipped,
		"arrived":   arrived,
	})
}
