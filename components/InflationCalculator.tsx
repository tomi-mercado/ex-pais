"use client";

import { addZeroIfNecessary, generateKeyMonthYear } from "@/utils";
import Image from "next/image";
import React, { useState } from "react";
import MonthYearSelector from "./MonthYearSelector";

interface InflationCalculatorProps {
  defaultValues?: {
    from: {
      month: number;
      year: number;
    };
    to: {
      month: number;
      year: number;
    };
  };
  inflationPerMonth: Record<string, number>;
}

const calculateInflation = (
  inflationPerMonth: Record<string, number>,
  from: { month: number; year: number },
  to: { month: number; year: number }
) => {
  const fromKey = generateKeyMonthYear(from.month, from.year);
  const toKey = generateKeyMonthYear(to.month, to.year);

  const inflationPerMonthArr = Object.entries(inflationPerMonth);

  const fromValueIndex = inflationPerMonthArr.findIndex(
    ([key]) => key === fromKey
  );
  const toValueIndex = inflationPerMonthArr.findIndex(([key]) => key === toKey);

  if (fromValueIndex === -1) {
    throw new Error(`No inflation data for ${fromKey}`);
  }

  if (toValueIndex === -1) {
    throw new Error(`No inflation data for ${toKey}`);
  }

  const inflationPerMonthSlice = inflationPerMonthArr.slice(
    fromValueIndex,
    toValueIndex + 1
  );

  return (
    (inflationPerMonthSlice.reduce((acc, [, inflationMonth]) => {
      return acc * (1 + inflationMonth);
    }, 1) -
      1) *
    100
  );
};

const InflationCalculator: React.FC<InflationCalculatorProps> = ({
  inflationPerMonth,
  defaultValues,
}) => {
  const [result, setResult] = useState<number | null>(null);
  const [isExploding, setIsExploding] = useState(false);

  const [from, setFrom] = useState({
    month: defaultValues?.from.month || 1,
    year: defaultValues?.from.year || 2017,
  });

  const date = new Date();
  const currentMonth = date.getMonth() + 1;
  const currentYear = date.getFullYear();

  const [to, setTo] = useState({
    month: defaultValues?.to.month || currentMonth,
    year: defaultValues?.to.year || currentYear,
  });

  let availableYears = Object.keys(inflationPerMonth).map((key) =>
    parseInt(key.split("-")[1])
  );
  availableYears = Array.from(new Set(availableYears)).sort((a, b) => a - b);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    try {
      const result = calculateInflation(inflationPerMonth, from, to);

      setIsExploding(true);

      setTimeout(() => {
        setIsExploding(false);
        setResult(result);
      }, 1600);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full items-center">
      <form
        className="flex flex-col gap-4 w-full items-center"
        onSubmit={handleSubmit}
      >
        <MonthYearSelector
          onChange={(month, year) => setFrom({ month, year })}
          defaultMonth={from.month}
          defaultYear={from.year}
          availableYears={availableYears}
        />

        <MonthYearSelector
          onChange={(month, year) => setTo({ month, year })}
          defaultMonth={to.month}
          defaultYear={to.year}
          availableYears={availableYears}
        />

        <button className="btn btn-primary" type="submit">
          Calcular
        </button>
      </form>

      {!!result ? (
        <div className="flex flex-col gap-1 h-32 text-center items-center">
          <p className="text-lg">
            La inflación acumulada entre{" "}
            <strong>
              {addZeroIfNecessary(from.month)}/{from.year}
            </strong>{" "}
            y{" "}
            <strong>
              {addZeroIfNecessary(to.month)}/{to.year}
            </strong>{" "}
            fue de
          </p>
          <p className="text-2xl text-red-700 bg-red-100 w-fit p-3 rounded-md">
            <strong>{result.toFixed(2)}%</strong>
          </p>
        </div>
      ) : (
        <div className="relative h-32 w-32 flex items-center justify-center">
          {!isExploding && <p className="text-8xl">🇦🇷</p>}
          {isExploding && (
            <Image
              priority
              src="/explosion.gif"
              alt="Explosion"
              style={{
                zIndex: 1,
                width: "100%",
                height: "100%",
              }}
              layout="fill"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default InflationCalculator;
