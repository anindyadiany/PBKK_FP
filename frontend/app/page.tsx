import React from "react";
import Footer from "@/app/components/footer";
import Navbar from "@/app/components/navbar";
import Link from "next/link"; 
import { supabase } from "@/lib/supabaseClient";

interface ProductCardProps {
  title: string;
  desc?: string;
  price: number;
  oldPrice?: number;
  badge?: string;
  href: string;
  image_url?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  desc = "This is a placeholder description.",
  price,
  oldPrice,
  badge,
  href,
  image_url, 
}) => (
  <Link href={href} className="block">
    <div className="relative overflow-hidden bg-[#F9F9F9] p-4 rounded-xl hover:shadow-lg transition-shadow cursor-pointer group">
      
      {/* Badge */}
      {badge && (
        <span className="absolute top-3 left-0 bg-[#be4b55] text-white font-bold text-sm px-3 py-1 rounded-r-md shadow-sm z-10">
          {badge}
        </span>
      )}

      {/* PRODUCT IMAGE */}
      <div className="relative aspect-square rounded-lg mb-4 overflow-hidden bg-gray-100">
        {image_url ? (
          <img
            src={image_url}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <span className="flex items-center justify-center w-full h-full text-gray-400 text-sm">
            No Image
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="font-bold text-gray-900 mb-1">{title}</h3>

      {/* Description */}
      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{desc}</p>

      {/* Price */}
      <div className="flex items-center gap-3">
        {oldPrice && (
          <span className="text-sm text-[#c85a5a] font-medium line-through">
            ${oldPrice}
          </span>
        )}
        <span className="text-sm font-bold text-gray-900">${price}</span>
      </div>
    </div>
  </Link>
);

const createSlug = (title: string) =>
  title.toLowerCase().replace(/\s+/g, "-");

export default async function Home() {
  
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("id");

  if (error) {
    console.error("Supabase error:", error);
  }

  const discountProducts = products?.slice(0, 4) || [];
  const newArrivals = products?.slice(4, 8) || [];

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <div className="container mx-auto px-4 py-8 space-y-16">
        
        {/* DISCOUNTS */}
        <section>
          <h2 className="text-2xl font-bold italic mb-6 text-gray-900">
            DISCOUNTS
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {discountProducts.map((p: any) => (
              <ProductCard
                key={p.id}
                title={p.name}
                desc={p.description}
                price={p.price}
                image_url={p.image_url} 
                href={`/product/${p.id}`}
                badge="Sale"
              />
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-bold italic mb-6 text-gray-900">
            NEW ARRIVALS
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {newArrivals.map((p: any) => (
              <ProductCard
                key={p.id}
                title={p.name}
                desc={p.description}
                price={p.price}
                image_url={p.image_url}
                href={`/product/${p.id}`}
              />
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
