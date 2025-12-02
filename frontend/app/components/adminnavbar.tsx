"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";

const AdminNavbar = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    checkUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="bg-white w-full font-sans border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        
        <div className="flex items-center gap-12">
          {/* logo */}
          <div className="shrink-0">
            <Link href="/admin" aria-label="Home">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="hover:opacity-80 transition-opacity"
              >
                <path
                  d="M11.0674 2.04431C9.95005 3.33131 9.5143 4.95253 9.70132 6.74571C8.82008 7.30157 8.27881 8.20734 8.09549 9.13681C7.87753 10.2358 8.06648 11.3907 8.49875 12.4342C9.32694 14.4337 8.95952 15.5212 8.52792 17.0107C8.09632 18.5002 7.60053 20.3916 8.62596 22.8672C9.46009 24.881 10.9479 26.2046 12.7099 26.712C14.4717 27.2238 16.4425 26.9695 18.3811 26.1665C20.3197 25.3635 21.8931 24.1497 22.7788 22.5414C23.6641 20.9373 23.781 18.9512 22.9461 16.9356C21.9207 14.46 20.2326 13.4731 18.8742 12.7251C17.5158 11.9771 16.487 11.4679 15.6588 9.46845C15.2265 8.42487 14.5443 7.47645 13.6123 6.85166C13.0046 6.44233 12.2899 6.22058 11.5572 6.21395C11.512 5.69002 11.5749 5.16239 11.7421 4.66381C11.9094 4.16523 12.1773 3.70636 12.5293 3.31569C12.6956 3.12151 12.7784 2.86948 12.7596 2.61453C12.7409 2.35958 12.6221 2.12238 12.4292 1.95462C12.2363 1.78687 11.9849 1.70216 11.7298 1.71896C11.4747 1.73576 11.2366 1.85271 11.0674 2.04431Z"
                  fill="#69995D"
                />
              </svg>
            </Link>
          </div>

          {/* nav links */}
          <nav className="hidden md:flex gap-8 text-gray-800 font-medium text-base">
            <Link href="/admin" className="hover:text-[#69995D] transition-colors">
              Products
            </Link>
            <Link href="/admin/orders" className="hover:text-[#69995D] transition-colors">
              Orders
            </Link>
          </nav>
        </div>

        {/* Admin Profile & Logout */}
        <div className="flex items-center gap-6">
          {user ? (
            <>
              <span className="text-sm font-semibold text-gray-700 hidden sm:block">
                Admin: <span className="text-[#69995D]">{user.user_metadata?.first_name}</span>
              </span>
              <button 
                onClick={handleLogout}
                className="bg-[#69995D] hover:bg-[#5a8e4e] text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminNavbar;