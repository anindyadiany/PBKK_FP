import React from "react";
import { supabase } from "@/lib/supabaseClient";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ProductCardProps {
  title: string;
  desc?: string;
  price: number;
  href: string;
  image_url?: string;
  stock_quantity: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  desc = "Exclusive item.",
  price,
  href,
  image_url,
  stock_quantity,
}) => {
  const isOutOfStock = stock_quantity === 0;

  return (
    <Link 
      href={href} 
      className={`block h-full ${isOutOfStock ? "pointer-events-none opacity-80" : ""}`}
    >
      <div className="relative overflow-hidden bg-[#FAFAFA] border border-transparent hover:border-gray-200 p-4 rounded-2xl hover:shadow-xl transition-all duration-300 cursor-pointer group h-full flex flex-col">
        <div className="relative aspect-square rounded-xl mb-4 overflow-hidden bg-white flex items-center justify-center border border-gray-50">
          {image_url ? (
            <img
              src={image_url}
              alt={title}
              className={`w-full h-full object-contain p-4 transition-transform duration-500 ${
                 isOutOfStock ? "grayscale opacity-50" : "group-hover:scale-110"
              }`}
            />
          ) : (
            <span className="text-gray-300 text-xs font-bold uppercase">No Image</span>
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[1px]">
                <span className="bg-[#1A1A1A] text-white font-bold text-[10px] px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                    Sold Out
                </span>
            </div>
          )}
        </div>
        <h3 className="font-bold text-[#1A1A1A] text-lg mb-1 leading-tight group-hover:text-[#69995D] transition-colors">
            {title}
        </h3>
        <p className="text-xs text-gray-500 mb-4 line-clamp-2 leading-relaxed grow">
            {desc}
        </p>
        <div className="flex items-center justify-between mt-auto border-t border-gray-100 pt-3">
          <span className={`text-lg font-bold ${isOutOfStock ? "text-gray-400 line-through" : "text-[#1A1A1A]"}`}>
            ${price}
          </span>
          {!isOutOfStock ? (
             <span className="text-xs font-bold text-[#69995D] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                View <ArrowRight size={12} />
             </span>
          ) : (
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                Unavailable
             </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export const revalidate = 0;

export default async function StorePage() {
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
  }

  const allProducts = products || [];

  return (
    <main className="min-h-screen bg-white font-sans">
      <Navbar />
      <div className="container mx-auto px-4 py-16 space-y-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-[#1A1A1A] inline-block relative pb-4 tracking-tight uppercase">
            The Collection
            <span className="absolute bottom-0 left-0 w-full h-2 bg-[#69995D] rounded-full"></span>
          </h1>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto text-lg">
            Browse our complete inventory of exclusive figures and collectibles
          </p>
        </div>

        {allProducts.length === 0 ? (
          <div className="text-center py-32 bg-[#F9F9F9] rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-400 text-lg font-medium">No products found.</p>
            <p className="text-gray-400 mt-2 text-sm">Currently restocking. Please check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {allProducts.map((product) => (
              <ProductCard
                key={product.id}
                title={product.name}
                desc={product.description}
                price={product.price}
                image_url={product.image_url}
                href={`/product/${product.id}`}
                stock_quantity={product.stock_quantity ?? product.stock ?? 0}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}