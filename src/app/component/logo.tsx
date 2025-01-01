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
        className="h-6 sm:h-8 md:h-10 lg:h-10 xl:h-12 object-cover"
      />
    </div>
  );
}
