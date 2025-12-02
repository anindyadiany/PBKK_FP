package main

import (
	"log"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	
	"pear.com/app/config"
	"pear.com/app/controllers"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("error loading .env file")
	}

	config.ConnectDB()
	
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"}, // Allow Next.js
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	admin := r.Group("/admin")
	{
		admin.POST("/products", controllers.AdminCreateProduct)
		admin.GET("/products", controllers.AdminGetProducts)
		admin.GET("/products/:id", controllers.AdminGetProductByID) 
		admin.PUT("/products/:id", controllers.AdminUpdateProduct)
		admin.DELETE("/products/:id", controllers.AdminDeleteProduct)
		admin.GET("/orders/stats", controllers.AdminGetOrderStats)

		admin.GET("/orders", controllers.AdminGetAllOrders)
		admin.PATCH("/orders/:id/status", controllers.AdminUpdateOrderStatus)
	}

	r.Run(":8080")
}