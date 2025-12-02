import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import { supabase } from "@/lib/supabaseClient";
import ProductDetails from "./ProductDetails";

export default async function ProductPage({ params }: any) {
  const resolved = await params;
  const productId = Number(resolved.slug);

  if (!productId || isNaN(productId)) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <p>Invalid product.</p>
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
      <main className="min-h-screen bg-white flex items-center justify-center">
        <p>Product not found.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <div className="container mx-auto px-4 py-16 grid md:grid-cols-2 gap-10">
        <div className="relative bg-[#F9F9F9] p-6 rounded-xl aspect-square flex items-center justify-center">
          {product.image_url ? (
            <img src={product.image_url} className="w-full h-full object-cover" />
          ) : (
            <span>No image</span>
          )}
        </div>

        <ProductDetails product={product} />
      </div>

      <Footer />
    </main>
  );
}
