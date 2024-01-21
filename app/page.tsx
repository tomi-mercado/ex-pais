import api from "@/api";
import Aclaration from "@/components/Aclaration";
import InflationCalculator from "@/components/InflationCalculator";
import { StadisticProvider } from "@/context";

export default async function Home() {
  const inflationPerMonth = await api.inflationPerMonth.get();

  return (
    <>
      <p className="absolute top-4 right-4">
        <Aclaration>
          El cálculo se realiza a partir del{" "}
          <a
            className="underline"
            href="https://www.indec.gob.ar/indec/web/Nivel4-Tema-3-5-31"
          >
            Índice de Precios al Consumidor
          </a>
        </Aclaration>
      </p>

      <p className="text-xl">Calculadora de inflación</p>

      <StadisticProvider stadisticPerMonth={inflationPerMonth}>
        <InflationCalculator />
      </StadisticProvider>
    </>
  );
}
