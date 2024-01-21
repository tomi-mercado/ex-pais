import api from "@/api";
import Aclaration from "@/components/Aclaration";
import CanastaBasicaCalculator from "@/components/CanastaBasicaCalculator";
import { StadisticProvider } from "@/context";

export default async function CanastaBasica() {
  const canastaBasicaPerMonth = await api.canastaBasicaPerMonth.get();
  console.log(canastaBasicaPerMonth);

  return (
    <>
      <p className="absolute top-4 right-4">
        <Aclaration>
          El cálculo se realiza a partir de la{" "}
          <a
            className="underline"
            href="https://www.indec.gob.ar/indec/web/Nivel4-Tema-4-43-149"
          >
            Canasta Básica Alimentaria
          </a>
        </Aclaration>
      </p>

      <p className="text-xl">Calculadora de canasta básica</p>

      <StadisticProvider stadisticPerMonth={canastaBasicaPerMonth}>
        <CanastaBasicaCalculator />
      </StadisticProvider>
    </>
  );
}
