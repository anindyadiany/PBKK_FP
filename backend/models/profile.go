package models

import (
	"time"
)

type Profile struct {
	ID        string    `gorm:"primaryKey" json:"id"`
	Email     string    `json:"email"`
	FirstName string    `json:"first_name"`
	LastName  string    `json:"last_name"`
	Role      string    `json:"role"`
	CreatedAt time.Time `json:"created_at"`
}

func (Profile) TableName() string {
	return "profiles"
}
