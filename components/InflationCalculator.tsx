"use client";

import { useInflation } from "@/context";
import { generateKeyMonthYear } from "@/lib/utils";
import { differenceInMonths, subMonths } from "date-fns";
import { useSearchParams } from "next/navigation";
import React, { useRef, useState } from "react";
import InflationResult from "./InflationResult";
import MonthYearSelector from "./MonthYearSelector";
import PastCalculator from "./PastCalculator";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface InflationCalculatorProps {
  defaultValues?: {
    from: {
      month: number;
      year: number;
    };
    to: {
      month: number;
      year: number;
    };
  };
  inflationPerMonth: Record<string, number>;
}

interface ShouldShowInputForNotAvailableMonthArgs {
  monthsOfToYear: number[];
  toMonth: number;
  toYear: number;
  toYears: number[];
}

const shouldShowInputForNotAvailableMonth = ({
  monthsOfToYear,
  toMonth,
  toYear,
  toYears,
}: ShouldShowInputForNotAvailableMonthArgs) => {
  const toYearIsLastYearAvailable = toYear === toYears[toYears.length - 1];
  if (!toYearIsLastYearAvailable) {
    return false;
  }

  const toMonthIsLastMonthAvailable =
    toMonth === monthsOfToYear[monthsOfToYear.length - 1];

  if (!toMonthIsLastMonthAvailable) {
    return false;
  }

  const today = new Date();
  const dateForToMonth = new Date(toYear, toMonth - 1);
  const difference = differenceInMonths(today, dateForToMonth);

  // This feature is disabled if the difference is greater than 2 months
  return difference === 2;
};

const MissingMonthInput: React.FC = () => {
  const [notAvailableMonth, setNotAvailableMonth] = useState("");

  const {
    inflationPerMonth,
    fromMonth,
    fromYear,
    toMonth,
    toYear,
    setResult,
    calculateInflation,
  } = useInflation();

  const missingMonthDate = subMonths(new Date(), 1);
  const missingMonthStr = missingMonthDate.toLocaleDateString("es-AR", {
    month: "long",
  });

  const handleChangeNotAvailableMonth = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;

    const numberValue = value === "" ? 0 : Number(value);
    const isNumber = !isNaN(numberValue);

    if (!isNumber) {
      return;
    }

    setNotAvailableMonth(value);

    const toMonth = missingMonthDate.getMonth() + 1;
    const toYear = missingMonthDate.getFullYear();

    const result = calculateInflation(
      {
        ...inflationPerMonth,
        [generateKeyMonthYear(toMonth, toYear)]: numberValue / 100,
      },
      {
        month: fromMonth,
        year: fromYear,
      },
      {
        month: toMonth,
        year: toYear,
      }
    );

    setResult(result);
  };

  return (
    <label className="form-control max-w-[300px] text-left">
      <Label>
        Inflación de {missingMonthStr[0].toUpperCase()}
        {missingMonthStr.slice(1)} <br />
        <span className="text-xs">
          La inflación de este mes aún no fue publicada, podés probar con un
          valor estimado
        </span>
      </Label>
      <Input
        type="text"
        placeholder={(inflationPerMonth[`${toMonth}-${toYear}`] * 100).toFixed(
          2
        )}
        onChange={handleChangeNotAvailableMonth}
        value={notAvailableMonth}
        rightDecorator="%"
      />
    </label>
  );
};

const InflationCalculator: React.FC = () => {
  const {
    inflationPerMonth,
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
    setResult,
    calculateInflation,
  } = useInflation();

  const [isExploding, setIsExploding] = useState(false);

  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const isAlreadyExplode = useRef(!!from && !!to);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    try {
      setFrom(`${fromMonth}-${fromYear}`);
      setTo(`${toMonth}-${toYear}`);

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

      if (isAlreadyExplode.current) {
        setResult(result);
        return;
      }

      setIsExploding(true);

      setTimeout(() => {
        setIsExploding(false);
        setResult(result);
        isAlreadyExplode.current = true;
      }, 1600);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFromChange = (month: number, year: number) => {
    setFrom(`${month}-${year}`);

    if (isAlreadyExplode.current) {
      const result = calculateInflation(
        inflationPerMonth,
        {
          month,
          year,
        },
        {
          month: toMonth,
          year: toYear,
        }
      );
      setResult(result);
    }
  };

  const handleToChange = (month: number, year: number) => {
    setTo(`${month}-${year}`);

    if (isAlreadyExplode.current) {
      const result = calculateInflation(
        inflationPerMonth,
        {
          month: fromMonth,
          year: fromYear,
        },
        {
          month,
          year,
        }
      );
      setResult(result);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full items-center">
      <form
        className="flex flex-col gap-4 w-full items-center"
        onSubmit={handleSubmit}
      >
        <MonthYearSelector
          onChange={handleFromChange}
          defaultMonth={fromMonth}
          defaultYear={fromYear}
          availableYears={fromYears}
          availableMonths={monthsOfFromYear}
        />

        <MonthYearSelector
          onChange={handleToChange}
          defaultMonth={toMonth}
          defaultYear={toYear}
          availableYears={toYears}
          availableMonths={monthsOfToYear}
        />

        {isAlreadyExplode.current &&
          shouldShowInputForNotAvailableMonth({
            monthsOfToYear,
            toMonth,
            toYear,
            toYears,
          }) && <MissingMonthInput />}

        <Button type="submit">Calcular</Button>
      </form>

      <InflationResult isExploding={isExploding} />

      {!isExploding && <PastCalculator />}
    </div>
  );
};

export default InflationCalculator;
