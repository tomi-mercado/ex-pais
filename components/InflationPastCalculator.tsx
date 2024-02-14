import { useStadistic } from "@/context";
import { addZeroIfNecessary } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import React from "react";
import DepressorWrapper from "./DepressorWrapper";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const calculateNewPrice = (oldPrice: number, inflation: number) => {
  const percentage = inflation / 100;
  const newPrice = (percentage + 1) * oldPrice;

  return Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(newPrice);
};

const calculateOldPrice = (newPrice: number, inflation: number) => {
  const percentage = inflation / 100;
  const oldPrice = newPrice / (percentage + 1);

  return Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(oldPrice);
};

const getLabelPastToFuture = (fromMonth: number, fromYear: number) => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  if (fromMonth === currentMonth && fromYear === currentYear) {
    return "Algo que hoy cuesta...";
  }

  return `Algo que en ${addZeroIfNecessary(fromMonth)}/${fromYear} costaba...`;
};

const getResultStringPastToFuture = (toMonth: number, toYear: number) => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  if (toMonth === currentMonth && toYear === currentYear) {
    return "Hoy cuesta";
  }

  return `En ${addZeroIfNecessary(toMonth)}/${toYear} costaba`;
};

const getLabelFutureToPast = (toMonth: number, toYear: number) => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  if (toMonth === currentMonth && toYear === currentYear) {
    return "Algo que hoy cuesta...";
  }

  return `Algo que en ${addZeroIfNecessary(toMonth)}/${toYear} costaba...`;
};

const getResultStringFutureToPast = (fromMonth: number, fromYear: number) => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  if (fromMonth === currentMonth && fromYear === currentYear) {
    return "Hoy cuesta";
  }

  return `En ${addZeroIfNecessary(fromMonth)}/${fromYear} costaba`;
};

const InflationPastCalculator: React.FC<{
  result: number;
}> = ({ result }) => {
  const { fromMonth, fromYear, toMonth, toYear } = useStadistic();

  const searchParams = useSearchParams();

  const pastFrom = isNaN(parseFloat(searchParams.get("past-from") || ""))
    ? null
    : parseFloat(searchParams.get("past-from") || "");
  const pastActual = isNaN(parseFloat(searchParams.get("past-actual") || ""))
    ? null
    : parseFloat(searchParams.get("past-actual") || "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newParams = new URLSearchParams(searchParams.toString());

    if (value === "" || value === "0") {
      newParams.delete(`past-${name}`);

      window.history.replaceState(null, "", `?${newParams.toString()}`);
      return;
    }

    const numberValue = Number(value);
    const isNumber = !isNaN(numberValue);
    if (!isNumber) {
      window.history.replaceState(null, "", `?${newParams.toString()}`);
      return;
    }

    newParams.set(`past-${name}`, numberValue.toString());
    window.history.replaceState(null, "", `?${newParams.toString()}`);
  };

  return (
    <DepressorWrapper>
      <form className="w-full text-left flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label>{getLabelPastToFuture(fromMonth, fromYear)}</Label>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder={`Escribe un precio de ${addZeroIfNecessary(
                fromMonth
              )}/${fromYear}`}
              onChange={handleChange}
              name="from"
              value={pastFrom || ""}
              leftDecorator="$"
            />
            <p className="w-full">
              {getResultStringPastToFuture(toMonth, toYear)}
              {!pastFrom ? (
                "..."
              ) : (
                <strong>{` ${calculateNewPrice(pastFrom, result)}`}</strong>
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label>{getLabelFutureToPast(toMonth, toYear)}</Label>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Escribe un precio actual"
              onChange={handleChange}
              name="actual"
              value={pastActual || ""}
              leftDecorator="$"
            />
            <p className="w-full">
              {getResultStringFutureToPast(fromMonth, fromYear)}
              {!pastActual ? (
                "..."
              ) : (
                <strong>{` ${calculateOldPrice(pastActual, result)}`}</strong>
              )}
            </p>
          </div>
        </div>
      </form>
    </DepressorWrapper>
  );
};

export default InflationPastCalculator;
