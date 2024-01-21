import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="px-4 py-6 w-full text-sm flex justify-center gap-5 border-t border-primary bg-muted">
      <p className="self-center text-center">
        Hecho con ❤️ desde el mejor país del mundo 🇦🇷 por{" "}
        <a
          className="font-bold"
          target="_blank"
          href="https://tomas-mercado.dev"
        >
          Tom
        </a>
      </p>
    </footer>
  );
};

export default Footer;
