"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className="sticky top-0 z-50 bg-white w-full font-sans">
      <div className="border-b border-gray-100 py-4">
        <div className="container mx-auto px-4 flex items-center justify-between gap-4">
          {/* logo */}
          <div className="shrink-0">
            <Link href="/" aria-label="Home">
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

          {/* searcch bar */}
          <div className="flex-1 max-w-xl relative">
            <input
              type="text"
              placeholder="Search"
              className="text-gray-600 w-full border border-gray-200 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-[#6aa45e] bg-gray-50/50"
            />
            {/* seach icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="absolute left-3 top-1/2 -translate-y-1/2"
            >
              <circle
                cx="9.21967"
                cy="9.21967"
                r="5.88495"
                stroke="#BCBCBD"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16.6736 16.6736L13.3806 13.3806"
                stroke="#BCBCBD"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* register (and login perhaps) */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-gray-700">
                  Welcome,{" "}
                  <span className="text-[#69995D]">
                    {user.user_metadata?.first_name || "User"}
                  </span>
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-[#69995D] font-medium transition-colors"
                >
                  Login
                </Link>
                <Link href="/signup">
                  <button className="bg-[#69995D] hover:bg-[#5a8e4e] text-white px-6 py-2 rounded-md font-medium transition-colors">
                    Register
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* navigation links */}
      <div className="border-b border-gray-100 py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <nav className="flex gap-8 text-gray-800 font-medium">
            <Link href="/" className="hover:text-[#69995D] transition-colors">
              Home
            </Link>
            <Link
              href="/series"
              className="hover:text-[#69995D] transition-colors"
            >
              Series
            </Link>
            <Link
              href="/store"
              className="hover:text-[#69995D] transition-colors"
            >
              Store
            </Link>
          </nav>

          <div className="flex gap-6 text-black">
            {/* heart icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="w-6 h-6 cursor-pointer hover:text-[#69995D] transition-colors"
            >
              <path
                d="M1.66663 7.61416C1.66663 11.6667 5.01663 13.8258 7.46829 15.7592C8.33329 16.4408 9.16663 17.0833 9.99996 17.0833C10.8333 17.0833 11.6666 16.4417 12.5316 15.7583C14.9841 13.8267 18.3333 11.6667 18.3333 7.61499C18.3333 3.56333 13.75 0.687492 9.99996 4.58416C6.24996 0.687492 1.66663 3.56166 1.66663 7.61416Z"
                fill="currentColor"
              />
            </svg>

            {/* shopping cart */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="17"
              viewBox="0 0 17 17"
              fill="none"
              className="w-6 h-6 cursor-pointer hover:text-[#69995D] transition-colors"
            >
              <path
                d="M0.447157 0.0256489C0.525896 0.00236849 0.608449 -0.00516921 0.690101 0.00346645C0.771754 0.0121021 0.850904 0.0367418 0.92303 0.0759779C0.995157 0.115214 1.05885 0.168277 1.11046 0.232136C1.16207 0.295995 1.20059 0.369397 1.22382 0.448149L1.68216 2.00065H13.8947C15.428 2.00065 16.5988 3.43148 16.1572 4.92565L14.778 9.59232C14.4847 10.5865 13.5522 11.2506 12.5155 11.2506H4.88549C3.84882 11.2506 2.91716 10.5865 2.62299 9.59232L0.0254907 0.802316C-0.0213051 0.643519 -0.00318792 0.472643 0.0758662 0.32719C0.15492 0.181736 0.288453 0.0727557 0.447157 0.0256489ZM3.33299 14.3756C3.33299 13.8784 3.53054 13.4015 3.88217 13.0498C4.2338 12.6982 4.71071 12.5006 5.20799 12.5006C5.70527 12.5006 6.18219 12.6982 6.53382 13.0498C6.88545 13.4015 7.08299 13.8784 7.08299 14.3756C7.08299 14.8729 6.88545 15.3498 6.53382 15.7015C6.18219 16.0531 5.70527 16.2506 5.20799 16.2506C4.71071 16.2506 4.2338 16.0531 3.88217 15.7015C3.53054 15.3498 3.33299 14.8729 3.33299 14.3756ZM9.99966 14.3756C9.99966 14.1294 10.0482 13.8856 10.1424 13.6581C10.2366 13.4306 10.3747 13.2239 10.5488 13.0498C10.7229 12.8757 10.9296 12.7376 11.1571 12.6434C11.3846 12.5491 11.6284 12.5006 11.8747 12.5006C12.1209 12.5006 12.3647 12.5491 12.5922 12.6434C12.8197 12.7376 13.0264 12.8757 13.2005 13.0498C13.3746 13.2239 13.5127 13.4306 13.6069 13.6581C13.7012 13.8856 13.7497 14.1294 13.7497 14.3756C13.7497 14.8729 13.5521 15.3498 13.2005 15.7015C12.8489 16.0531 12.3719 16.2506 11.8747 16.2506C11.3774 16.2506 10.9005 16.0531 10.5488 15.7015C10.1972 15.3498 9.99966 14.8729 9.99966 14.3756Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
