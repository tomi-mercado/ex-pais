"use client";

import { useInflation } from "@/context";
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

const InflationCalculator: React.FC<InflationCalculatorProps> = ({
  inflationPerMonth,
}) => {
  const {
    monthsOfFromYear,
    monthsOfToYear,
    fromYears,
    toYears,
    fromMonth,
    fromYear,
    toMonth,
    toYear,
    setFromMonth,
    setFromYear,
    setToMonth,
    setToYear,
    setResult,
    calculateInflation,
  } = useInflation();

  const [isExploding, setIsExploding] = useState(false);

  const isAlreadyExplode = useRef(false);

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

      <InflationResult isExploding={isExploding} />
    </div>
  );
};

export default InflationCalculator;
