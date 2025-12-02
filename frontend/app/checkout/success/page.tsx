"use client";

import Link from "next/link";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <Navbar />

      {/* Content */}
      <div className="flex-grow flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full text-center space-y-6">

          <h1 className="text-3xl font-bold text-green-700">
            Order Successful!!
          </h1>

          <p className="text-gray-600">
            Thank you! Your order has been placed successfully.
          </p>

          <Link
            href="/"
            className="block bg-[#69995D] text-white py-3 rounded-lg hover:bg-[#5F8A54] font-bold text-lg transition"
          >
            Back to Home
          </Link>

          {/* <Link
            href="/orders"
            className="block text-[#69995D] underline font-medium mt-4"
          >
            View Your Orders
          </Link> */}
        </div>
      </div>

      {/* Footer stuck to bottom */}
      <Footer />
    </main>
  );
}
