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
  description?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [address, setAddress] = useState("");
  const productId = searchParams.get("product_id");
  const qty = Number(searchParams.get("qty") || 1);
  const addressParam = searchParams.get("address") || "";

  useEffect(() => {
    if (addressParam) {
      setAddress(decodeURIComponent(addressParam));
    }

    const checkAuthAndFetchData = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

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
  }, [productId, router, addressParam]);

  const handlePayment = async () => {
    if (!product) return;
    if (!address.trim()) {
      alert("Please enter a shipping address.");
      return;
    }

    setProcessing(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/login");
        return;
      }

      const payload = {
        user_id: session.user.id,
        shipping_address: address,
        items: [
          {
            product_id: Number(productId),
            quantity: qty,
          },
        ],
      };
      const response = await fetch("http://localhost:8080/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to process order on server");
      }

      alert("Order placed successfully!");
      router.push("/orders");
    } catch (error: any) {
      console.error(error);
      alert("Failed to place order: " + error.message);
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
        <p className="text-red-500">Product not found</p>
        <button
          onClick={() => router.back()}
          className="text-[#69995D] underline font-bold"
        >
          Go Back
        </button>
      </main>
    );
  }

  const total = product.price * qty;

  return (
    <main className="min-h-screen bg-white font-sans">
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-[#1A1A1A] inline-block relative pb-4 uppercase">
            CHECKOUT
            <span className="absolute bottom-0 left-0 w-full h-1.5 bg-[#69995D] rounded-full"></span>
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Shipping Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Delivery Address
                </label>
                <textarea
                  rows={4}
                  placeholder="Street, City, Zip Code, Country..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-gray-100 text-gray-900 border border-transparent focus:bg-white focus:border-[#69995D] rounded-lg p-4 focus:outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>
          <div className="bg-[#F9F9F9] p-6 rounded-xl h-fit">
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-4">
              Order Summary
            </h2>
            <div className="flex gap-4 mb-6">
              <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex items-center justify-center border border-gray-200">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <span className="text-xs text-gray-400">No Image</span>
                )}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-500">Qty: {qty}</p>
              </div>
              <div className="ml-auto">
                <p className="font-bold text-gray-900">
                  ${(product.price * qty).toFixed(2)}
                </p>
              </div>
            </div>
            <div className="space-y-2 border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200 mt-2">
                <span>Total</span>
                <span className="text-[#69995D]">${total.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handlePayment}
              disabled={processing}
              className="w-full bg-[#69995D] hover:bg-[#5a8e4e] text-white py-4 rounded-lg font-bold text-lg transition-all shadow-md transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {processing ? "Processing Order..." : "Confirm & Pay"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
