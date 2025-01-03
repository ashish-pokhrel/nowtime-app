"use client";
import { useRouter } from "next/navigation";

export default function Logo() {
  const router = useRouter();

  const handleLogoClick = () => {
    router.push("/");
  };

  return (
    <div className="cursor-pointer text-xl typing-effect" onClick={handleLogoClick}>
      {/* <img
        src="/logo.png" 
        alt="mangopuff.com"
        className="h-10 sm:h-10 md:h-10 lg:h-10 xl:h-16 object-cover"
      /> */}
      <span className="object-cover" style={{ fontFamily: 'cursive' }}>Mangopuff</span>
    </div>
  );
}
