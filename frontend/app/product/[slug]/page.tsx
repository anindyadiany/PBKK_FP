import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import { supabase } from "@/lib/supabaseClient";
import ProductDetails from "./ProductDetails";

export default async function ProductPage({ params }: any) {
  const resolvedParams = await params; 
  const productId = Number(resolvedParams.slug);

  if (!productId || isNaN(productId)) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Invalid Product URL</h1>
          <p className="text-gray-500 mt-2">Please go back to the store and try again.</p>
        </div>
        <Footer />
      </main>
    );
  }

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .single();

  if (error || !product) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Product Not Found</h1>
          <p className="text-gray-500 mt-2">The product you are looking for does not exist.</p>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white font-sans">
      <Navbar />

      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start max-w-6xl mx-auto">
          <div className="relative bg-[#F9F9F9] rounded-2xl overflow-hidden aspect-square flex items-center justify-center shadow-sm">
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.name}
                className="w-full h-full object-contain p-8 hover:scale-105 transition-transform duration-300" 
              />
            ) : (
              <span className="text-gray-400 font-medium">No Image Available</span>
            )}
          </div>
          <ProductDetails product={product} />
        </div>
      </div>
      <Footer />
    </main>
  );
}