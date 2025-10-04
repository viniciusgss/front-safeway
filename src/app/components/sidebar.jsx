"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaChartPie, FaBrain, FaCog } from "react-icons/fa";

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <aside
      className={`bg-blue-800 text-white flex flex-col justify-between py-4 transition-all duration-300 ${
        isExpanded ? "w-48" : "w-16"
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Topo */}
      <div className="flex flex-col items-center space-y-6 mt-[-8px]">
        {/* ⬆️ puxa tudo um pouco pra cima com margem negativa */}

        {/* Logo clicável */}
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Image
            src="/safeway_logo.png"
            width={80}
            height={80}
            alt="Logo SafeWay"
            className="mb-2 cursor-pointer"
          />
        </Link>

        {/* Menu */}
        <nav className="flex flex-col items-start space-y-4 w-full px-2 mt-2">
          <Link
            href="/dashboard"
            className="flex items-center space-x-3 hover:bg-blue-700 rounded-md p-2 w-full transition-all"
          >
            <FaChartPie size={22} />
            {isExpanded && <span className="text-sm font-medium">Dashboard</span>}
          </Link>

          <Link
            href="/predicao"
            className="flex items-center space-x-3 hover:bg-blue-700 rounded-md p-2 w-full transition-all"
          >
            <FaBrain size={22} />
            {isExpanded && <span className="text-sm font-medium">Predição</span>}
          </Link>
        </nav>
      </div>

      {/* Rodapé */}
      <div className="flex items-center justify-center px-2">
        <button className="flex items-center space-x-3 hover:bg-blue-700 rounded-md p-2 w-full transition-all">
          <FaCog size={20} />
          {isExpanded && <span className="text-sm font-medium">Configurações</span>}
        </button>
      </div>
    </aside>
  );
}
