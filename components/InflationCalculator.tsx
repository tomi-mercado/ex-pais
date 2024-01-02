"use client";

import { useInflation } from "@/context";
import { generateKeyMonthYear } from "@/lib/utils";
import { differenceInMonths, subMonths } from "date-fns";
import React, { useRef, useState } from "react";
import InflationResult from "./InflationResult";
import MonthYearSelector from "./MonthYearSelector";
import PastCalculator from "./PastCalculator";

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
    <label className="form-control max-w-[300px]">
      <div className="label text-left">
        <span className="label-text">
          Inflación de {missingMonthStr[0].toUpperCase()}
          {missingMonthStr.slice(1)} <br />
          <span className="text-xs">
            La inflación de este mes aún no fue publicada, puedes probar con un
            valor estimado
          </span>
        </span>
      </div>
      <div className="w-full flex items-center gap-2">
        <div className="relative w-full">
          <input
            type="text"
            placeholder={(
              inflationPerMonth[`${toMonth}-${toYear}`] * 100
            ).toFixed(2)}
            className="input input-bordered w-full max-w-xs pr-9"
            onChange={handleChangeNotAvailableMonth}
            value={notAvailableMonth}
          />
          <div className="absolute top-0 right-0 h-full w-8 flex items-center justify-center bg-slate-300">
            %
          </div>
        </div>
      </div>
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
    setFromMonth,
    setFromYear,
    setToMonth,
    setToYear,
    setResult,
    calculateInflation,
  } = useInflation();

  const [isExploding, setIsExploding] = useState(false);

  const isAlreadyExplode = useRef(false);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    try {
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
    setFromMonth(month);
    setFromYear(year);

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
    setToMonth(month);
    setToYear(year);

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
    <div className="flex flex-col gap-6 w-full items-center">
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

        <button className="btn btn-primary" type="submit">
          Calcular
        </button>
      </form>

      <InflationResult isExploding={isExploding} />

      {!isExploding && <PastCalculator />}
    </div>
  );
};

export default InflationCalculator;
