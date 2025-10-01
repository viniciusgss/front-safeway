import Image from "next/image";
import { FaHome, FaThLarge, FaCog } from "react-icons/fa";

export default function Sidebar() {
  return (
    <aside className="w-16 bg-blue-800 flex flex-col justify-between py-4 text-white">
      <div className="flex flex-col items-center space-y-6">
        {/* Logo */}
        <img
          src="/safeway_logo.png" 
          width={80}
          height={80}
          alt="Logo SafeWay"
          className="mt-1 mb-4"
        />

        {/* Menu */}
        <button className="hover:text-gray-300">
          <FaHome size={20} />
        </button>
        <button className="hover:text-gray-300">
          <FaThLarge size={20} />
        </button>
      </div>

      {/* Bottom */}
      <div className="flex justify-center">
        <button className="hover:text-gray-300">
          <FaCog size={20} />
        </button>
      </div>
    </aside>
  );
}
