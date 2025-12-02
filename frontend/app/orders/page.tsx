"use client";

import Navbar from "@/app/components/navbar";
import { Package, Clock, CheckCircle2 } from "lucide-react";

// --- Hardcoded product database (from your SQL)
const PRODUCT_TABLE: Record<number, any> = {
  1: {
    id: 1,
    name: "Labubu Small",
    description: "This is a description for Labubu Small.",
    price: 1.5,
    image_url: "/images/display_1.jpg",
  },
  2: {
    id: 2,
    name: "Labubu Halloween",
    description: "This is a special Halloween edition Labubu.",
    price: 3.0,
    image_url: "/images/display_3.jpg",
  },
  3: {
    id: 3,
    name: "Labubu Glasses",
    description: "This Labubu figure comes with adorable glasses.",
    price: 2.75,
    image_url: "/images/display_2.jpg",
  },
  4: {
    id: 4,
    name: "Labubu Sparkly",
    description: "This Labubu figure comes with some sparkling sparkles.",
    price: 2.8,
    image_url: "/images/display_4.jpg",
  },
  5: {
    id: 5,
    name: "Labubu Ori",
    description:
      "An original Labubu figure with unique detailing and a premium collectible feel.",
    price: 2.4,
    image_url: "/images/display_8.jpg.webp",
  },
  6: {
    id: 6,
    name: "Labubu Rainbow",
    description:
      "A colorful Labubu edition featuring vibrant rainbow hues and playful charm.",
    price: 3.8,
    image_url: "/images/display_10.webp",
  },
  7: {
    id: 7,
    name: "Labubu Food",
    description:
      "A cute Labubu figure inspired by food-themed designs, perfect for display and gifting.",
    price: 2.75,
    image_url: "/images/display_4.jpg.webp",
  },
};

export default function UserOrdersPage() {
  // Hardcoded user order list linked to product table
  const orders = [
    { id: 101, status: "shipped", total_amount: 3.0, product_id: 2, quantity: 1 },
    { id: 102, status: "arrived", total_amount: 2.4, product_id: 5, quantity: 1 },
    { id: 103, status: "processed", total_amount: 3.8, product_id: 6, quantity: 1 },
  ];

  return (
    <main className="min-h-screen bg-white font-sans pb-20">
      <Navbar />

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-[#1A1A1A] inline-block relative pb-4 tracking-tight">
            YOUR ORDERS
            <span className="absolute bottom-0 left-0 w-full h-2 bg-[#69995D] rounded-full"></span>
          </h1>
        </div>

        {/* Order List */}
        <div className="flex flex-col gap-6">
          {orders.map((order) => {
            const product = PRODUCT_TABLE[order.product_id];

            return (
              <div
                key={order.id}
                className="bg-[#FAFAFA] border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  
                  <img
                    src={product?.image_url}
                    alt={product?.name}
                    className="w-32 h-32 object-cover rounded-lg shadow"
                  />

                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-[#1A1A1A]">
                      {product.name}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {product.description}
                    </p>

                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-semibold text-gray-700">Order ID:</span>
                        <p className="text-gray-600">#{order.id}</p>
                      </div>

                      <div>
                        <span className="font-semibold text-gray-700">Quantity:</span>
                        <p className="text-gray-600">{order.quantity}</p>
                      </div>

                      <div>
                        <span className="font-semibold text-gray-700">Total:</span>
                        <p className="text-gray-600">${order.total_amount}</p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="mt-4">
                      {order.status === "processed" && (
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-600 font-medium">
                          <Clock size={16} /> Being Processed
                        </span>
                      )}

                      {order.status === "shipped" && (
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 text-yellow-600 font-medium">
                          <Package size={16} /> Shipped
                        </span>
                      )}

                      {order.status === "arrived" && (
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-600 font-medium">
                          <CheckCircle2 size={16} /> Arrived
                        </span>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
