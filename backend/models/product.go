package models

import (
	"time"
)

type Product struct {
	ID          uint    `gorm:"primaryKey" json:"id"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
	Stock       int     `gorm:"column:stock_quantity" json:"stock_quantity"`

	CreatedAt time.Time `json:"created_at"`
	ImageURL  string    `json:"image_url"`
	IsActive  bool      `json:"is_active"`
}

func (Product) TableName() string {
	return "products"
}
