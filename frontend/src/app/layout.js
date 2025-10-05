// src/app/layout.js
import "./globals.css";

export const metadata = {
  title: "GEA",
  description: "Prototipo móvil con tabs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
