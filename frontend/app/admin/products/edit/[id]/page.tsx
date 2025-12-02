"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminNavbar from "@/app/components/adminnavbar";
import ProductForm from "@/app/components/admin/productform";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);

  // Fetch existing data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:8080/admin/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const json = await res.json();
        setProduct(json.data);
      } catch (error) {
        console.error(error);
        alert("Failed to load product details");
        router.push("/admin");
      }
    };
    if (id) fetchProduct();
  }, [id, router]);

  // Handle Update
  const handleUpdate = async (data: any) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          price: Number(data.price),
          stock_quantity: Number(data.stock_quantity),
        }),
      });

      if (!res.ok) throw new Error("Failed to update");
      
      alert("Product updated successfully!");
      router.push("/admin");
    } catch (error) {
      console.error(error);
      alert("Error updating product");
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const res = await fetch(`http://localhost:8080/admin/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      router.push("/admin");
    } catch (error) {
      console.error(error);
      alert("Error deleting product");
    }
  };

  if (!product) return <div className="p-10 text-center">Loading...</div>;

  return (
    <main className="min-h-screen bg-white pb-20">
      <AdminNavbar />
      <div className="container mx-auto px-4 py-12">
        <ProductForm 
            mode="edit" 
            initialData={product} 
            onSubmit={handleUpdate} 
            onDelete={handleDelete}
            loading={loading} 
        />
      </div>
    </main>
  );
}