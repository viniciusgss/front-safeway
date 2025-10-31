export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-gray-800 px-6 text-center space-y-8">
      
      {/* Título principal */}
      <h1 className="text-4xl font-bold text-gray-900">
        SafeWay — Sistema de Rotas Seguras
      </h1>

      {/* Introdução */}
      <p className="max-w-2xl text-lg text-gray-600">
        O <strong>SafeWay</strong> é um sistema inteligente desenvolvido para 
        analisar e prever acidentes de trânsito, auxiliando na criação de 
        rotas mais seguras e eficientes.
      </p>

      {/* Seções explicativas */}
      <div className="max-w-3xl space-y-6 text-gray-700">
        <section>
          <h2 className="text-2xl font-semibold text-blue-700 mb-2">📊 Dashboard</h2>
          <p>
            A seção de <strong>Dashboard</strong> mostra dados reais e históricos
            sobre acidentes de trânsito, permitindo identificar padrões e áreas de risco.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-green-700 mb-2">🤖 Predição</h2>
          <p>
            A área de <strong>Predição</strong> utiliza modelos de aprendizado de máquina
            para prever a ocorrência de acidentes entre <strong>2020 e 2025</strong>,
            considerando fatores como data, hora e localização.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-purple-700 mb-2">🧠 Deep Learning</h2>
          <p>
            A seção de <strong>Deep Learning</strong> calcula rotas seguras em tempo real,
            sugerindo os melhores caminhos para evitar acidentes e congestionamentos.
          </p>
        </section>
      </div>

      {/* Rodapé simples */}
      <footer className="mt-12 text-gray-400 text-sm">
        © 2025 SafeWay — Inteligência Artificial aplicada à segurança no trânsito
      </footer>
    </div>
  );
}
