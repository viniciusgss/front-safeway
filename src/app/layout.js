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
      <body className="relative flex min-h-screen bg-[#0d1117] text-gray-100">
        {/* Luz de fundo suave */}
        <div className="fixed inset-0 bg-gradient-radial from-blue-800/20 via-transparent to-transparent blur-3xl pointer-events-none"></div>

        {/* Sidebar fixa */}
        <Sidebar className="fixed left-0 top-0 h-full z-20" />

        {/* Conteúdo principal */}
        <div className="flex flex-col flex-1 ml-16 relative">
          <Header />
          <main className="flex-grow p-6 overflow-y-auto mt-[4rem]">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
