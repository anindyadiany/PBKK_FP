package main

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var db *gorm.DB

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("error loading .env file")
	}

	dsn := os.Getenv("DB_URL")
	var err error

	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("failed to connect to database:", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		log.Fatal("failed to get generic database object")
	}

	if err := sqlDB.Ping(); err != nil {
		log.Fatal("database ping failed")
	}

	log.Println("successfully connected to supabase database and pinged the database")
}