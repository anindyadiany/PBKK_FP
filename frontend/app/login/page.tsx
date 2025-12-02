"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import AuthLayout from "@/app/components/authlayout";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      if (data.session) {
        localStorage.setItem("token", data.session.access_token);
        
        const role = data.session.user.user_metadata?.role;

        if (role === "admin") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/"; 
        }
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Login. Feel the vibes. Joy Lab" 
      imageSrc="/images/login-hero.png"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Login</label>
          <input
            type="text"
            name="email"
            placeholder="Email or phone number"
            onChange={handleChange}
            className="w-full text-gray-700 bg-gray-100 border-transparent rounded-lg px-4 py-3 transition-all outline-none"
            required
          />
        </div>

        <div className="space-y-2 relative">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              onChange={handleChange}
              className="w-full text-gray-700 bg-gray-100 border-transparent rounded-lg px-4 py-3 pr-10 transition-all outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Link href="/forgot-password" className="text-sm text-[#69995D] hover:underline font-medium">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#69995D] hover:bg-[#5a8e4e] text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-70"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <div className="text-center text-sm text-gray-500">
          Dont have an account?{" "}
          <Link href="/signup" className="text-[#69995D] font-medium hover:underline">
            Sign up now
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;