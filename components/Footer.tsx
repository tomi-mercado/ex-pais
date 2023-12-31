import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-300 px-4 py-6 w-full text-sm flex justify-center gap-5">
      <p className="self-center">
        Hecho con ❤️ desde el mejor país del mundo 🇦🇷 por{" "}
        <a className="underline" href="https://tomas-mercado.dev">
          Tom
        </a>
      </p>
    </footer>
  );
};

export default Footer;
