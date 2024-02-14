"use client";

import { useStadistic } from "@/context";
import { addZeroIfNecessary, generateKeyMonthYear } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import React from "react";
import DepressorWrapper from "./DepressorWrapper";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const PRICE_PARAM_KEY = "minimum-salary-price";

const getMinimumSalaryPrice = (searchParams: URLSearchParams) => {
  const priceParam = searchParams.get(PRICE_PARAM_KEY);

  if (priceParam === null || priceParam === "") {
    return "";
  }

  const priceParamNumber = Number(priceParam);

  if (isNaN(priceParamNumber)) {
    return "";
  }

  return priceParamNumber;
};

const calculateAmountOfCanastasBasicasInMonth = (
  price: number,
  month: number,
  year: number,
  minumumSalaryPerMonth: Record<string, number>
) => {
  const key = generateKeyMonthYear(month, year);
  const stadistic = minumumSalaryPerMonth[key];

  if (!stadistic) {
    throw new Error("Stadistic not found");
  }

  const minimumSalaries = (price / stadistic).toFixed(2);

  return minimumSalaries;
};

const MinimumSalaryPastCalculator: React.FC = () => {
  const { fromMonth, fromYear, toMonth, toYear, stadisticPerMonth } =
    useStadistic();

  const searchParams = useSearchParams();
  const price = getMinimumSalaryPrice(searchParams);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const newParams = new URLSearchParams(searchParams.toString());

    if (value === "" || value === "0") {
      newParams.delete(PRICE_PARAM_KEY);

      window.history.replaceState(null, "", `?${newParams.toString()}`);
      return;
    }

    const numberValue = Number(value);
    const isNumber = !isNaN(numberValue);
    if (!isNumber) {
      window.history.replaceState(null, "", `?${newParams.toString()}`);
      return;
    }

    newParams.set(PRICE_PARAM_KEY, numberValue.toString());
    window.history.replaceState(null, "", `?${newParams.toString()}`);
  };

  return (
    <DepressorWrapper>
      <div className="flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex flex-col gap-2 text-left">
          <Label>Ingresa un precio</Label>
          <Input
            leftDecorator="$"
            placeholder="300"
            value={price}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col">
          <p className="text-left">
            en {addZeroIfNecessary(fromMonth)}/{fromYear} equivalían a{" "}
            {calculateAmountOfCanastasBasicasInMonth(
              price || 0,
              fromMonth,
              fromYear,
              stadisticPerMonth
            )}{" "}
            salarios mínimos
          </p>
          <p className="text-left">
            en {addZeroIfNecessary(toMonth)}/{toYear} equivalían a{" "}
            {calculateAmountOfCanastasBasicasInMonth(
              price || 0,
              toMonth,
              toYear,
              stadisticPerMonth
            )}{" "}
            salarios mínimos
          </p>
        </div>
      </div>
    </DepressorWrapper>
  );
};

export default MinimumSalaryPastCalculator;
