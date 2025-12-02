package models

import "time"

type Order struct {
	ID              string    `gorm:"primaryKey" json:"id"`
	UserID          string    `json:"user_id"`
	Status          string    `json:"status"`
	TotalAmount     float64   `json:"total_amount"`
	ShippingAddress string    `json:"shipping_address"`
	CreatedAt       time.Time `json:"created_at"`

	OrderItems []OrderItem `gorm:"foreignKey:OrderID" json:"items,omitempty"`
}

type OrderItem struct {
	ID              string  `gorm:"primaryKey" json:"id"`
	OrderID         string  `json:"order_id"`
	ProductID       string  `json:"product_id"`
	Quantity        int     `json:"quantity"`
	PriceAtPurchase float64 `json:"price_at_purchase"`

	Product Product `json:"product,omitempty"`
}

func (Order) TableName() string {
	return "orders"
}

func (OrderItem) TableName() string {
	return "order_items"
}
