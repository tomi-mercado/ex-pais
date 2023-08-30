import api from "@/api";
import InflationCalculator from "@/components/InflationCalculator";

export default async function Home() {
  const inflationPerMonth = await api.inflationPerMonth.get();

  return (
    <div className="flex flex-col gap-6 text-center items-center p-6 bg-base-100 rounded-md border-2 border-cyan-300">
      <div className="flex flex-col gap-2 text-center items-center">
        <h1 className="text-4xl">📉</h1>
        <h1 className="text-4xl">Ex País</h1>
        <p className="text-xl">
          Calcula la inflación de Argentina en un tramo específico de tiempo.
        </p>
      </div>

      <InflationCalculator inflationPerMonth={inflationPerMonth} />
    </div>
  );
}
