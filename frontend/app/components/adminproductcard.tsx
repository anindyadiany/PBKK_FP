import React from "react";
import Image from "next/image";
import Link from "next/link";

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
  const safeImageSrc = isValidUrl ? image_url : "/images/placeholder.png";

  return (
    <div className="bg-[#F9F9F9] p-4 rounded-xl flex flex-col h-full hover:shadow-md transition-shadow">
      
      {/* clickable Image */}
      <Link href={`/admin/products/edit/${id}`} className="cursor-pointer">
        <div className="relative aspect-square mb-4 flex items-center justify-center rounded-lg overflow-hidden bg-white group">
            <Image 
                src={safeImageSrc} 
                alt={title} 
                fill 
                className="object-contain p-4 group-hover:scale-105 transition-transform"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
        </div>
      </Link>

      {/* content */}
      <div className="flex-1">
        <Link href={`/admin/products/edit/${id}`} className="hover:text-[#69995D] transition-colors">
            <h3 className="font-bold text-gray-900 text-lg mb-1">{title}</h3>
        </Link>
        
        <p className="text-xs text-gray-500 mb-3 leading-relaxed line-clamp-2 min-h-[2.5em]">
          {description}
        </p>

        {/* price and stock row */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-bold text-gray-900">
            ${price}
          </div>
          <div className="text-xs font-medium text-gray-600 bg-gray-200 px-2 py-1 rounded-md">
            Stock: {stock_quantity}
          </div>
        </div>
      </div>

      {/* action buttons */}
      <div className="flex gap-3 mt-auto">
        <Link href={`/admin/products/edit/${id}`} className="flex-1">
          <button className="w-full bg-[#69995D] hover:bg-[#5a8e4e] text-white text-xs font-bold py-3 rounded-lg transition-colors">
            Update
          </button>
        </Link>
        
        <button
          onClick={() => onDelete(id)}
          className="flex-1 bg-white border border-red-200 text-red-500 hover:bg-red-50 text-xs font-bold py-3 rounded-lg transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default AdminProductCard;