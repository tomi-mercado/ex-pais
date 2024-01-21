"use client";

import { useStadistic } from "@/context";
import { generateKeyMonthYear } from "@/lib/utils";
import React from "react";
import CanastaBasicaPastCalculator from "./CanastaBasicaPastCalculator";
import Result from "./Result";
import StadisticCalculator from "./StadisticCalculator";

const calculateCanastaBasicaVariation = (
  inflationPerMonth: Record<string, number>,
  from: { month: number; year: number },
  to: { month: number; year: number }
) => {
  const fromKey = generateKeyMonthYear(from.month, from.year);
  const toKey = generateKeyMonthYear(to.month, to.year);

  const canastaBasicaPerMonthArr = Object.entries(inflationPerMonth);

  const fromValueIndex = canastaBasicaPerMonthArr.findIndex(
    ([key]) => key === fromKey
  );
  const toValueIndex = canastaBasicaPerMonthArr.findIndex(
    ([key]) => key === toKey
  );

  if (fromValueIndex === -1) {
    throw new Error(`No canasta basica data for ${fromKey}`);
  }

  if (toValueIndex === -1) {
    throw new Error(`No canasta basica data for ${toKey}`);
  }

  const fromValue = canastaBasicaPerMonthArr[fromValueIndex][1];
  const toValue = canastaBasicaPerMonthArr[toValueIndex][1];

  return ((toValue - fromValue) / fromValue) * 100;
};

const CanastaBasicaCalculator: React.FC = () => {
  const {
    stadisticPerMonth: canastaBasicaPerMonth,
    fromMonth,
    fromYear,
    toMonth,
    toYear,
  } = useStadistic();
  const result = calculateCanastaBasicaVariation(
    canastaBasicaPerMonth,
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
        label="La canasta básica por adulto aumentó"
        result={`${result.toFixed(2)}%`}
      />
      <CanastaBasicaPastCalculator />
    </StadisticCalculator>
  );
};

export default CanastaBasicaCalculator;
