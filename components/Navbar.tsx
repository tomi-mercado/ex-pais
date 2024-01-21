import Link from "next/link";
import React from "react";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-muted w-full py-4 border-b border-b-primary">
      <div className="container flex justify-between items-center">
        <Link href="/">
          <h1 className="text-2xl hover:text-foreground hover:font-normal">
            📉 Ex País
          </h1>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/">Inflación</Link>
          <Link href="/canasta-basica">Canasta básica</Link>
          <Link href="/salario-minimo">Salario mínimo</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
