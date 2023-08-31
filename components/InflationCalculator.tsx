"use client";

import { generateKeyMonthYear } from "@/utils";
import React, { useRef, useState } from "react";
import InflationResult from "./InflationResult";
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

const getMonthsOfYear = (dates: string[], year: number) =>
  dates
    .filter((key) => parseInt(key.split("-")[1]) === year)
    .map((key) => parseInt(key.split("-")[0]));

const getAvailableYears = (dates: string[]) =>
  Array.from(new Set(dates.map((date) => parseInt(date.split("-")[1])))).sort(
    (a, b) => a - b
  );

const InflationCalculator: React.FC<InflationCalculatorProps> = ({
  inflationPerMonth,
}) => {
  const dates = Object.keys(inflationPerMonth);
  const availableYears = getAvailableYears(dates);

  const firstYear = availableYears[0];
  const firstMonth = getMonthsOfYear(dates, firstYear)[0];

  const lastYear = availableYears[availableYears.length - 1];
  const lastMonth = getMonthsOfYear(dates, lastYear).at(-1) as number;

  const [result, setResult] = useState<number | null>(null);
  const [isExploding, setIsExploding] = useState(false);

  const [fromMonth, setFromMonth] = useState(firstMonth);
  const [fromYear, setFromYear] = useState(firstYear);

  const [toMonth, setToMonth] = useState(lastMonth);
  const [toYear, setToYear] = useState(lastYear);

  const fromYears = availableYears.filter((year) => year <= toYear);
  const toYears = availableYears.filter((year) => year >= fromYear);

  const isAlreadyExplode = useRef(false);

  const monthsOfToYear = getMonthsOfYear(dates, toYear);
  const monthsOfFromYear = getMonthsOfYear(dates, fromYear);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    try {
      const result = calculateInflation(
        inflationPerMonth,
        {
          month: fromMonth,
          year: fromYear,
        },
        {
          month: toMonth,
          year: toYear,
        }
      );

      if (isAlreadyExplode.current) {
        return;
      }

      setIsExploding(true);

      setTimeout(() => {
        setIsExploding(false);
        setResult(result);
        isAlreadyExplode.current = true;
      }, 1600);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFromChange = (month: number, year: number) => {
    setFromMonth(month);
    setFromYear(year);

    if (isAlreadyExplode.current) {
      const result = calculateInflation(
        inflationPerMonth,
        {
          month,
          year,
        },
        {
          month: toMonth,
          year: toYear,
        }
      );
      setResult(result);
    }
  };

  const handleToChange = (month: number, year: number) => {
    setToMonth(month);
    setToYear(year);

    if (isAlreadyExplode.current) {
      const result = calculateInflation(
        inflationPerMonth,
        {
          month: fromMonth,
          year: fromYear,
        },
        {
          month,
          year,
        }
      );
      setResult(result);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full items-center">
      <form
        className="flex flex-col gap-4 w-full items-center"
        onSubmit={handleSubmit}
      >
        <MonthYearSelector
          onChange={handleFromChange}
          defaultMonth={fromMonth}
          defaultYear={fromYear}
          availableYears={fromYears}
          availableMonths={monthsOfFromYear}
        />

        <MonthYearSelector
          onChange={handleToChange}
          defaultMonth={toMonth}
          defaultYear={toYear}
          availableYears={toYears}
          availableMonths={monthsOfToYear}
        />

        <button className="btn btn-primary" type="submit">
          Calcular
        </button>
      </form>

      <InflationResult
        fromMonth={fromMonth}
        fromYear={fromYear}
        toMonth={toMonth}
        toYear={toYear}
        result={result}
        isExploding={isExploding}
      />
    </div>
  );
};

export default InflationCalculator;
