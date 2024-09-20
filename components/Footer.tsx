import Image from "next/image";
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="px-4 pb-6 pt-2 w-full text-sm flex flex-col justify-between items-center gap-5 border-t border-primary bg-muted">
      <span />

      <p className="text-center">
        Hecho con ❤️ desde el mejor país del mundo 🇦🇷 por{" "}
        <a
          className="font-bold"
          target="_blank"
          href="https://tomas-mercado.dev"
        >
          Tom
        </a>
      </p>

      <a
        href="https://cafecito.app/ex-pais"
        rel="noopener"
        target="_blank"
        className="flex items-center"
      >
        <span className="mr-2 text-xs">¿Te gusta Ex País?</span>
        <Image
          src="https://cdn.cafecito.app/imgs/buttons/button_3.png"
          alt="Invitame un café en cafecito.app"
          width={120}
          height={40}
        />
      </a>
    </footer>
  );
};

export default Footer;
