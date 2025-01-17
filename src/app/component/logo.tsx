"use client";
import { useRouter } from "next/navigation";

export default function Logo() {
  const router = useRouter();

  const handleLogoClick = () => {
    router.push("/");
  };

  return (
    <div
      className="cursor-pointer text-xl typing-effect flex items-center"
      onClick={handleLogoClick}>
      <img
        src="/logo.png"
        alt="mangopuff.com"
        className="h-8 sm:h-8 md:h-8 lg:h-8 xl:h-8 object-cover"
      />
      <span className="ml-1 ">angopuff</span>
    </div>
  );
}
