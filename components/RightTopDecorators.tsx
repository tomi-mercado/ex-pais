"use client";

import { usePathname } from "next/navigation";
import React from "react";
import Aclaration from "./Aclaration";
import { Share } from "./Share";

const RightTopDecorators: React.FC = () => {
  const pathname = usePathname();
  const currentPage = pathname.split("/")[1];

  const aclarationChildren = {
    "": (
      <>
        El cálculo se realiza a partir del{" "}
        <a
          className="underline"
          href="https://www.indec.gob.ar/indec/web/Nivel4-Tema-4-31-61"
        >
          Índice de Precios al Consumidor
        </a>
      </>
    ),
    "salario-minimo": (
      <>
        El cálculo se realiza a partir del{" "}
        <a
          className="underline"
          href="https://www.indec.gob.ar/indec/web/Nivel4-Tema-4-31-61"
        >
          Salario mínimo vital y móvil
        </a>
      </>
    ),
    "canasta-basica": (
      <>
        El cálculo se realiza a partir de la{" "}
        <a
          className="underline"
          href="https://www.indec.gob.ar/indec/web/Nivel4-Tema-4-43-149"
        >
          Canasta Básica Alimentaria
        </a>
      </>
    ),
  }[currentPage];

  return (
    <div className="absolute top-4 right-4 flex items-center gap-2">
      {aclarationChildren && <Aclaration>{aclarationChildren}</Aclaration>}
      <Share />
    </div>
  );
};

export default RightTopDecorators;
