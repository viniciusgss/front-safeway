import "./globals.css";
import Header from "./components/header";
import Sidebar from "./components/sidebar";

export const metadata = {
  title: "SafeWay",
  description: "Rotas Seguras",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen">
        {/* Sidebar à esquerda */}
        <Sidebar />

        <div className="flex flex-col flex-1">
          {/* Header no topo */}
          <Header />

          {/* Conteúdo da página */}
          <main className="p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
