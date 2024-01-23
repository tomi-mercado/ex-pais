import api from "@/api";
import CanastaBasicaCalculator from "@/components/CanastaBasicaCalculator";
import { StadisticProvider } from "@/context";

export default async function CanastaBasica() {
  const canastaBasicaPerMonth = await api.canastaBasicaPerMonth.get();

  return (
    <>
      <p className="text-xl">Calculadora de canasta básica</p>

      <StadisticProvider stadisticPerMonth={canastaBasicaPerMonth}>
        <CanastaBasicaCalculator />
      </StadisticProvider>
    </>
  );
}
