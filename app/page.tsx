import api from "@/api";
import InflationCalculator from "@/components/InflationCalculator";
import { InflationProvider } from "@/context";
import { FaDatabase } from "react-icons/fa";

export default async function Home() {
  const inflationPerMonth = await api.inflationPerMonth.get();

  return (
    <div className="py-6 px-4 h-full flex flex-col justify-between w-full items-center">
      <div className="flex flex-col gap-6 text-center items-center p-6 bg-base-100 rounded-md border-2 border-cyan-300 w-fit">
        <div className="flex flex-col gap-2 text-center items-center">
          <h1 className="text-4xl">📉</h1>
          <h1 className="text-4xl">Ex País</h1>
          <p className="text-xl">
            Calcula la inflación de Argentina en un tramo específico de tiempo.
          </p>
        </div>

        <InflationProvider inflationPerMonth={inflationPerMonth}>
          <InflationCalculator inflationPerMonth={inflationPerMonth} />
        </InflationProvider>
      </div>

      <p className="self-end text-xs">
        <FaDatabase className="inline mr-1 mb-1" />
        <span>
          Los datos son provistos por{" "}
          <a
            className="underline"
            href="https://datos.gob.ar/dataset"
            target="_blank"
          >
            Datos Argentina
          </a>
          , y el cálculo se realiza a partir del{" "}
          <a
            className="underline"
            href="https://www.indec.gob.ar/indec/web/Nivel4-Tema-3-5-31"
            target="_blank"
          >
            IPC
          </a>
        </span>
      </p>
    </div>
  );
}
