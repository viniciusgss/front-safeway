import "./globals.css";
import Layout from "./components/layout";

export const metadata = {
  title: "SafeWay",
  description: "Rotas Seguras",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
