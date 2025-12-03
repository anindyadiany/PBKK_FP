import React from "react";
import Image from "next/image";
import { MapPin, Calendar } from "lucide-react";

interface AdminOrderCardProps {
  orderId: string | number;
  userName: string;
  shippingAddress: string;
  productName: string;
  description: string;
  quantity: number;
  price: number;
  imageSrc: string;
  status: string;
  createdAt: string;
  onProceed: (id: string | number) => void;
  onCancel: (id: string | number) => void;
}

const AdminOrderCard: React.FC<AdminOrderCardProps> = ({
  orderId,
  userName,
  shippingAddress,
  productName,
  description,
  quantity,
  price,
  imageSrc,
  status,
  createdAt,
  onProceed,
  onCancel,
}) => {
  const dateObj = new Date(createdAt);
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="w-full mb-8">
      <div className="bg-[#69995D] text-white px-6 py-3 rounded-t-xl font-bold uppercase tracking-wide flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <span>{userName}</span>
        
        <div className="flex items-center gap-3 text-xs opacity-90 font-normal">
            <span className="flex items-center gap-1 bg-[#5a8e4e] px-2 py-1 rounded">
                <Calendar size={12} />
                {formattedDate}
            </span>
            <span className="bg-[#5a8e4e] px-2 py-1 rounded">
                #{orderId} • {status}
            </span>
        </div>
      </div>
      <div className="bg-[#F9F9F9] p-6 rounded-b-xl border border-gray-200 border-t-0">
        <div className="mb-6 flex items-start gap-2 text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
           <MapPin className="w-4 h-4 text-[#69995D] mt-0.5 shrink-0" />
           <div>
             <span className="font-bold text-gray-900 block text-xs uppercase tracking-wider mb-1">Delivery Address</span>
             <p className="leading-tight">{shippingAddress || "No address provided"}</p>
           </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="shrink-0">
            <div className="relative w-32 h-32 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-gray-200">
               {imageSrc ? (
                 <Image 
                   src={imageSrc} 
                   alt={productName} 
                   fill 
                   className="object-contain p-2"
                 />
               ) : (
                 <span className="text-gray-300 text-xs">No Image</span>
               )}
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-xl text-gray-900 mb-2">{productName}</h3>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed max-w-2xl line-clamp-2">
              {description}
            </p>
            
            <div className="flex gap-6 mt-auto">
              <div className="font-bold text-gray-900 bg-white px-3 py-1 rounded border border-gray-200 text-sm">
                Qty: <span className="text-[#69995D] ml-1">{quantity}</span>
              </div>
              <div className="font-bold text-gray-900 bg-white px-3 py-1 rounded border border-gray-200 text-sm">
                Total: <span className="text-[#69995D] ml-1">${(price * quantity).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
          <button 
            onClick={() => onCancel(orderId)}
            className="flex-1 border-2 border-gray-200 hover:border-red-200 text-gray-500 hover:text-red-600 hover:bg-red-50 font-bold py-3 rounded-lg transition-all uppercase text-sm"
          >
            Cancel Order
          </button>
          <button 
            onClick={() => onProceed(orderId)}
            className="flex-1 bg-[#69995D] hover:bg-[#5a8e4e] text-white font-bold py-3 rounded-lg transition-all uppercase text-sm shadow-md hover:shadow-lg transform active:scale-[0.98]"
          >
            {status === "shipped" ? "Mark as Arrived" : "Proceed to Ship"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderCard;