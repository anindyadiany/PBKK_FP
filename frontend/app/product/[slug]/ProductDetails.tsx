"use client";

import { useState } from "react";

export default function ProductDetails({ product }: any) {
  const [qty, setQty] = useState(1);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold italic">{product.name}</h2>

      <p className="text-gray-600">{product.description}</p>

      <div className="flex items-center gap-4">
        <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 bg-gray-200 rounded-lg">-</button>
        <span className="text-lg font-semibold">{qty}</span>
        <button onClick={() => setQty(q => q + 1)} className="w-10 h-10 bg-gray-200 rounded-lg">+</button>
      </div>

      <button
        onClick={() => {
          window.location.href = `/checkout?product_id=${product.id}&qty=${qty}`;
        }}
        className="w-full bg-[#69995D] text-white py-3 rounded-lg hover:bg-[#5F8A54]"
      >
        Checkout
      </button>
    </div>
  );
}
