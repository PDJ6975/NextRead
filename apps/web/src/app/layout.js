import "./globals.css";
import "../styles/cozy-design-system.css";
import { AuthProvider } from "../contexts/AuthContext";

export const metadata = {
  title: "NextRead - Descubre tu próximo libro favorito",
  description: "Obtén recomendaciones personalizadas de libros basadas en tus gustos y preferencias de lectura",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700;800&family=Comfortaa:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-cozy antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
