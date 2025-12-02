import React from "react";
import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  imageSrc: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, imageSrc }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white p-4">
      <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* form */}
        <div className="w-full max-w-md mx-auto md:pr-8">
          <div className="mb-10">
            <h1 className="text-3xl font-bold italic text-gray-900 mb-2 border-b-4 border-[#69995D]">
              {title}
            </h1>
          </div>
          {children}
        </div>

        {/* hero image */}
        <div className="hidden md:block relative h-[600px] w-full">
          <div className="relative h-full w-full rounded-4xl overflow-hidden">
            <Image
              src={imageSrc}
              alt="Auth Hero"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;