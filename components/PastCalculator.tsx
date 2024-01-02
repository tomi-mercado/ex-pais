import { useInflation } from "@/context";
import { addZeroIfNecessary } from "@/utils";
import React, { useState } from "react";

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

  const [prices, setPrices] = useState({
    from: null,
    actual: null,
  });

  const [collapseState, setCollapseState] = useState("close");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (value === "" || value === "0") {
      setPrices({
        ...prices,
        [name]: null,
      });
    }

    const numberValue = Number(value);
    const isNumber = !isNaN(numberValue);

    if (!isNumber) {
      return;
    }

    setPrices({
      ...prices,
      [name]: numberValue,
    });
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
          setCollapseState(collapseState === "open" ? "close" : "open");
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
                value={prices.from}
              />
              {
                <p className="w-full">
                  Hoy está
                  {!prices.from ? (
                    "..."
                  ) : (
                    <strong>{` ${calculateNewPrice(
                      prices.from,
                      result
                    )}`}</strong>
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
                value={prices.actual}
              />
              {
                <p className="w-full">
                  En {addZeroIfNecessary(fromMonth)}/{fromYear} estaba
                  {!prices.actual ? (
                    "..."
                  ) : (
                    <strong>{` ${calculateOldPrice(
                      prices.actual,
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
