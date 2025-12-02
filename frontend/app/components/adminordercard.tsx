import React from "react";
import Image from "next/image";

interface AdminOrderCardProps {
  orderId: string | number;
  userName: string;
  productName: string;
  description: string;
  quantity: number;
  price: number;
  imageSrc: string;
  status: string;
  onProceed: (id: string | number) => void;
  onCancel: (id: string | number) => void;
}

const AdminOrderCard: React.FC<AdminOrderCardProps> = ({
  orderId,
  userName,
  productName,
  description,
  quantity,
  price,
  imageSrc,
  status,
  onProceed,
  onCancel,
}) => {
  return (
    <div className="w-full mb-8">
      {/* Green Header Bar */}
      <div className="bg-[#69995D] text-white px-6 py-3 rounded-t-xl font-bold uppercase tracking-wide">
        {userName} <span className="text-xs opacity-75 font-normal ml-2">#{orderId} • {status}</span>
      </div>

      {/* Card Body */}
      <div className="bg-[#F9F9F9] p-6 rounded-b-xl">
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Product Image */}
          <div className="shrink-0">
            <div className="relative w-32 h-32 bg-white rounded-lg flex items-center justify-center overflow-hidden">
               <Image 
                 src={imageSrc} 
                 alt={productName} 
                 fill 
                 className="object-contain p-2"
               />
            </div>
          </div>

          {/* Product Details */}
          <div className="flex-1">
            <h3 className="font-bold text-xl text-gray-900 mb-2">{productName}</h3>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed max-w-2xl">
              {description}
            </p>
            
            <div className="space-y-1">
              <div className="font-bold text-gray-900">
                Qty: <span className="font-normal">{quantity}</span>
              </div>
              <div className="font-bold text-gray-900">
                Price: <span className="font-normal">${price}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button 
            onClick={() => onCancel(orderId)}
            className="flex-1 border border-[#69995D] text-[#69995D] hover:bg-gray-50 font-bold py-3 rounded-lg transition-colors uppercase text-sm"
          >
            Cancel Order
          </button>
          <button 
            onClick={() => onProceed(orderId)}
            className="flex-1 bg-[#69995D] hover:bg-[#5a8e4e] text-white font-bold py-3 rounded-lg transition-colors uppercase text-sm"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderCard;