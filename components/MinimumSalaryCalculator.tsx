"use client";

import { useStadistic } from "@/context";
import { generateKeyMonthYear } from "@/lib/utils";
import React from "react";
import MinimumSalaryPastCalculator from "./MinimumSalaryPastCalculator";
import Result from "./Result";
import StadisticCalculator from "./StadisticCalculator";

const calculateMinimumSalaryVariation = (
  minimumSalaryPerMonth: Record<string, number>,
  from: { month: number; year: number },
  to: { month: number; year: number }
) => {
  const fromKey = generateKeyMonthYear(from.month, from.year);
  const toKey = generateKeyMonthYear(to.month, to.year);

  const minimumSalaryPerMonthArr = Object.entries(minimumSalaryPerMonth);

  const fromValueIndex = minimumSalaryPerMonthArr.findIndex(
    ([key]) => key === fromKey
  );
  const toValueIndex = minimumSalaryPerMonthArr.findIndex(
    ([key]) => key === toKey
  );

  if (fromValueIndex === -1) {
    throw new Error(`No canasta basica data for ${fromKey}`);
  }

  if (toValueIndex === -1) {
    throw new Error(`No canasta basica data for ${toKey}`);
  }

  const fromValue = minimumSalaryPerMonthArr[fromValueIndex][1];
  const toValue = minimumSalaryPerMonthArr[toValueIndex][1];

  return ((toValue - fromValue) / fromValue) * 100;
};

const MinimumSalaryCalculator: React.FC = () => {
  const {
    stadisticPerMonth: minimumSalaryPerMonth,
    fromMonth,
    fromYear,
    toMonth,
    toYear,
  } = useStadistic();
  const result = calculateMinimumSalaryVariation(
    minimumSalaryPerMonth,
    {
      month: fromMonth,
      year: fromYear,
    },
    {
      month: toMonth,
      year: toYear,
    }
  );

  return (
    <StadisticCalculator>
      <Result
        label="El salario mínimo vital y móvil mensual aumentó"
        result={`${result.toFixed(2)}%`}
      />
      <MinimumSalaryPastCalculator />
    </StadisticCalculator>
  );
};

export default MinimumSalaryCalculator;
