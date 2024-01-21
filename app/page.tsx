import api from "@/api";
import InflationCalculator from "@/components/InflationCalculator";
import { StadisticProvider } from "@/context";

export default async function Home() {
  const inflationPerMonth = await api.inflationPerMonth.get();

  return (
    <StadisticProvider stadisticPerMonth={inflationPerMonth}>
      <InflationCalculator />
    </StadisticProvider>
  );
}
