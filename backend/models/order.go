package models

import "time"

type Order struct {
	ID              uint      `gorm:"primaryKey" json:"id"`
	UserID          string    `json:"user_id"`
	Status          string    `json:"status"`
	TotalAmount     float64   `json:"total_amount"`
	ShippingAddress string    `json:"shipping_address"`
	CreatedAt       time.Time `json:"created_at"`
	OrderItems      []OrderItem `gorm:"foreignKey:OrderID"`
}

type OrderItem struct {
	ID              uint    `gorm:"primaryKey" json:"id"`
	OrderID         uint    `json:"order_id"`   
	
	ProductID       uint    `json:"product_id"` 
	Quantity        int     `json:"quantity"`
	PriceAtPurchase float64 `json:"price_at_purchase"`
	Product Product `gorm:"foreignKey:ProductID"`
}

func (Order) TableName() string {
	return "orders"
}

func (OrderItem) TableName() string {
	return "order_items"
}
