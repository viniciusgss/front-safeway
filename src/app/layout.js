import "./globals.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Footer from "./components/Footer";

export const metadata = {
  title: "SafeWay Dashboard",
  description: "Sistema de análise e predição",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="flex h-screen bg-gray-100">
        {/* Sidebar fixa */}
        <Sidebar />

        {/* Conteúdo principal */}
        <div className="flex flex-col flex-1">
          {/* Header no topo */}
          <Header />

          {/* Área de conteúdo que cresce e ocupa o espaço restante */}
          <main className="flex-1 p-6 overflow-y-auto">{children}</main>

          {/* Footer no final da página */}
          <Footer />
        </div>
      </body>
    </html>
  );
}
