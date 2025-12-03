"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductDetails({ product }: any) {
  const [qty, setQty] = useState(1);
  const [address, setAddress] = useState("");
  const router = useRouter();

  const handleCheckout = () => {
    if (!address.trim()) {
      alert("Please enter a shipping address.");
      return;
    }
    
    const encodedAddress = encodeURIComponent(address);
    router.push(`/checkout?product_id=${product.id}&qty=${qty}&address=${encodedAddress}`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold italic text-[#1A1A1A] mb-2 uppercase">{product.name}</h2>
        <p className="text-xl font-bold text-[#69995D]">${product.price}</p>
      </div>
      <div className="prose prose-sm text-gray-600 leading-relaxed">
        <p>{product.description}</p>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-bold text-gray-900 uppercase tracking-wide">Quantity</label>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setQty(q => Math.max(1, q - 1))} 
            className="w-12 h-12 bg-white border border-gray-300 hover:border-[#69995D] hover:text-[#69995D] text-gray-900 rounded-lg text-xl font-medium transition-all"
          >
          </button>        
          <span className="text-xl font-bold text-gray-900 w-8 text-center">{qty}</span>
          <button 
            onClick={() => setQty(q => q + 1)} 
            className="w-12 h-12 bg-white border border-gray-300 hover:border-[#69995D] hover:text-[#69995D] text-gray-900 rounded-lg text-xl font-medium transition-all"
          >
            +
          </button>
        </div>
      </div>
      <div className="space-y-3">
        <label className="text-sm font-bold text-gray-900 uppercase tracking-wide">Shipping Address</label>
        <textarea 
          rows={3}
          placeholder="Enter your full delivery address..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full bg-white text-gray-900 border border-gray-300 rounded-xl p-4 focus:outline-none focus:border-[#69995D] focus:ring-1 focus:ring-[#69995D] placeholder:text-gray-400 transition-all shadow-sm"
        />
      </div>

      <button
        onClick={handleCheckout}
        className="w-full bg-[#69995D] text-white font-bold py-4 rounded-xl hover:bg-[#5a8e4e] transition-all transform active:scale-[0.98] shadow-md hover:shadow-lg uppercase tracking-wide"
      >
        Proceed to Checkout
      </button>
    </div>
  );
}