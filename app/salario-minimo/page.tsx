import api from "@/api";
import Aclaration from "@/components/Aclaration";
import MinimumSalaryCalculator from "@/components/MinimumSalaryCalculator";
import { StadisticProvider } from "@/context";

export default async function CanastaBasica() {
  const minimumSalaryPerMonth = await api.minimumSalaryPerMonth.get();

  return (
    <>
      <p className="absolute top-4 right-4">
        <Aclaration>
          El cálculo se realiza a partir del{" "}
          <a
            className="underline"
            href="https://www.indec.gob.ar/indec/web/Nivel4-Tema-4-31-61"
          >
            Salario mínimo vital y móvil
          </a>
        </Aclaration>
      </p>

      <p className="text-xl">Calculadora de Salario Mínimo vital y móvil</p>

      <StadisticProvider stadisticPerMonth={minimumSalaryPerMonth}>
        <MinimumSalaryCalculator />
      </StadisticProvider>
    </>
  );
}
