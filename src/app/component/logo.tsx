// components/Logo.tsx
"use client";
import { useRouter } from "next/navigation";

export default function Logo() {
  const router = useRouter();

  const handleLogoClick = () => {
    router.push("/");
  };

  return (
    <div className="cursor-pointer" onClick={handleLogoClick}>
      <img
        src="/sample1.jpg" 
        alt="Logo"
        className="h-10 w-10 rounded-full object-cover"
      />
    </div>
  );
}
