"use client";

import React, { createContext, useContext, useState } from "react";
import { generateKeyMonthYear } from "./utils";

interface InflationContextData {
  inflationPerMonth: Record<string, number>;
  monthsOfFromYear: number[];
  monthsOfToYear: number[];
  fromYears: number[];
  toYears: number[];
  fromMonth: number;
  fromYear: number;
  toMonth: number;
  toYear: number;
  result: number | null;
  setResult: React.Dispatch<React.SetStateAction<number | null>>;
  setFromMonth: React.Dispatch<React.SetStateAction<number>>;
  setFromYear: React.Dispatch<React.SetStateAction<number>>;
  setToMonth: React.Dispatch<React.SetStateAction<number>>;
  setToYear: React.Dispatch<React.SetStateAction<number>>;
  calculateInflation: (
    inflationPerMonth: Record<string, number>,
    from: { month: number; year: number },
    to: { month: number; year: number }
  ) => number;
}

interface InflationProviderProps {
  children: React.ReactNode;
  inflationPerMonth: Record<string, number>;
}

const InflationContext = createContext<InflationContextData | undefined>(
  undefined
);

const getMonthsOfYear = (dates: string[], year: number) =>
  dates
    .filter((key) => parseInt(key.split("-")[1]) === year)
    .map((key) => parseInt(key.split("-")[0]));

const getAvailableYears = (dates: string[]) =>
  Array.from(new Set(dates.map((date) => parseInt(date.split("-")[1])))).sort(
    (a, b) => a - b
  );

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

export const InflationProvider: React.FC<InflationProviderProps> = ({
  children,
  inflationPerMonth,
}) => {
  const dates = Object.keys(inflationPerMonth);
  const availableYears = getAvailableYears(dates);

  const firstYear = availableYears[0];
  const firstMonth = getMonthsOfYear(dates, firstYear)[0];

  const lastYear = availableYears[availableYears.length - 1];
  const lastMonth = getMonthsOfYear(dates, lastYear).at(-1) as number;

  const [result, setResult] = useState<number | null>(null);

  const [fromMonth, setFromMonth] = useState(firstMonth);
  const [fromYear, setFromYear] = useState(firstYear);

  const [toMonth, setToMonth] = useState(lastMonth);
  const [toYear, setToYear] = useState(lastYear);

  const fromYears = availableYears.filter((year) => year <= toYear);
  const toYears = availableYears.filter((year) => year >= fromYear);

  const monthsOfToYear = getMonthsOfYear(dates, toYear);
  const monthsOfFromYear = getMonthsOfYear(dates, fromYear);

  const contextValue: InflationContextData = {
    inflationPerMonth,
    monthsOfFromYear,
    monthsOfToYear,
    fromYears,
    toYears,
    fromMonth,
    fromYear,
    toMonth,
    toYear,
    result,
    calculateInflation,
    setResult,
    setFromMonth,
    setFromYear,
    setToMonth,
    setToYear,
  };

  return (
    <InflationContext.Provider value={contextValue}>
      {children}
    </InflationContext.Provider>
  );
};

export const useInflation = () => {
  const context = useContext(InflationContext);
  if (!context) {
    throw new Error("useInflation must be used within a InflationProvider");
  }
  return context;
};
