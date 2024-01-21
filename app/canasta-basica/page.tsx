import api from "@/api";
import CanastaBasicaCalculator from "@/components/CanastaBasicaCalculator";
import { StadisticProvider } from "@/context";

export default async function CanastaBasica() {
  const canastaBasicaPerMonth = await api.canastaBasicaPerMonth.get();
  console.log(canastaBasicaPerMonth);

  return (
    <StadisticProvider stadisticPerMonth={canastaBasicaPerMonth}>
      <CanastaBasicaCalculator />
    </StadisticProvider>
  );
}
