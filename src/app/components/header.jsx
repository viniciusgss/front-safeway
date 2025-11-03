import Image from 'next/image'; 
import { FaUserCircle } from "react-icons/fa";
import { MdNotifications } from "react-icons/md";

const SafeWayLogo = "/safeway_logo.png"; 

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-[#0B0F1A] to-[#1a1f3a] px-8 py-4 flex justify-between items-center text-white shadow-2xl z-40 sticky top-0 h-20 border-b border-purple-500/20">
      
      {/* Lado Esquerdo: Logo + Nome SafeWay */}
      <div className="flex items-center gap-4">
        {SafeWayLogo && ( 
          <Image
            src={SafeWayLogo}
            alt="SafeWay Logo"
            width={40} 
            height={40} 
            className="object-contain"
          />
        )}
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            SafeWay
          </h1>
          <p className="text-xs text-gray-400">Dashboard de Acidentes</p>
        </div>
      </div>

      {/* Centro: Título da Página (opcional) 
      <div className="hidden md:flex flex-1 justify-center">
        <p className="text-gray-300 text-sm">Análise de Dados de Trânsito</p>
      </div> */}

      {/* Lado Direito: Notificações + Usuário */}
      <div className="flex items-center gap-6">
        {/* Ícone de Notificações 
        <button className="relative p-2 hover:bg-purple-500/20 rounded-lg transition-colors duration-200">
          <MdNotifications size={24} className="text-gray-300 hover:text-purple-400" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button> */}

        {/* Divisor */}
        <div className="h-8 w-px bg-gray-600"></div>

        {/* Usuário */}
        <div className="flex items-center gap-3 cursor-pointer hover:bg-purple-500/10 px-3 py-2 rounded-lg transition-colors duration-200">
          <div className="flex flex-col items-end">
            <span className="text-sm font-semibold text-white">Usuário</span>
            <span className="text-xs text-gray-400">exemplo@gmail.com</span>
          </div>
          <FaUserCircle size={32} className="text-purple-400" />
        </div>
      </div>
    </header>
  );
}
