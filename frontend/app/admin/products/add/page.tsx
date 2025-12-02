"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/app/components/adminnavbar";
import ProductForm from "@/app/components/admin/productform";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAdd = async (data: any) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          price: Number(data.price),
          stock_quantity: Number(data.stock_quantity),
        }),
      });

      if (!res.ok) throw new Error("Failed to add product");
      
      alert("Product added successfully!");
      router.push("/admin"); // Redirect to dashboard
    } catch (error) {
      console.error(error);
      alert("Error adding product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white pb-20">
      <AdminNavbar />
      <div className="container mx-auto px-4 py-12">
        <ProductForm mode="add" onSubmit={handleAdd} loading={loading} />
      </div>
    </main>
  );
}