import { useInflation } from "@/context";
import { addZeroIfNecessary, cn } from "@/lib/utils";
import React, { useState } from "react";
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

const PastCalculator: React.FC = () => {
  const { fromMonth, fromYear, result } = useInflation();

  const [prices, setPrices] = useState({
    from: null,
    actual: null,
  });

  const [collapseOpen, setCollapseOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (value === "" || value === "0") {
      setPrices({
        ...prices,
        [name]: null,
      });
    }

    const numberValue = Number(value);
    const isNumber = !isNaN(numberValue);

    if (!isNumber) {
      return;
    }

    setPrices({
      ...prices,
      [name]: numberValue,
    });
  };

  if (!result) {
    return null;
  }

  return (
    <Collapsible
      open={collapseOpen}
      onOpenChange={setCollapseOpen}
      className="w-full"
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="default"
          size="lg"
          className="flex justify-between gap-4 items-center w-full whitespace-break-spaces text-left"
        >
          <p>¿Querés deprimirte un poco más? 👇</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-4 h-4 transform transition-transform duration-300 ${
              collapseOpen ? "" : "rotate-180"
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
          "p-4 bg-muted rounded-b-md",
          collapseOpen ? "animate-slide-down" : "animate-slide-up"
        )}
      >
        <form className="w-full text-left">
          <Label>Algo que estaba...</Label>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder={`Escribe un precio de ${addZeroIfNecessary(
                fromMonth
              )}/${fromYear}`}
              onChange={handleChange}
              name="from"
              value={prices.from || ""}
              leftDecorator="$"
            />
            <p className="w-full">
              Hoy está
              {!prices.from ? (
                "..."
              ) : (
                <strong>{` ${calculateNewPrice(prices.from, result)}`}</strong>
              )}
            </p>
          </div>

          <Label>Algo que hoy está...</Label>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Escribe un precio actual"
              onChange={handleChange}
              name="actual"
              value={prices.actual || ""}
              leftDecorator="$"
            />
            <p className="w-full">
              En {addZeroIfNecessary(fromMonth)}/{fromYear} estaba
              {!prices.actual ? (
                "..."
              ) : (
                <strong>{` ${calculateOldPrice(
                  prices.actual,
                  result
                )}`}</strong>
              )}
            </p>
          </div>
        </form>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default PastCalculator;
