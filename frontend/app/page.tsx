import React from "react";
import Footer from "@/app/components/footer";
import Navbar from "@/app/components/navbar";

interface ProductCardProps {
  title: string;
  desc?: string;
  price: number;
  oldPrice?: number;
  badge?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  desc = "Tis a placeholder",
  price,
  oldPrice,
  badge,
}) => (
  <div className="relative overflow-hidden bg-[#F9F9F9] p-4 rounded-xl hover:shadow-lg transition-shadow cursor-pointer group">
    {badge && (
      <span className="absolute top-3 left-0 bg-[#be4b55] text-white font-bold text-sm px-3 py-1 rounded-r-md shadow-sm z-10">
        {badge}
      </span>
    )}

    {/* Image Container */}
    <div className="relative aspect-square rounded-lg mb-4 flex items-center justify-center">
      <span className="text-gray-400 text-sm group-hover:scale-105 transition-transform">
        Product Image
      </span>
    </div>

    <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
    <p className="text-xs text-gray-500 mb-3 line-clamp-2">{desc}</p>

    <div className="flex items-center gap-3">
      {oldPrice && (
        <span className="text-sm text-[#c85a5a] font-medium line-through">
          ${oldPrice}
        </span>
      )}
      <span className="text-sm font-bold text-gray-900">${price}</span>
    </div>
  </div>
);

export default function Home() {
  const discountProducts: ProductCardProps[] = [
    { title: "Labubu Sparkly", price: 18, oldPrice: 20, badge: "2% off" },
    { title: "Labubu Small", price: 18, oldPrice: 20, badge: "2% off" },
    { title: "Labubu Halloween", price: 18, oldPrice: 20, badge: "2% off" },
    { title: "Labubu Glasses", price: 18, oldPrice: 20, badge: "2% off" },
  ];

  const newArrivals: ProductCardProps[] = [
    { title: "Labubu Coca-Cola", price: 20 },
    { title: "Labubu Shrimp", price: 20 },
    { title: "Labubu Plush", price: 20 },
    { title: "Labubu Halloween", price: 20 },
  ];

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <div className="container mx-auto px-4 py-8 space-y-16">
        {/* discount section */}
        <section>
          <h2 className="text-2xl font-bold italic mb-6 text-gray-900">
            DISCOUNTS
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {discountProducts.map((item, i) => (
              <ProductCard
                key={i}
                {...item}
              />
            ))}
          </div>
        </section>

        {/* new arrivals section */}
        <section>
          <h2 className="text-2xl font-bold italic mb-6 text-gray-900">
            NEW ARRIVALS
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {newArrivals.map((item, i) => (
              <ProductCard key={i} {...item} />
            ))}
          </div>
        </section>

        {/* hero section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="bg-purple-100 aspect-263/257 relative overflow-hidden flex items-center justify-center">
            <span className="text-purple-300 font-bold text-2xl">
              Random cube for image placeholder
            </span>
          </div>

          <div className="flex flex-col justify-center pl-0 md:pl-10 text-right md:text-right">
            <h2 className="text-3xl font-bold italic mb-6 text-gray-900">
              LABUBU: THE HYPE
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-8">
              THE MONSTERS: In 2015, artist Kasing Lung brought to life the
              iconic character LABUBU and its enchanting fairy world, turning
              years of his conceptual artwork into a series of picture books.
            </p>

            <h2 className="text-3xl font-bold italic mb-6 text-gray-900">
              LABUBU: THE HYPE
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              THE MONSTERS: In 2015, artist Kasing Lung brought to life the
              iconic character LABUBU and its enchanting fairy world, turning
              years of his conceptual artwork into a series of picture books.
            </p>
          </div>
        </section>

        {/* banner (i think) */}
        <section className="bg-[#E9F0E7] rounded-2xl p-12">
          <div className="max-w-lg">
            <h2 className="text-4xl font-bold text-gray-800 mb-2">
              LABUBU NEWEST
            </h2>
            <h2 className="text-4xl font-bold text-gray-800 mb-6">EDITION!</h2>

            <p className="text-gray-500 text-lg">Starting At</p>
            <p className="text-3xl font-bold text-gray-900">$99</p>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
