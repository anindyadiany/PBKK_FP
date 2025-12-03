"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import { createClient } from "@supabase/supabase-js";
import { Package, Clock, CheckCircle2, ArrowRight, MapPin, Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function UserOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const res = await fetch(`http://localhost:8080/orders/user/${user.id}`);

        if (res.ok) {
          const jsonData = await res.json();
          setOrders(jsonData.data || []);
        } else {
            console.error("Failed to fetch orders");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-white font-sans flex items-center justify-center">
        <p className="text-xl text-gray-400 animate-pulse font-medium">Loading your orders...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white font-sans flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-16 max-w-5xl flex-grow">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-[#1A1A1A] inline-block relative pb-4 tracking-tight uppercase">
            Order History
            <span className="absolute bottom-0 left-0 w-full h-2 bg-[#69995D] rounded-full"></span>
          </h1>
          <p className="text-gray-500 mt-4 text-lg">
            Track your past purchases and current shipments.
          </p>
        </div>
        <div className="flex flex-col gap-8">
          {orders.map((order) => {
             const dateObj = new Date(order.created_at);
             const formattedDate = dateObj.toLocaleDateString("en-US", {
               month: "short",
               day: "numeric",
               hour: "2-digit",
               minute: "2-digit",
             });

             return (
                <div key={order.id} className="w-full mb-8">
                  <div className="bg-[#69995D] text-white px-6 py-3 rounded-t-xl font-bold uppercase tracking-wide flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <span>Order #{order.id}</span>
                    
                    <div className="flex items-center gap-3 text-xs opacity-90 font-normal">
                        <span className="flex items-center gap-1 bg-[#5a8e4e] px-2 py-1 rounded">
                            <Calendar size={12} />
                            {formattedDate}
                        </span>
                        <span className="bg-[#5a8e4e] px-2 py-1 rounded flex items-center gap-1">
                            {order.status === 'pending' && <Clock size={12} />}
                            {order.status === 'shipped' && <Package size={12} />}
                            {order.status === 'arrived' && <CheckCircle2 size={12} />}
                            {order.status}
                        </span>
                    </div>
                  </div>
                  <div className="bg-[#F9F9F9] p-6 rounded-b-xl border border-gray-200 border-t-0">
                    <div className="mb-6 flex items-start gap-2 text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                       <MapPin className="w-4 h-4 text-[#69995D] mt-0.5 shrink-0" />
                       <div>
                         <span className="font-bold text-gray-900 block text-xs uppercase tracking-wider mb-1">Delivery Address</span>
                         <p className="leading-tight">{order.shipping_address || "No address provided"}</p>
                       </div>
                    </div>
                    <div className="flex flex-col gap-6">
                        {(order.OrderItems || order.items || []).map((item: any) => {
                            const product = item.Product || item.product || {};
                            return (
                                <div key={item.id} className="flex flex-col md:flex-row gap-6 border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                                  <div className="shrink-0">
                                    <div className="relative w-32 h-32 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-gray-200">
                                       {product.image_url ? (
                                         <Image 
                                           src={product.image_url} 
                                           alt={product.name} 
                                           fill 
                                           className="object-contain p-2"
                                         />
                                       ) : (
                                         <span className="text-gray-300 text-xs">No Image</span>
                                       )}
                                    </div>
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="font-bold text-xl text-gray-900 mb-2">{product.name || "Unknown Product"}</h3>
                                    <p className="text-sm text-gray-600 mb-4 leading-relaxed max-w-2xl line-clamp-2">
                                      {product.description}
                                    </p>
                                    
                                    <div className="flex gap-6 mt-auto">
                                      <div className="font-bold text-gray-900 bg-white px-3 py-1 rounded border border-gray-200 text-sm">
                                        Qty: <span className="text-[#69995D] ml-1">{item.quantity}</span>
                                      </div>
                                      <div className="font-bold text-gray-900 bg-white px-3 py-1 rounded border border-gray-200 text-sm">
                                        Total: <span className="text-[#69995D] ml-1">${(item.price_at_purchase * item.quantity).toFixed(2)}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end items-center gap-3">
                        <span className="text-gray-500 font-medium">Grand Total</span>
                        <span className="text-3xl font-bold text-[#1A1A1A]">${order.total_amount}</span>
                    </div>
                  </div>
                </div>
             );
          })}

          {!loading && orders.length === 0 && (
            <div className="text-center py-20 bg-[#F9F9F9] rounded-3xl border-2 border-dashed border-gray-200">
               <div className="mb-4 text-gray-300">
                 <Package size={48} className="mx-auto" />
               </div>
               <h3 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h3>
               <p className="text-gray-500 mb-6">Looks like you haven't bought anything from us yet</p>
               
               <Link href="/store">
                  <button className="bg-[#1A1A1A] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#69995D] transition-colors inline-flex items-center gap-2">
                    Start Shopping <ArrowRight size={16} />
                  </button>
               </Link>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}