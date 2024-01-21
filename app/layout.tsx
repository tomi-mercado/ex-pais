import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { FaDatabase } from "react-icons/fa";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ex País",
  description: "Calcula la inflación de Argentina",
  icons: [
    {
      rel: "icon",
      url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📉</text></svg>",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${inter.className} min-h-screen flex flex-col justify-center items-center relative`}
      >
        <Navbar />
        <main className="py-6 px-4 h-full flex flex-col justify-between items-center grow gap-4 w-full">
          <div className="flex flex-col gap-6 text-center items-center p-6 rounded-xl bg-card w-fit text-card-foreground light md:min-w-[670px] relative">
            {children}
          </div>

          <p className="self-end text-xs">
            <FaDatabase className="inline mr-1 mb-1" />
            <span>
              Los datos son provistos por{" "}
              <a className="underline" href="https://datos.gob.ar/dataset">
                Datos Argentina
              </a>
            </span>
          </p>
        </main>
        <Footer />
      </body>
    </html>
  );
}
