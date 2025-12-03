"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/app/components/adminnavbar";
import ProductForm from "@/app/components/admin/productform";
import { ChevronLeft } from "lucide-react";

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
      router.push("/admin"); 
      
    } catch (error) {
      console.error(error);
      alert("Error adding product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white font-sans pb-20">
      <AdminNavbar />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <button 
          onClick={() => router.push("/admin")} 
          className="mb-8 flex items-center gap-2 text-gray-500 hover:text-[#69995D] transition-colors font-medium"
        >
          <ChevronLeft size={20} /> Back to Dashboard
        </button>
        <div className="text-center mb-12">
            <h1 className="text-6xl font-bold text-[#1A1A1A] inline-block relative pb-4 tracking-tight">
                ADD PRODUCT
                <span className="absolute bottom-0 left-0 w-full h-2 bg-[#69995D] rounded-full"></span>
            </h1>
        </div>
        <div className="bg-[#F9F9F9] rounded-xl p-8 border border-gray-100 shadow-sm">
           <ProductForm mode="add" onSubmit={handleAdd} loading={loading} />
        </div>
      </div>
    </main>
  );
}