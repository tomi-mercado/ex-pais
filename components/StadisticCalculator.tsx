"use client";

import { useStadistic } from "@/context";
import React from "react";
import MonthYearSelector from "./MonthYearSelector";

const StadisticCalculator: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
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
  } = useStadistic();

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
          label="Entre"
          onChange={handleFromChange}
          defaultMonth={fromMonth}
          defaultYear={fromYear}
          availableYears={fromYears}
          availableMonths={monthsOfFromYear}
        />

        <MonthYearSelector
          label="y"
          onChange={handleToChange}
          defaultMonth={toMonth}
          defaultYear={toYear}
          availableYears={toYears}
          availableMonths={monthsOfToYear}
        />
      </form>

      {children}
    </div>
  );
};

export default StadisticCalculator;
