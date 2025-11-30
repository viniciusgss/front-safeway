'use client';

import Link from 'next/link';
import { FaChartLine, FaBrain, FaRobot, FaArrowRight, FaRoute, FaComments } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F1A] via-[#1a1f3a] to-[#2d1b4e]">
      {/* Hero Section */}
      <div className="min-h-screen flex flex-col justify-center items-center px-6 text-center space-y-8">
        
        {/* Badge */}
        <div className="inline-flex items-center px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-full">
          <span className="text-purple-300 text-sm font-semibold">✨ Inteligência Artificial para Segurança no Trânsito</span>
        </div>

        {/* Título principal */}
        <div>
          <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent mb-4">
            SafeWay
          </h1>
          <p className="text-2xl text-gray-300 font-light">Sistema de Rotas Seguras</p>
        </div>

        {/* Introdução */}
        <p className="max-w-2xl text-lg text-gray-400 leading-relaxed">
          O <span className="text-purple-400 font-semibold">SafeWay</span> é um sistema inteligente desenvolvido para 
          analisar e prever acidentes de trânsito, auxiliando na criação de 
          rotas mais seguras e eficientes.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link href="/dashboard">
            <button className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-lg shadow-lg transition duration-300 transform hover:scale-105">
              Explorar Dashboard
              <FaArrowRight size={18} />
            </button>
          </Link>
          <Link href="/predicao">
            <button className="flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-purple-500 hover:bg-purple-500/10 text-purple-400 font-bold rounded-lg transition duration-300">
              Fazer Predição
              <FaArrowRight size={18} />
            </button>
          </Link>
        </div>
      </div>

      {/* Seções explicativas */}
      <div className="bg-gradient-to-b from-transparent to-[#0B0F1A] py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-16">
            Nossas Funcionalidades
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card Dashboard */}
            <div className="group bg-gradient-to-br from-[#1a1f3a] to-[#2d1b4e] p-8 rounded-xl border border-purple-500/20 hover:border-purple-500/50 transition duration-300 transform hover:scale-105 hover:shadow-2xl">
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg mb-6 group-hover:scale-110 transition duration-300">
                <FaChartLine className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-purple-400 mb-3">📊 Dashboard</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Visualize dados reais e históricos sobre acidentes de trânsito. 
                Identifique padrões e áreas de risco com gráficos interativos e análises detalhadas.
              </p>
              <Link href="/dashboard">
                <button className="text-purple-400 hover:text-pink-400 font-semibold flex items-center gap-2 transition duration-300">
                  Acessar <FaArrowRight size={16} />
                </button>
              </Link>
            </div>

            {/* Card Predição */}
            <div className="group bg-gradient-to-br from-[#1a1f3a] to-[#2d1b4e] p-8 rounded-xl border border-purple-500/20 hover:border-purple-500/50 transition duration-300 transform hover:scale-105 hover:shadow-2xl">
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-500 to-purple-500 rounded-lg mb-6 group-hover:scale-110 transition duration-300">
                <FaBrain className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-purple-400 mb-3">🧠 Predição</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Utilize modelos de aprendizado de máquina para prever acidentes. 
                Analise fatores como data, hora, localização e condições meteorológicas.
              </p>
              <Link href="/predicao">
                <button className="text-purple-400 hover:text-pink-400 font-semibold flex items-center gap-2 transition duration-300">
                  Acessar <FaArrowRight size={16} />
                </button>
              </Link>
            </div>
            
            {/* Card Mapa de Rotas (Novo) */}
            <div className="group bg-gradient-to-br from-[#1a1f3a] to-[#2d1b4e] p-8 rounded-xl border border-purple-500/20 hover:border-purple-500/50 transition duration-300 transform hover:scale-105 hover:shadow-2xl">
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-pink-500 to-red-500 rounded-lg mb-6 group-hover:scale-110 transition duration-300">
                <FaRoute className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-purple-400 mb-3">🗺️ Mapa de Rotas</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Calcule rotas otimizadas entre dois pontos, considerando o risco de acidentes 
                em tempo real para sugerir caminhos mais seguros.
              </p>
              <Link href="/mapa">
                <button className="text-purple-400 hover:text-pink-400 font-semibold flex items-center gap-2 transition duration-300">
                  Acessar <FaArrowRight size={16} />
                </button>
              </Link>
            </div>

            {/* Card Chatbot (Novo) */}
            <div className="group bg-gradient-to-br from-[#1a1f3a] to-[#2d1b4e] p-8 rounded-xl border border-purple-500/20 hover:border-purple-500/50 transition duration-300 transform hover:scale-105 hover:shadow-2xl">
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg mb-6 group-hover:scale-110 transition duration-300">
                <FaComments className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-purple-400 mb-3">💬 Chatbot</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Interaja com os dados de acidentes usando linguagem natural. 
                Faça perguntas e obtenha insights rápidos sobre os padrões de trânsito.
              </p>
              <Link href="/chatbot">
                <button className="text-purple-400 hover:text-pink-400 font-semibold flex items-center gap-2 transition duration-300">
                  Acessar <FaArrowRight size={16} />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Rodapé */}
      <footer className="border-t border-purple-500/20 py-8 px-6 text-center text-gray-400 text-sm">
        <p>© 2025 SafeWay — Inteligência Artificial aplicada à segurança no trânsito</p>
      </footer>
    </div>
  );
}