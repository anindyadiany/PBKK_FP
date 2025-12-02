"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import { supabase } from "@/lib/supabaseClient";

interface Product {
  id: number;
  name: string;
  price: number;
  image_url?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);

  const productId = searchParams.get("product_id");
  const qty = Number(searchParams.get("qty") || 1);

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.replace("/login"); 
          return;
        }

        if (productId) {
          const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("id", productId)
            .single();
          
          if (error) throw error;
          setProduct(data);
        }
      } catch (error) {
        console.error("Error loading checkout:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchData();
  }, [productId, router]);

    const handlePayment = async () => {
  if (!product) return;
  setProcessing(true);

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.replace("/login");
      return;
    }

    const total = product.price * qty;

    // 1️⃣ Insert into orders table
    const { data: newOrder, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          user_id: session.user.id,
          total_amount: total,
          status: "pending"
        }
      ])
      .select()
      .single();

    if (orderError) throw orderError;

    // 2️⃣ Insert the purchased item into order_items table
    const { error: orderItemError } = await supabase
      .from("order_items")
      .insert([
        {
          order_id: newOrder.id,
          product_id: Number(productId),
          quantity: qty,
          price_at_purchase: product.price
        }
      ]);

    if (orderItemError) throw orderItemError;

    // 3️⃣ Redirect
    router.push("/checkout/success");

  } catch (error: any) {
    alert(error.message);
  } finally {
    setProcessing(false);
  }
};




  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500 animate-pulse">Loading checkout...</p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-red-500">Product not found.</p>
        <button onClick={() => router.back()} className="text-blue-500 underline">
          Go Back
        </button>
      </main>
    );
  }

  const total = product.price * qty;

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 py-20 max-w-3xl">
        <h1 className="text-3xl font-bold italic mb-8 text-gray-900">
          Checkout
        </h1>

        <div className="bg-[#F9F9F9] p-6 rounded-xl shadow-lg space-y-6">
          <div className="flex gap-6 items-center">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                  No Image
                </div>
              )}
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {product.name}
              </h2>
              <p className="text-gray-600 text-sm mt-1">Qty: {qty}</p>
              <p className="font-bold text-lg text-gray-900 mt-1">
                ${product.price}
              </p>
            </div>
          </div>

          <div className="flex justify-between border-t border-gray-200 pt-4">
            <span className="text-lg font-semibold text-gray-700">Total</span>
            <span className="text-2xl font-bold text-[#69995D]">
              ${total.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handlePayment}
            disabled={processing}
            className="w-full bg-[#69995D] text-white py-3 rounded-lg hover:bg-[#5F8A54] font-bold text-lg transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </div>
      <Footer />
    </main>
  );
}
