"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AdminNavbar from "@/app/components/adminnavbar";
import AdminOrderCard from "@/app/components/adminordercard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Order {
  id: number;
  user_id: string;
  status: string;
  total_amount: number;
  shipping_address: string;
  created_at: string;
  items?: any[];
  OrderItems?: any[];
  order_items?: any[]; 
}

export default function AdminOrdersPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({ processed: 0, shipped: 0, arrived: 0 });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState("all"); 
  const LIMIT = 5;

  useEffect(() => {
    const initStats = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || session.user.user_metadata?.role !== "admin") {
      }
      fetchStats();
    };
    initStats();
  }, []);

  useEffect(() => {
    fetchOrders(page, activeTab);
  }, [page, activeTab]);

  const fetchOrders = async (pageNumber: number, statusFilter: string) => {
    setLoading(true);
    try {
      let url = `http://localhost:8080/admin/orders?page=${pageNumber}&limit=${LIMIT}`;
      if (statusFilter !== "all") {
        url += `&status=${statusFilter}`; 
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch orders");
      
      const json = await res.json();
      setOrders(json.data || []);
      setTotalPages(json.meta?.last_page || 1);

    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:8080/admin/orders/stats");
      if (res.ok) setStats(await res.json());
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const res = await fetch(`http://localhost:8080/admin/orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Update failed");
      
      fetchOrders(page, activeTab);
      fetchStats();
    } catch (error) {
      alert("Failed to update status");
      console.error(error);
    }
  };

  const handleTabChange = (tab: string) => {
    setPage(1); 
    setActiveTab(tab);
  };

  const getTabClass = (tabName: string) => {
    const isActive = activeTab === tabName;
    return `px-6 py-2 rounded-full font-medium transition-all cursor-pointer ${
      isActive 
        ? "bg-[#69995D] text-white shadow-md" 
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`;
  };

  return (
    <main className="min-h-screen bg-white font-sans pb-20">
      <AdminNavbar />

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-[#1A1A1A] inline-block relative pb-4 tracking-tight">
            ORDERS
            <span className="absolute bottom-0 left-0 w-full h-2 bg-[#69995D] rounded-full"></span>
          </h1>
        </div>
        <div className="bg-[#F9F9F9] rounded-xl p-8 mb-12">
            <h3 className="text-lg font-bold italic text-[#1A1A1A] mb-6">Seller Recap</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold text-[#1A1A1A] mb-1">{stats.processed}</span>
                    <span className="text-red-400 font-medium">Being Processed</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold text-[#1A1A1A] mb-1">{stats.shipped}</span>
                    <span className="text-yellow-400 font-medium">Shipped</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold text-[#1A1A1A] mb-1">{stats.arrived}</span>
                    <span className="text-[#69995D] font-medium">Arrived</span>
                </div>
            </div>
        </div>
        <div className="flex flex-wrap gap-4 mb-8 justify-center sm:justify-start">
          {["all", "processed", "shipped", "arrived", "cancelled"].map((tab) => (
             <button key={tab} onClick={() => handleTabChange(tab)} className={getTabClass(tab)}>
               {tab === "processed" ? "Being Processed" : tab.charAt(0).toUpperCase() + tab.slice(1)}
             </button>
          ))}
        </div>
        <div className="flex flex-col gap-6 min-h-[400px]">
          {loading ? (
             <div className="text-center py-20 text-gray-400">Loading data...</div>
          ) : orders.length === 0 ? (
             <div className="text-center py-20 bg-gray-50 border border-dashed border-gray-200 rounded-xl">
                <p className="text-gray-500">No orders found.</p>
             </div>
          ) : (
             orders.map((order) => {
                const itemsList = order.order_items || order.OrderItems || order.items || [];
                const firstItem = itemsList[0] || {};
                const product = firstItem.product || firstItem.Product || {};

                return (
                    <AdminOrderCard
                        key={order.id}
                        orderId={order.id}
                        userName={`User ${order.user_id ? order.user_id.substring(0, 6) : "Unknown"}...`}
                        shippingAddress={order.shipping_address || "No address provided"}
                        createdAt={order.created_at} 
                        productName={product.name || "Unknown Product"}
                        description={product.description || "No description"}
                        quantity={firstItem.quantity || 0}
                        price={firstItem.price_at_purchase || 0}
                        imageSrc={product.image_url}
                        status={order.status}
                        onProceed={(id) => {
                            const nextStatus = order.status === "shipped" ? "arrived" : "shipped";
                            updateStatus(Number(id), nextStatus);
                        }}
                        onCancel={(id) => updateStatus(Number(id), "cancelled")}
                    />
                );
             })
          )}
        </div>
        <div className="flex justify-center items-center gap-6 mt-16 pt-8 border-t border-gray-100">
            <button
                disabled={page === 1 || loading}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-gray-600"
            >
                <ChevronLeft size={18} /> Previous
            </button>
            <span className="font-medium text-gray-900 bg-gray-100 px-4 py-2 rounded-md min-w-[100px] text-center">
                Page {page} / {totalPages}
            </span>
            <button
                disabled={page >= totalPages || loading}
                onClick={() => setPage(p => p + 1)}
                className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-gray-600"
            >
                Next <ChevronRight size={18} />
            </button>
        </div>
      </div>
    </main>
  );
}