"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaChartPie, FaBrain, FaCog, FaHome, FaRobot } from "react-icons/fa";

export default function Sidebar({ className = "" }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();

  // Função para aplicar estilo ativo
  const getLinkClassName = (href) => {
    const isActive = pathname === href;
    return `
      flex items-center space-x-3 rounded-md p-2 w-full transition-all active:scale-95
      ${isActive ? "bg-purple-600 shadow-md" : "hover:bg-[#1F2937]"}
    `;
  };

  return (
    <aside
      className={`bg-[#0B0F1A] text-white flex flex-col justify-between py-4 transition-all duration-300 
      rounded-r-lg shadow-2xl backdrop-blur-lg bg-opacity-95
      fixed top-0 left-0 h-screen z-50
      animate-float
      ${isExpanded ? "w-48" : "w-16"} ${className}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      style={{
        boxShadow: "0 8px 32px 0 rgba(88, 28, 135, 0.37)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        border: "1px solid rgba(255, 255, 255, 0.18)",
      }}
    >
      {/* Topo */}
      <div className="flex flex-col items-center space-y-6 mt-4">
        {/* Home */}
        <Link
          href="/"
          className={`flex items-center justify-center w-12 h-12 rounded-md hover:bg-[#1F2937] transition-all active:scale-95 ${
            isExpanded ? "self-start ml-2" : ""
          } ${pathname === "/" ? "bg-purple-600 shadow-md" : ""}`}
        >
          <FaHome size={20} />
        </Link>

        {/* Menu */}
        <nav className="flex flex-col items-start space-y-2 w-full px-2 mt-2">
          <Link href="/dashboard" className={getLinkClassName("/dashboard")}>
            <FaChartPie size={22} />
            {isExpanded && <span className="text-sm font-medium">Dashboard</span>}
          </Link>

          <Link href="/predicao" className={getLinkClassName("/predicao")}>
            <FaBrain size={22} />
            {isExpanded && <span className="text-sm font-medium">Predição</span>}
          </Link>

          <Link href="/deeplearning" className={getLinkClassName("/deeplearning")}>
            <FaRobot size={22} />
            {isExpanded && <span className="text-sm font-medium">Deep Learning</span>}
          </Link>
        </nav>
      </div>

      {/* Rodapé */}
      <div className="flex items-center justify-center px-2">
        <Link href="/configuracoes" className={getLinkClassName("/configuracoes")}>
          <FaCog size={20} />
          {isExpanded && <span className="text-sm font-medium">Configurações</span>}
        </Link>
      </div>
    </aside>
  );
}
