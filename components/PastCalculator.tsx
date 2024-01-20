import { useInflation } from "@/context";
import { addZeroIfNecessary } from "@/utils";
import { useSearchParams } from "next/navigation";
import React from "react";

const calculateNewPrice = (oldPrice: number, inflation: number) => {
  const percentage = inflation / 100;
  const newPrice = (percentage + 1) * oldPrice;

  return Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(newPrice);
};

const calculateOldPrice = (newPrice: number, inflation: number) => {
  const percentage = inflation / 100;
  const oldPrice = newPrice / (percentage + 1);

  return Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(oldPrice);
};

const InputWithDollarSign: React.FC<{
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  value: number | null;
}> = ({ onChange, placeholder, name, value }) => {
  return (
    <div className="relative w-full">
      <div className="absolute top-0 left-0 h-full w-8 flex items-center justify-center bg-slate-300">
        $
      </div>
      <input
        type="text"
        placeholder={placeholder}
        className="input input-bordered w-full max-w-xs pl-9"
        name={name}
        onChange={onChange}
        value={value || ""}
      />
    </div>
  );
};

const PastCalculator: React.FC = () => {
  const { fromMonth, fromYear, result } = useInflation();

  const searchParams = useSearchParams();

  const pastFrom = isNaN(parseFloat(searchParams.get("past-from") || ""))
    ? null
    : parseFloat(searchParams.get("past-from") || "");
  const pastActual = isNaN(parseFloat(searchParams.get("past-actual") || ""))
    ? null
    : parseFloat(searchParams.get("past-actual") || "");

  const collapseState = (!!result && searchParams.get("collapse")) || "close";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newParams = new URLSearchParams(searchParams.toString());

    if (value === "" || value === "0") {
      newParams.delete(`past-${name}`);

      window.history.pushState(null, "", `?${newParams.toString()}`);
      return;
    }

    const numberValue = Number(value);
    const isNumber = !isNaN(numberValue);
    if (!isNumber) {
      window.history.pushState(null, "", `?${newParams.toString()}`);
      return;
    }

    newParams.set(`past-${name}`, numberValue.toString());
    window.history.pushState(null, "", `?${newParams.toString()}`);
  };

  if (!result) {
    return null;
  }

  return (
    <div
      tabIndex={0}
      className={`collapse collapse-arrow border border-base-300 bg-base-200 cursor-pointer collapse-${collapseState}`}
    >
      <div
        className="collapse-title font-medium text-left"
        onClick={() => {
          const newParams = new URLSearchParams(searchParams);
          newParams.set(
            "collapse",
            collapseState === "open" ? "close" : "open"
          );

          window.history.pushState(null, "", `?${newParams.toString()}`);
        }}
      >
        ¿Querés deprimirte un poco más? 👇
      </div>
      <div className="collapse-content">
        <form className="w-full">
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Algo que estaba...</span>
            </div>
            <div className="w-full flex items-center gap-2">
              <InputWithDollarSign
                placeholder={`Escribe un precio de ${addZeroIfNecessary(
                  fromMonth
                )}/${fromYear}`}
                onChange={handleChange}
                name="from"
                value={pastFrom}
              />
              {
                <p className="w-full">
                  Hoy está
                  {!pastFrom ? (
                    "..."
                  ) : (
                    <strong>{` ${calculateNewPrice(pastFrom, result)}`}</strong>
                  )}
                </p>
              }
            </div>
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Algo que hoy está...</span>
            </div>
            <div className="w-full flex items-center gap-2">
              <InputWithDollarSign
                placeholder="Escribe un precio actual"
                onChange={handleChange}
                name="actual"
                value={pastActual}
              />
              {
                <p className="w-full">
                  En {addZeroIfNecessary(fromMonth)}/{fromYear} estaba
                  {!pastActual ? (
                    "..."
                  ) : (
                    <strong>{` ${calculateOldPrice(
                      pastActual,
                      result
                    )}`}</strong>
                  )}
                </p>
              }
            </div>
          </label>
        </form>
      </div>
    </div>
  );
};

export default PastCalculator;
