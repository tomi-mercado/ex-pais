import api from "@/api";
import InflationCalculator from "@/components/InflationCalculator";

export default async function Home() {
  const inflationPerMonth = await api.inflationPerMonth.get();

  const firstMonthYear = Object.keys(inflationPerMonth)[0];
  const lastMonthYear = Object.keys(inflationPerMonth).at(-1) as string;

  const firstMonth = parseInt(firstMonthYear.split("-")[0]);
  const firstYear = parseInt(firstMonthYear.split("-")[1]);

  const lastMonth = parseInt(lastMonthYear.split("-")[0]);
  const lastYear = parseInt(lastMonthYear.split("-")[1]);

  return (
    <div className="flex flex-col gap-6 text-center items-center">
      <div className="flex flex-col gap-2 text-center items-center">
        <h1 className="text-4xl">📉</h1>
        <h1 className="text-4xl">Ex País</h1>
        <p className="text-xl">
          Calcula la inflación de Argentina en un tramo específico de tiempo.
        </p>
      </div>

      <InflationCalculator
        inflationPerMonth={inflationPerMonth}
        defaultValues={{
          from: {
            month: firstMonth,
            year: firstYear,
          },
          to: {
            month: lastMonth,
            year: lastYear,
          },
        }}
      />
    </div>
  );
}
