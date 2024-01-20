import { useInflation } from "@/context";
import { addZeroIfNecessary, cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
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

const PastCalculator: React.FC = () => {
  const { fromMonth, fromYear, result, toMonth, toYear } = useInflation();

  const searchParams = useSearchParams();

  const pastFrom = isNaN(parseFloat(searchParams.get("past-from") || ""))
    ? null
    : parseFloat(searchParams.get("past-from") || "");
  const pastActual = isNaN(parseFloat(searchParams.get("past-actual") || ""))
    ? null
    : parseFloat(searchParams.get("past-actual") || "");

  const collapseState = (!!result && searchParams.get("collapse")) || "close";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newParams = new URLSearchParams(searchParams.toString());

    if (value === "" || value === "0") {
      newParams.delete(`past-${name}`);

      window.history.pushState(null, "", `?${newParams.toString()}`);
      return;
    }

    const numberValue = Number(value);
    const isNumber = !isNaN(numberValue);
    if (!isNumber) {
      window.history.pushState(null, "", `?${newParams.toString()}`);
      return;
    }

    newParams.set(`past-${name}`, numberValue.toString());
    window.history.pushState(null, "", `?${newParams.toString()}`);
  };

  if (!result) {
    return null;
  }

  return (
    <Collapsible
      open={collapseState === "open"}
      onOpenChange={() => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("collapse", collapseState === "open" ? "close" : "open");

        window.history.pushState(null, "", `?${newParams.toString()}`);
      }}
      className="w-full"
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="default"
          size="lg"
          className={cn(
            "flex justify-between gap-4 items-center w-full whitespace-break-spaces text-left",
            collapseState === "open" ? "rounded-b-none" : "rounded-b-md"
          )}
        >
          <p>¿Querés deprimirte un poco más? 👇</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-4 h-4 transform transition-transform duration-300 ${
              collapseState === "open" ? "" : "rotate-180"
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 4a1 1 0 01.707.293l7 7a1 1 0 01-1.414 1.414L10 6.414 4.707 11.707a1 1 0 01-1.414-1.414l7-7A1 1 0 0110 4z"
              clipRule="evenodd"
            />
          </svg>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent
        className={cn(
          "p-4 border border-primary rounded-b-md",
          collapseState === "open" ? "animate-slide-down" : "animate-slide-up"
        )}
      >
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
            <Label>
              {/* Algo que en {addZeroIfNecessary(toMonth)}/{toYear} estaba... */}
              {getLabelFutureToPast(toMonth, toYear)}
            </Label>
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
      </CollapsibleContent>
    </Collapsible>
  );
};

export default PastCalculator;
