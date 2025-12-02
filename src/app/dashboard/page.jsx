'use client';

import { useEffect, useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { accidentsAPI } from '@/services/apiService';

// Cores do seu app
const COLORS = ['#D946EF', '#A855F7', '#7C3AED', '#6D28D9', '#4C1D95', '#E879F9', '#F0ABFC'];

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [byState, setByState] = useState([]);
  const [byType, setByType] = useState([]);
  const [byHour, setByHour] = useState([]);
  const [byDayWeek, setByDayWeek] = useState([]);
  const [topMunicipalities, setTopMunicipalities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [statsRes, stateRes, typeRes, hourRes, dayWeekRes, municipalitiesRes] = await Promise.all([
          accidentsAPI.getStats(),
          accidentsAPI.getByState(),
          accidentsAPI.getByType(),
          accidentsAPI.getByHour(),
          accidentsAPI.getByDayWeek(),
          accidentsAPI.getTopMunicipalities(15),
        ]);

        setStats(statsRes.data.data);
        setByState(stateRes.data.data);
        
        setByType(typeRes.data.data.slice(0, 10).map(item => ({
          name: item.tipo_acidente,
          value: item.total
        })));
        
        setByHour(hourRes.data.data.map(item => ({
          hora: `${String(item.hora).padStart(2, '0')}:00`,
          acidentes: item.total
        })));
        
        setByDayWeek(dayWeekRes.data.data.map(item => ({
          dia: item.dia_semana,
          acidentes: item.total
        })));
        
        setTopMunicipalities(municipalitiesRes.data.data);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
        setError('Erro ao carregar dados. Verifique se a API está rodando em http://127.0.0.1:8000' );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0B0F1A] to-[#1a1f3a]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0B0F1A] to-[#1a1f3a]">
        <div className="text-center text-red-400">
          <p className="text-lg font-bold mb-2">❌ Erro ao Carregar Dados</p>
          <p>{error}</p>
          <p className="text-sm mt-4">Certifique-se de que:</p>
          <ul className="text-sm mt-2 text-left inline-block text-gray-300">
            <li>✓ A API está rodando em http://localhost:8000</li>
            <li>✓ O arquivo datatran_consolidado.json está na pasta upload</li>
          </ul>
        </div>
      </div>
     );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F1A] via-[#1a1f3a] to-[#2d1b4e] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Dashboard de Acidentes
          </h1>
          <p className="text-gray-400">Análise de dados de acidentes de trânsito no Brasil</p>
        </div>

        {/* Cards de Estatísticas */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-[#1a1f3a] to-[#2d1b4e] rounded-lg shadow-lg p-6 border border-purple-500/20 hover:border-purple-500/50 transition-all">
              <h3 className="text-gray-400 text-sm font-semibold mb-2">Total de Acidentes</h3>
              <p className="text-3xl font-bold text-purple-400">
                {stats.total_acidentes?.toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="bg-gradient-to-br from-[#1a1f3a] to-[#2d1b4e] rounded-lg shadow-lg p-6 border border-purple-500/20 hover:border-purple-500/50 transition-all">
              <h3 className="text-gray-400 text-sm font-semibold mb-2">Estados Afetados</h3>
              <p className="text-3xl font-bold text-pink-400">
                {stats.estados_disponiveis?.length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-[#1a1f3a] to-[#2d1b4e] rounded-lg shadow-lg p-6 border border-purple-500/20 hover:border-purple-500/50 transition-all">
              <h3 className="text-gray-400 text-sm font-semibold mb-2">Municípios</h3>
              <p className="text-3xl font-bold text-purple-400">
                {stats.municipios_total?.toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="bg-gradient-to-br from-[#1a1f3a] to-[#2d1b4e] rounded-lg shadow-lg p-6 border border-purple-500/20 hover:border-purple-500/50 transition-all">
              <h3 className="text-gray-400 text-sm font-semibold mb-2">Tipos de Acidentes</h3>
              <p className="text-3xl font-bold text-pink-400">
                {stats.tipos_acidente?.length}
              </p>
            </div>
          </div>
        )}

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Acidentes por Estado */}
          <div className="bg-gradient-to-br from-[#1a1f3a] to-[#2d1b4e] rounded-lg shadow-lg p-6 border border-purple-500/20">
            <h2 className="text-xl font-bold text-purple-400 mb-4">Acidentes por Estado</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={byState}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4C1D95" />
                <XAxis dataKey="uf" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  formatter={(value) => value.toLocaleString('pt-BR')}
                  contentStyle={{ backgroundColor: '#1a1f3a', border: '1px solid #7C3AED' }}
                  labelStyle={{ color: '#E879F9' }}
                />
                <Bar dataKey="total" fill="#D946EF" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Acidentes por Hora */}
          <div className="bg-gradient-to-br from-[#1a1f3a] to-[#2d1b4e] rounded-lg shadow-lg p-6 border border-purple-500/20">
            <h2 className="text-xl font-bold text-purple-400 mb-4">Acidentes por Hora do Dia</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={byHour}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4C1D95" />
                <XAxis dataKey="hora" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  formatter={(value) => value.toLocaleString('pt-BR')}
                  contentStyle={{ backgroundColor: '#1a1f3a', border: '1px solid #7C3AED' }}
                  labelStyle={{ color: '#E879F9' }}
                />
                <Legend wrapperStyle={{ color: '#D1D5DB' }} />
                <Line type="monotone" dataKey="acidentes" stroke="#A855F7" strokeWidth={3} dot={{ fill: '#D946EF' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Acidentes por Dia da Semana */}
          <div className="bg-gradient-to-br from-[#1a1f3a] to-[#2d1b4e] rounded-lg shadow-lg p-6 border border-purple-500/20">
            <h2 className="text-xl font-bold text-purple-400 mb-4">Acidentes por Dia da Semana</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={byDayWeek}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4C1D95" />
                <XAxis dataKey="dia" angle={-45} textAnchor="end" height={100} stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  formatter={(value) => value.toLocaleString('pt-BR')}
                  contentStyle={{ backgroundColor: '#1a1f3a', border: '1px solid #7C3AED' }}
                  labelStyle={{ color: '#E879F9' }}
                />
                <Bar dataKey="acidentes" fill="#A855F7" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top 10 Tipos de Acidentes */}
          <div className="bg-gradient-to-br from-[#1a1f3a] to-[#2d1b4e] rounded-lg shadow-lg p-6 border border-purple-500/20">
            <h2 className="text-xl font-bold text-purple-400 mb-4">Top 10 Tipos de Acidentes</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={byType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name.substring(0, 15)}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {byType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => value.toLocaleString('pt-BR')}
                  contentStyle={{ backgroundColor: '#1a1f3a', border: '1px solid #7C3AED' }}
                  labelStyle={{ color: '#E879F9' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tabela de Municípios Críticos */}
        <div className="bg-gradient-to-br from-[#1a1f3a] to-[#2d1b4e] rounded-lg shadow-lg p-6 border border-purple-500/20">
          <h2 className="text-xl font-bold text-purple-400 mb-4">Top 15 Municípios com Mais Acidentes</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-purple-500/30">
                  <th className="text-left py-3 px-4 font-semibold text-purple-400">Posição</th>
                  <th className="text-left py-3 px-4 font-semibold text-purple-400">Município</th>
                  <th className="text-left py-3 px-4 font-semibold text-purple-400">Estado</th>
                  <th className="text-right py-3 px-4 font-semibold text-purple-400">Total de Acidentes</th>
                </tr>
              </thead>
              <tbody>
                {topMunicipalities.map((item, index) => (
                  <tr key={index} className="border-b border-purple-500/10 hover:bg-purple-500/10 transition-colors">
                    <td className="py-3 px-4 text-gray-300 font-semibold">{index + 1}</td>
                    <td className="py-3 px-4 text-gray-300">{item.municipio}</td>
                    <td className="py-3 px-4 text-gray-300">{item.uf}</td>
                    <td className="py-3 px-4 text-right text-pink-400 font-semibold">
                      {item.total.toLocaleString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
