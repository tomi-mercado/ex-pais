"use client";

import { useStadistic } from "@/context";
import { addZeroIfNecessary, generateKeyMonthYear } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import React from "react";
import DepressorWrapper from "./DepressorWrapper";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const PRICE_PARAM_KEY = "canasta-basica-price";

const getCanastaBasicaPrice = (searchParams: URLSearchParams) => {
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
  canastaBaicaPerMonth: Record<string, number>
) => {
  const key = generateKeyMonthYear(month, year);
  const stadistic = canastaBaicaPerMonth[key];

  if (!stadistic) {
    throw new Error("Stadistic not found");
  }

  const canastasBasicas = (price / stadistic).toFixed(2);

  return canastasBasicas;
};

const CanastaBasicaPastCalculator: React.FC = () => {
  const { fromMonth, fromYear, toMonth, toYear, stadisticPerMonth } =
    useStadistic();

  const searchParams = useSearchParams();
  const price = getCanastaBasicaPrice(searchParams);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const newParams = new URLSearchParams(searchParams.toString());

    if (value === "" || value === "0") {
      newParams.delete(PRICE_PARAM_KEY);

      window.history.pushState(null, "", `?${newParams.toString()}`);
      return;
    }

    const numberValue = Number(value);
    const isNumber = !isNaN(numberValue);
    if (!isNumber) {
      window.history.pushState(null, "", `?${newParams.toString()}`);
      return;
    }

    newParams.set(PRICE_PARAM_KEY, numberValue.toString());
    window.history.pushState(null, "", `?${newParams.toString()}`);
  };

  return (
    <DepressorWrapper>
      <div className="flex items-end gap-4">
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
          <p>
            en {addZeroIfNecessary(fromMonth)}/{fromYear} equivalían a{" "}
            {calculateAmountOfCanastasBasicasInMonth(
              price || 0,
              fromMonth,
              fromYear,
              stadisticPerMonth
            )}{" "}
            canastas básicas
          </p>
          <p>
            en {addZeroIfNecessary(toMonth)}/{toYear} equivalían a{" "}
            {calculateAmountOfCanastasBasicasInMonth(
              price || 0,
              toMonth,
              toYear,
              stadisticPerMonth
            )}{" "}
            canastas básicas
          </p>
        </div>
      </div>
    </DepressorWrapper>
  );
};

export default CanastaBasicaPastCalculator;
