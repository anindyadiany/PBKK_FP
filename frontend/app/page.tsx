import React from "react";
import Footer from "@/app/components/footer";
import Navbar from "@/app/components/navbar";
import Link from "next/link"; 
import { supabase } from "@/lib/supabaseClient";
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
  desc = "Exclusive item from the collection.",
  price,
  href,
  image_url, 
  stock_quantity,
}) => {
  const isOutOfStock = stock_quantity === 0;

  return (
    <Link href={href} className={`block h-full ${isOutOfStock ? "pointer-events-none opacity-75" : ""}`}>
      <div className="relative overflow-hidden bg-[#FAFAFA] border border-transparent hover:border-gray-200 p-4 rounded-2xl hover:shadow-xl transition-all duration-300 cursor-pointer group h-full flex flex-col">
        
        {/* Image Area */}
        <div className="relative aspect-square rounded-xl mb-4 overflow-hidden bg-white flex items-center justify-center">
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
                <span className="bg-[#1A1A1A] text-white font-bold text-[10px] px-3 py-1.5 rounded-full uppercase tracking-widest">
                    Sold Out
                </span>
            </div>
          )}
        </div>

        {/* Content */}
        <h3 className="font-bold text-[#1A1A1A] text-lg mb-1 leading-tight group-hover:text-[#69995D] transition-colors">
            {title}
        </h3>
        <p className="text-xs text-gray-500 mb-4 line-clamp-2 leading-relaxed grow">
            {desc}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto border-t border-gray-100 pt-3">
          <span className={`text-lg font-bold ${isOutOfStock ? "text-gray-400 line-through" : "text-[#1A1A1A]"}`}>
            ${price}
          </span>
          
          {!isOutOfStock && (
             <span className="text-xs font-bold text-[#69995D] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                View <ArrowRight size={12} />
             </span>
          )}
        </div>
      </div>
    </Link>
  );
};

// --- MAIN PAGE ---
export default async function Home() {
  
  // Fetch Active & In-Stock Products for Featured Section
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .gt("stock_quantity", 0) 
    .order("created_at", { ascending: false })
    .limit(8);

  if (error) console.error("Supabase error:", error);

  const featuredProducts = products || [];

  return (
    <main className="min-h-screen bg-white font-sans">
      <Navbar />

      <div className="container mx-auto px-4 py-16 space-y-24">
        <section>
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-[#1A1A1A] inline-block relative pb-4 tracking-tight uppercase">
              Featured Drops
              <span className="absolute bottom-0 left-0 w-full h-2 bg-[#69995D] rounded-full"></span>
            </h2>
            <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
                Discover the latest arrivals and exclusive items directly from our curated collection.
            </p>
          </div>

          {featuredProducts.length === 0 ? (
             <div className="text-center py-32 bg-[#F9F9F9] rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-400 font-medium text-lg">No featured items available right now.</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {featuredProducts.map((p: any) => (
                <ProductCard
                    key={p.id}
                    title={p.name}
                    desc={p.description}
                    price={p.price}
                    image_url={p.image_url} 
                    href={`/product/${p.id}`} 
                    stock_quantity={p.stock_quantity ?? p.stock ?? 0}
                />
                ))}
            </div>
          )}
        </section>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-[#F4F6F4] rounded-[2.5rem] p-8 md:p-12 overflow-hidden">
          <div className="relative aspect-4/3 md:aspect-square overflow-hidden rounded-2xl bg-white shadow-sm group">
             <img 
                 src="/images/carousel_2.jpg.webp" 
                 alt="Labubu Story"
                 className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" 
             />
          </div>
          <div className="flex flex-col justify-center text-left md:pl-4">
            <span className="text-[#69995D] font-bold tracking-widest uppercase text-sm mb-2">The Origin Story</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-6 leading-tight">
              LABUBU: <br/>THE HYPE IS REAL
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8 text-lg">
              <strong>THE MONSTERS:</strong> In 2015, artist Kasing Lung brought to life the
              iconic character LABUBU and its enchanting fairy world, turning
              years of his conceptual artwork into a series of picture books.
            </p>

            <h3 className="text-2xl font-bold text-[#1A1A1A] mb-4">
              COLLECT THEM ALL
            </h3>
            <p className="text-gray-600 leading-relaxed mb-8">
              From limited editions to seasonal specials, start your collection today and join the worldwide community of monster hunters.
            </p>
            
            <Link href="/store">
                <button className="bg-[#1A1A1A] text-white px-8 py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-[#69995D] transition-colors w-fit">
                    Explore Collection
                </button>
            </Link>
          </div>
        </section>
        <section className="bg-[#69995D] rounded-[2.5rem] p-12 md:p-20 text-center md:text-left relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-2 leading-tight">
                  NEWEST EDITION
                </h2>
                <h3 className="text-2xl md:text-3xl font-medium text-white/90">
                    AVAILABLE NOW
                </h3>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-xl transform group-hover:-translate-y-1 transition-transform">
                <p className="text-gray-500 text-sm uppercase tracking-bold font-bold mb-1">Starting At</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-[#1A1A1A]">$99</span>
                    <span className="text-gray-400 font-medium">.00</span>
                </div>
              </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}