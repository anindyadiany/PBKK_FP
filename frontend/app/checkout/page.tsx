import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import { supabaseServer } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
async function createOrder(formData: FormData) {
  "use server";

  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to checkout.");
  }

  const productId = Number(formData.get("product_id"));
  const qty = Number(formData.get("qty"));
  const total = Number(formData.get("total"));

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .single();

  if (!product) throw new Error("Product not found");

  // Create the main order record
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      total_amount: total,
      status: "paid",
    })
    .select()
    .single();

  if (orderError) throw new Error("Failed to create order");

  await supabase.from("order_items").insert({
    order_id: order.id,
    product_id: productId,
    quantity: qty,
    price_at_purchase: product.price,
  });

  await supabase
    .from("products")
    .update({
      stock_quantity: product.stock_quantity - qty,
    })
    .eq("id", productId);

  redirect("/checkout/success");
}

export default async function CheckoutPage({ searchParams }: any) {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login'); 
  }


  const resolvedParams = await searchParams;

  const productId = Number(resolvedParams.product_id);
  const qty = Number(resolvedParams.qty || 1);

  // Fetch product details needed for the page display
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .single();

  if (!product) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Product not found.</p>
      </main>
    );
  }

  const total = product.price * qty;

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 py-20 max-w-3xl"> 
        <h1 className="text-3xl font-bold italic mb-8 text-gray-900">
          Checkout
        </h1>

        <div className="bg-[#F9F9F9] p-6 rounded-xl shadow-lg space-y-6">

          <div className="flex gap-6 items-center">
            <div className="w-6 h-6 bg-gray-100 rounded-lg overflow-hidden">
              {product.image_url ? (
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No Image
                </div>
              )}
            </div>

            <div>
              {/* Text sizes remain larger: text-2xl and text-lg */}
              <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
              <p className="text-gray-600 text-sm">Qty: {qty}</p>
              <p className="font-bold text-lg text-gray-900">Price: ${product.price}</p>
            </div>
          </div>

          {/* Total Amount */}
          <div className="flex justify-between border-t pt-4">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-2xl font-bold">${total.toFixed(2)}</span>
          </div>

          <form action={createOrder}>
            <input type="hidden" name="product_id" value={productId} />
            <input type="hidden" name="qty" value={qty} />
            <input type="hidden" name="total" value={total} />

            <button
              type="submit"
              className="w-full bg-[#69995D] text-white py-3 rounded-lg hover:bg-[#5F8A54] font-semibold transition duration-150"
            >
              Pay Now
            </button>
          </form>

        </div>
      </div>
      <Footer />
    </main>
  );
}