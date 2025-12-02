"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link"; 
import { supabase } from "@/lib/supabaseClient";
import AdminNavbar from "@/app/components/adminnavbar";
import AdminProductCard from "@/app/components/adminproductcard";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock_quantity: number;
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || session.user.user_metadata?.role !== "admin") {
        window.location.href = "/";
        return;
      }

      try {
        const res = await fetch("http://localhost:8080/admin/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    init();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`http://localhost:8080/admin/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      alert("Error deleting product");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Dashboard...</div>;

  return (
    <main className="min-h-screen bg-white">
      <AdminNavbar />

      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
            <h1 className="text-5xl font-bold text-[#1A1A1A] inline-block relative pb-4">
                YOUR PRODUCTS
                <span className="absolute bottom-0 left-0 w-full h-1.5 bg-[#69995D] rounded-full"></span>
            </h1>
        </div>

        {/* --- UPDATED BUTTON --- */}
        <div className="mb-8 flex justify-end">
            <Link href="/admin/products/add">
                <button className="bg-[#69995D] hover:bg-[#5a8e4e] text-white text-sm font-medium px-8 py-3 rounded-lg transition-colors shadow-sm">
                    + Add New Product
                </button>
            </Link>
        </div>

        <div className="mb-16">
            {products.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-500 mb-4">No products found.</p>
                    <Link href="/admin/products/add">
                        <button className="text-[#69995D] font-bold hover:underline">
                            Create your first product
                        </button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <AdminProductCard
                            key={product.id}
                            id={product.id}
                            title={product.name}
                            description={product.description}
                            price={product.price}
                            image_url={product.image_url}
                            onDelete={handleDelete}
                            stock_quantity={product.stock_quantity}
                        />
                    ))}
                </div>
            )}
        </div>
      </div>
    </main>
  );
}