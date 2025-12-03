import React from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertCircle, Edit, Trash2 } from "lucide-react";

interface AdminProductCardProps {
  id: number;
  title: string;
  description: string;
  price: number;
  stock_quantity: number;
  image_url: string;
  onDelete: (id: number) => void;
}

const AdminProductCard: React.FC<AdminProductCardProps> = ({
  id,
  title,
  description,
  price,
  stock_quantity,
  image_url,
  onDelete,
}) => {
  
  const isValidUrl = image_url && (image_url.startsWith("http") || image_url.startsWith("/"));
  const safeImageSrc = isValidUrl ? image_url : "/images/placeholder.jpg";
  const isOutOfStock = stock_quantity === 0;
  const isLowStock = stock_quantity > 0 && stock_quantity < 5;

  return (
    <div className={`group relative flex flex-col h-full bg-[#FAFAFA] border border-transparent hover:border-gray-200 p-4 rounded-2xl transition-all duration-300 hover:shadow-xl ${isOutOfStock ? "opacity-90" : ""}`}>
      <Link href={`/admin/products/edit/${id}`} className="cursor-pointer block">
        <div className="relative aspect-square mb-4 flex items-center justify-center rounded-xl overflow-hidden bg-white border border-gray-50">
            <Image 
                src={safeImageSrc} 
                alt={title} 
                fill 
                className={`object-contain p-4 transition-transform duration-500 ${
                    isOutOfStock ? "grayscale opacity-50" : "group-hover:scale-110"
                }`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {isOutOfStock && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[1px]">
                    <span className="bg-[#1A1A1A] text-white font-bold text-[10px] px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                        Sold Out
                    </span>
                </div>
            )}
        </div>
      </Link>
      <div className="flex-1 flex flex-col">
        <Link href={`/admin/products/edit/${id}`} className="block">
            <h3 className="font-bold text-[#1A1A1A] text-lg mb-1 leading-tight group-hover:text-[#69995D] transition-colors">
                {title}
            </h3>
        </Link>
        <p className="text-xs text-gray-500 mb-4 line-clamp-2 leading-relaxed">
          {description}
        </p>
        <div className="mt-auto flex items-center justify-between mb-6 pt-3 border-t border-gray-100">
          <span className="text-xl font-bold text-[#1A1A1A]">
            ${price}
          </span>
          <div className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 border ${
              isOutOfStock 
                ? "bg-red-50 text-red-600 border-red-100" 
                : isLowStock 
                    ? "bg-yellow-50 text-yellow-700 border-yellow-100" 
                    : "bg-white text-gray-500 border-gray-200"
          }`}>
            {isOutOfStock && <AlertCircle size={10} />}
            {isOutOfStock ? "NO STOCK" : `${stock_quantity} Left`}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
            <Link href={`/admin/products/edit/${id}`} className="w-full">
                <button className="w-full flex items-center justify-center gap-2 bg-[#69995D] hover:bg-[#5a8e4e] text-white text-xs font-bold py-3 rounded-xl transition-all active:scale-95 shadow-sm">
                    <Edit size={14} />
                    Edit
                </button>
            </Link>
            <button
                onClick={() => onDelete(id)}
                className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 text-xs font-bold py-3 rounded-xl transition-all active:scale-95"
            >
                <Trash2 size={14} />
                Delete
            </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProductCard;