"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaChartPie, FaBrain, FaCog, FaHome, FaRobot, FaRoute} from "react-icons/fa";

// Largura da área de ativação do hover (em pixels)
const HOVER_AREA_WIDTH = 10; 
// Largura da sidebar quando expandida (em classes Tailwind)
const EXPANDED_WIDTH_CLASS = "w-48";
// Largura da sidebar quando recolhida (em classes Tailwind)
const COLLAPSED_WIDTH_CLASS = "w-16";

export default function Sidebar({ className = "" }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHoveringArea, setIsHoveringArea] = useState(false);
  const pathname = usePathname();

  // Função para aplicar estilo ativo
  const getLinkClassName = (href) => {
    const isActive = pathname === href;
    return `
      flex items-center space-x-3 rounded-md p-2 w-full transition-all active:scale-95
      ${isActive ? "bg-purple-600 shadow-md" : "hover:bg-[#1F2937]"}
    `;
  };

  // 1. Lógica para detectar o mouse na borda esquerda da tela
  useEffect(() => {
    const handleMouseMove = (event) => {
      // Verifica se o mouse está na área de ativação (borda esquerda)
      if (event.clientX < HOVER_AREA_WIDTH) {
        setIsHoveringArea(true);
      } else {
        setIsHoveringArea(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // 2. Lógica para expandir/recolher a sidebar
  const handleMouseEnter = () => {
    // Expande se o mouse estiver na área de ativação OU se o mouse entrar na própria sidebar
    if (isHoveringArea) {
      setIsExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    // Recolhe a sidebar quando o mouse sair dela
    setIsExpanded(false);
  };

  // 3. Classe CSS para a posição da sidebar
  const sidebarPositionClass = isExpanded ? "translate-x-0" : "-translate-x-full";
  
  // 4. Classe CSS para a largura
  const sidebarWidthClass = isExpanded ? EXPANDED_WIDTH_CLASS : COLLAPSED_WIDTH_CLASS;

  return (
    <>
      {/* Área de ativação invisível na borda esquerda */}
      <div 
        className="fixed top-0 left-0 h-screen z-50 transition-all duration-300"
        style={{ width: `${HOVER_AREA_WIDTH}px` }}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      />

      {/* Sidebar Principal */}
      <aside
        className={`bg-[#0B0F1A] text-white flex flex-col justify-between py-4 transition-all duration-300 ease-in-out 
        rounded-r-lg shadow-2xl backdrop-blur-lg bg-opacity-95
        fixed top-0 left-0 h-screen z-50
        ${sidebarWidthClass} ${sidebarPositionClass} ${className}`}
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

             <Link href="/chatbot" className={getLinkClassName("/chatbot")}>
              <FaRobot size={22} />
              {isExpanded && <span className="text-sm font-medium">chat bot</span>}
            </Link> 

            <Link href="/mapa" className={getLinkClassName("/mapa")}>
              <FaRoute size={22} />
              {isExpanded && <span className="text-sm font-medium">mapa</span>}
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
    </>
  );
}