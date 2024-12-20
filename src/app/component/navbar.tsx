// components/Layout.tsx
import Link from "next/link";
import { FaArrowLeft, FaUserCircle } from "react-icons/fa";

interface LayoutProps {
  children: React.ReactNode;
  backHref?: string; // Optional prop for the back button link
}

const Layout = ({ children, backHref = "/" }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Sticky Navbar */}
      <header className="sticky top-0 z-50 flex justify-between items-center p-4 bg-gray-800 shadow-lg">
        <Link href={backHref} className="text-xl text-white hover:text-gray-400 flex items-center">
          <FaArrowLeft className="mr-2" />
          Back
        </Link>
        <Link href="/profile" className="text-xl text-white hover:text-gray-400">
          <FaUserCircle />
        </Link>
      </header>

      {/* Main Content */}
      <main className="p-4">{children}</main>
    </div>
  );
};

export default Layout;
