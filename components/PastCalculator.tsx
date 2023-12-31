import { useInflation } from "@/context";
import React, { useState } from "react";

const calculateNewPrice = (oldPrice: number, inflation: number) => {
  const percentage = inflation / 100;
  const newPrice = (percentage + 1) * oldPrice;

  return newPrice.toFixed(2);
};

const calculateOldPrice = (newPrice: number, inflation: number) => {
  const percentage = inflation / 100;
  const oldPrice = newPrice / (percentage + 1);

  return oldPrice.toFixed(2);
};

const InputWithDollarSign: React.FC<{
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  value: number | null;
}> = ({ onChange, placeholder, name, value }) => {
  return (
    <div className="relative w-full">
      <div className="absolute top-0 left-0 h-full w-8 flex items-center justify-center bg-slate-400">
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
    <form className="w-full">
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Algo que estaba...</span>
        </div>
        <div className="w-full flex items-center gap-2">
          <InputWithDollarSign
            placeholder={`Escribe un precio de ${fromMonth}/${fromYear}`}
            onChange={handleChange}
            name="from"
            value={prices.from}
          />
          {
            <p className="w-full">
              Hoy está
              {!prices.from
                ? "..."
                : ` $${calculateNewPrice(prices.from, result)}`}
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
              En {fromMonth}/{fromYear} estaba
              {!prices.actual
                ? "..."
                : ` $${calculateOldPrice(prices.actual, result)}`}
            </p>
          }
        </div>
      </label>
    </form>
  );
};

export default PastCalculator;
