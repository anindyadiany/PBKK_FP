"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { Upload, X } from "lucide-react";

interface ProductData {
  name: string;
  description: string;
  price: number | string;
  stock_quantity: number | string;
  image_url: string;
}

interface ProductFormProps {
  mode: "add" | "edit";
  initialData?: ProductData;
  onSubmit: (data: ProductData) => void;
  onDelete?: () => void;
  loading?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  mode,
  initialData,
  onSubmit,
  onDelete,
  loading = false,
}) => {
  const [formData, setFormData] = useState<ProductData>({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    image_url: "",
  });

  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setPreviewUrl(initialData.image_url);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setImageFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    await uploadImage(file);
  };

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);
      setFormData(prev => ({ ...prev, image_url: data.publicUrl }));
      
    } catch (error: any) {
      alert('Error uploading image: ' + error.message);
      setPreviewUrl("");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (uploading) {
        alert("Please wait for the image to finish uploading");
        return;
    }
    onSubmit(formData);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold text-[#1A1A1A] inline-block relative pb-4 uppercase">
          {mode === "add" ? "ADD PRODUCT" : "UPDATE PRODUCT"}
          <span className="absolute bottom-0 left-0 w-full h-1.5 bg-[#69995D] rounded-full"></span>
        </h1>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-12">
        <div className="w-full md:w-1/3 flex flex-col gap-4">
          <div className="aspect-square bg-[#F9F9F9] border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center overflow-hidden relative group">
            {previewUrl ? (
              <>
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-contain p-4"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <span className="text-white font-medium">Change Image</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center text-gray-400">
                <Upload size={48} className="mb-2" />
                <span className="text-sm">Upload Photo</span>
              </div>
            )}
            <input 
                type="file" 
                accept="image/*"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {uploading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                    <div className="text-white font-bold animate-pulse">Uploading...</div>
                </div>
            )}
          </div>
          <div className="text-center">
             <p className="text-xs text-gray-500 mb-2">Supported formats: JPG, PNG, WEBP</p>
             <label className="block w-full cursor-pointer bg-[#69995D] hover:bg-[#5a8e4e] text-white font-medium py-3 rounded-lg transition-colors text-center">
                {uploading ? "Uploading..." : "Choose Image"}
                <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                />
             </label>
          </div>
        </div>
        <div className="w-full md:w-2/3 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600">Product Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Labubu Doll"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-gray-100 text-gray-900 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#69995D]"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600">Description</label>
            <textarea
              name="description"
              placeholder="Describe your product..."
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-gray-100 text-gray-900 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#69995D]"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600">Price ($)</label>
            <input
              type="number"
              name="price"
              placeholder="0.00"
              value={formData.price}
              onChange={handleChange}
              className="w-full bg-gray-100 text-gray-900 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#69995D]"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600">Stock Quantity</label>
            <input
              type="number"
              name="stock_quantity"
              placeholder="0"
              value={formData.stock_quantity}
              onChange={handleChange}
              className="w-full bg-gray-100 text-gray-900 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#69995D]"
              required
            />
          </div>
          <div className="flex gap-4 pt-4">
            {mode === "edit" && onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="flex-1 bg-white border border-[#69995D] text-[#69995D] hover:bg-gray-50 font-medium py-3 rounded-lg transition-colors"
              >
                Delete Product
              </button>
            )}
            
            <button
              type="submit"
              disabled={loading || uploading}
              className="flex-1 bg-[#69995D] hover:bg-[#5a8e4e] text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-70"
            >
              {loading ? "Saving..." : mode === "add" ? "Add Product" : "Update Product"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;