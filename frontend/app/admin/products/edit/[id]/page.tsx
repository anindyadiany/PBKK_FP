"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminNavbar from "@/app/components/adminnavbar";
import ProductForm from "@/app/components/admin/productform";
import { ChevronLeft } from "lucide-react";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);

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

  if (!product) {
    return (
        <main className="min-h-screen bg-white flex items-center justify-center">
            <p className="text-gray-500 animate-pulse text-lg">Loading product details...</p>
        </main>
    );
  }

  return (
    <main className="min-h-screen bg-white font-sans pb-20">
      <AdminNavbar />
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        
        {/* Back Button */}
        <button 
          onClick={() => router.push("/admin")} 
          className="mb-8 flex items-center gap-2 text-gray-500 hover:text-[#69995D] transition-colors font-medium"
        >
          <ChevronLeft size={20} /> Back to Dashboard
        </button>

        <div className="text-center mb-12">
            <h1 className="text-6xl font-bold text-[#1A1A1A] inline-block relative pb-4 tracking-tight">
                EDIT PRODUCT
                <span className="absolute bottom-0 left-0 w-full h-2 bg-[#69995D] rounded-full"></span>
            </h1>
        </div>

        <div className="bg-[#F9F9F9] rounded-xl p-8 border border-gray-100 shadow-sm">
            <ProductForm 
                mode="edit" 
                initialData={product} 
                onSubmit={handleUpdate} 
                onDelete={handleDelete}
                loading={loading} 
            />
        </div>
      </div>
    </main>
  );
}