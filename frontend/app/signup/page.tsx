"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import AuthLayout from "@/app/components/authlayout";

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            role: formData.role,
          },
        },
      });

      if (error) throw error;
      alert("Registration successful! Check your email.");
      window.location.href = "/login";
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Sign Up. Feel the vibes. Joylab" 
      imageSrc="/images/login-hero.png"
    >
      <form onSubmit={handleSignup} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">First Name</label>
            <input
              type="text"
              name="firstName"
              onChange={handleChange}
              className="w-full  text-gray-700 bg-gray-100 border-transparent rounded-lg px-4 py-3 transition-all outline-none"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Last Name</label>
            <input
              type="text"
              name="lastName"
              onChange={handleChange}
              className="w-full  text-gray-700 bg-gray-100 border-transparent rounded-lg px-4 py-3 transition-all outline-none"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</label>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            className="w-full  text-gray-700 bg-gray-100 border-transparent rounded-lg px-4 py-3 transition-all outline-none"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">I am a</label>
          <div className="relative">
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full  text-gray-700 bg-gray-100 border-transparent rounded-lg px-4 py-3 transition-all outline-none appearance-none cursor-pointer"
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <ChevronDown size={20} />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              onChange={handleChange}
              className="w-full  text-gray-700 bg-gray-100 border-transparent rounded-lg px-4 py-3 pr-10 transition-all outline-none"
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

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#69995D] hover:bg-[#5a8e4e] text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-70"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <div className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-[#69995D] font-medium hover:underline">
            Log in
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignupPage;