"use client";

import { useInflation } from "@/context";
import React from "react";
import InflationResult from "./InflationResult";
import MonthYearSelector from "./MonthYearSelector";
import PastCalculator from "./PastCalculator";

const InflationCalculator: React.FC = () => {
  const {
    monthsOfFromYear,
    monthsOfToYear,
    fromYears,
    toYears,
    fromMonth,
    fromYear,
    toMonth,
    toYear,
    setFrom,
    setTo,
  } = useInflation();

  const handleFromChange = (month: number, year: number) => {
    setFrom(`${month}-${year}`);
  };

  const handleToChange = (month: number, year: number) => {
    setTo(`${month}-${year}`);
  };

  return (
    <div className="flex flex-col gap-4 w-full items-center">
      <form className="flex flex-col gap-4 w-full items-center">
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
      </form>

      <InflationResult />

      <PastCalculator />
    </div>
  );
};

export default InflationCalculator;
