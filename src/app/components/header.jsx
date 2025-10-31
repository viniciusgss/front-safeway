import Image from 'next/image'; 
import { FaUserCircle } from "react-icons/fa";

// O caminho para o logo que você confirmou
const SafeWayLogo = "/safeway_logo.png"; 

export default function Header() {
  return (
    // ALTERAÇÕES IMPORTANTES:
    // 1. `sticky top-0`: Faz o header grudar no topo da sua tela quando você rola.
    // 2. `h-16`: Define uma altura fixa para o header (igual à altura de linha da sidebar).
    // 3. REMOVIDO: O `ml-16` que foi sugerido antes.
    <header className="bg-[#0B0F1A] px-8 py-3 flex justify-between items-center text-white shadow-lg z-40 sticky top-0 h-16">
      
      {/* Lado Esquerdo: Logo SafeWay */}
      <div className="flex items-center">
        {SafeWayLogo && ( 
          <Image
            src={SafeWayLogo}
            alt="SafeWay Logo"
            // Dimensões reduzidas
            width={80} 
            height={20} 
            className="mr-4 object-contain"
          />
        )}
      </div>

      {/* Lado Direito: Ícone e Email do Usuário */}
      <div className="flex items-center space-x-2 cursor-pointer hover:text-purple-400 transition-colors">
        <FaUserCircle size={24} />
        <span className="text-sm font-medium">exemplo@gmail.com</span>
      </div>
    </header>
  );
}