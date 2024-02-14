import api from "@/api";
import AdquisitivePowerCalculator from "@/components/AdquisitivePowerCalculator";
import { StadisticProvider } from "@/context";

export default async function AdquisitivePower() {
  const inflationPerMonth = await api.inflationPerMonth.get();

  return (
    <>
      <p className="text-xl">Calculadora de poder adquisitivo</p>

      <StadisticProvider stadisticPerMonth={inflationPerMonth}>
        <AdquisitivePowerCalculator />
      </StadisticProvider>
    </>
  );
}
