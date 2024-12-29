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
        src="/logo.png" 
        alt="mangopuff.com"
        className="h-10 object-cover"
      />
    </div>
  );
}
