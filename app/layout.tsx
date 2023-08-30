import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ex País",
  description: "Calcula la inflación de Argentina",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="lofi">
      <body
        className={`${inter.className} bg-base-300 h-screen flex justify-center items-center p-6`}
      >
        {children}
      </body>
    </html>
  );
}
