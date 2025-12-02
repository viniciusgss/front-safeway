'use client';

import React, { useState } from 'react';
import { FaLock, FaUser, FaSignInAlt, FaSpinner } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function LoginComponent() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // LOGIN FAKE — você pode trocar depois pela API real
    if (username === 'admin' && password === 'admin') {
      setTimeout(() => {
        // cria cookie
        document.cookie = `auth_token=${username}; path=/; max-age=86400`;

        setLoading(false);

        // redireciona
        router.push('/dashboard');
      }, 1000);
    } else {
      setTimeout(() => {
        setLoading(false);
        setError('Credenciais inválidas. Tente "admin" / "admin".');
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F1A] p-6">
      <div className="w-full max-w-md">

        <div className="bg-gradient-to-br from-[#1a1f3a] to-[#2d1b4e] p-8 rounded-xl shadow-2xl border border-purple-500/20">

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4">
              <FaLock className="text-white text-3xl" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Acesso SafeWay
            </h1>
            <p className="text-gray-400 text-sm mt-1">Entre com suas credenciais</p>
          </div>

          {error && (
            <div className="flex items-center p-4 mb-6 text-sm text-red-400 bg-red-900/30 rounded-lg border border-red-500/50">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Usuário
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Seu usuário"
                  className="w-full pl-10 pr-4 py-3 bg-[#0B0F1A] border border-purple-500/30 text-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Senha
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  className="w-full pl-10 pr-4 py-3 bg-[#0B0F1A] border border-purple-500/30 text-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-3 px-6 rounded-lg font-bold text-lg
                bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700
                text-white shadow-lg transition duration-300 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin mr-3" /> Entrando...
                </>
              ) : (
                <>
                  <FaSignInAlt className="mr-2" /> Entrar
                </>
              )}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}
