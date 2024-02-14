"use client";

import { useStadistic } from "@/context";
import { useSearchParams } from "next/navigation";
import React from "react";
import { calculateInflation } from "./InflationCalculator";
import Result from "./Result";
import StadisticCalculator from "./StadisticCalculator";
import { Input } from "./ui/input";

const calculateSalaryVariation = (
  currentSalary: number,
  pastSalary: number
) => {
  if (pastSalary === 0) {
    return 0;
  }

  return currentSalary / pastSalary;
};

const calculateAdquisitivePower = (
  salaryVariation: number,
  inflation: number
) => {
  const inflationFactor = 1 + inflation / 100;
  return (salaryVariation / inflationFactor - 1) * 100;
};

const PAST_SALARY_PARAM_KEY = "past-salary";
const CURRENT_SALARY_PARAM_KEY = "current-salary";

const getSalary = (
  searchParams: URLSearchParams,
  timeframe: "past" | "current"
) => {
  const salaryParam = searchParams.get(
    timeframe === "past" ? PAST_SALARY_PARAM_KEY : CURRENT_SALARY_PARAM_KEY
  );

  if (salaryParam === null || salaryParam === "") {
    return "";
  }

  const salaryParamNumber = Number(salaryParam);

  if (isNaN(salaryParamNumber)) {
    return "";
  }

  return salaryParamNumber;
};

const AdquisitivePowerCalculator: React.FC = () => {
  const {
    stadisticPerMonth: adquisitivePowerPerMonth,
    fromMonth,
    fromYear,
    toMonth,
    toYear,
  } = useStadistic();

  const searchParams = useSearchParams();
  const pastSalary = getSalary(searchParams, "past");
  const currentSalary = getSalary(searchParams, "current");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    const newParams = new URLSearchParams(searchParams.toString());

    if (value === "" || value === "0") {
      newParams.delete(name);

      window.history.replaceState(null, "", `?${newParams.toString()}`);
      return;
    }

    const numberValue = Number(value);
    const isNumber = !isNaN(numberValue);
    if (!isNumber) {
      window.history.replaceState(null, "", `?${newParams.toString()}`);
      return;
    }

    newParams.set(name, numberValue.toString());
    window.history.replaceState(null, "", `?${newParams.toString()}`);
  };

  const inflation = calculateInflation(
    adquisitivePowerPerMonth,
    {
      month: fromMonth,
      year: fromYear,
    },
    {
      month: toMonth,
      year: toYear,
    }
  );

  const salaryVariation = calculateSalaryVariation(
    currentSalary || 0,
    pastSalary || 0
  );

  return (
    <StadisticCalculator>
      <div className="grid grid-cols-2 gap-4 items-center">
        <p>Un sueldo que pasó de</p>
        <Input
          value={pastSalary}
          name={PAST_SALARY_PARAM_KEY}
          onChange={handleChange}
          leftDecorator="$"
          placeholder="50000"
        />
        <p>a</p>
        <Input
          value={currentSalary}
          name={CURRENT_SALARY_PARAM_KEY}
          onChange={handleChange}
          leftDecorator="$"
          placeholder="120000"
        />
      </div>

      <Result
        colorBasedOnFirstChar
        label="La variación del poder adquisitivo fue del:"
        result={`${calculateAdquisitivePower(
          salaryVariation,
          inflation
        ).toFixed(2)}%`}
        aclaration={`Mientras que el sueldo 
        ${
          salaryVariation > 1
            ? "aumentó un "
            : salaryVariation === 1
            ? "se mantuvo igual"
            : "se redujo un "
        }${
          salaryVariation !== 1
            ? `${Math.abs((salaryVariation - 1) * 100).toFixed(2)}%`
            : ""
        }, la inflación fue de ${inflation.toFixed(2)}%`}
      />
    </StadisticCalculator>
  );
};

export default AdquisitivePowerCalculator;
