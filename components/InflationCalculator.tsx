"use client";

import { useStadistic } from "@/context";
import { generateKeyMonthYear } from "@/lib/utils";
import React from "react";
import InflationPastCalculator from "./InflationPastCalculator";
import Result from "./Result";
import StadisticCalculator from "./StadisticCalculator";

export const calculateInflation = (
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

const InflationCalculator: React.FC = () => {
  const {
    stadisticPerMonth: inflationPerMonth,
    fromMonth,
    fromYear,
    toMonth,
    toYear,
  } = useStadistic();
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

  return (
    <StadisticCalculator>
      <Result
        label="La inflación acumulada entre fue de:"
        result={`${result.toFixed(2)}%`}
      />
      <InflationPastCalculator result={result} />
    </StadisticCalculator>
  );
};

export default InflationCalculator;
