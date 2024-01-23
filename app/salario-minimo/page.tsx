import api from "@/api";
import MinimumSalaryCalculator from "@/components/MinimumSalaryCalculator";
import { StadisticProvider } from "@/context";

export default async function CanastaBasica() {
  const minimumSalaryPerMonth = await api.minimumSalaryPerMonth.get();

  return (
    <>
      <p className="text-xl">Calculadora de Salario Mínimo vital y móvil</p>

      <StadisticProvider stadisticPerMonth={minimumSalaryPerMonth}>
        <MinimumSalaryCalculator />
      </StadisticProvider>
    </>
  );
}
