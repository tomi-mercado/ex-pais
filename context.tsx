"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { createContext, useContext, useEffect, useRef } from "react";
import { z } from "zod";

interface StadisticContextData {
  stadisticPerMonth: Record<string, number>;
  monthsOfFromYear: number[];
  monthsOfToYear: number[];
  fromYears: number[];
  toYears: number[];
  fromMonth: number;
  fromYear: number;
  toMonth: number;
  toYear: number;
  setFrom: (value: `${number}-${number}`) => void;
  setTo: (value: `${number}-${number}`) => void;
}

interface StadisticProviderProps {
  children: React.ReactNode;
  stadisticPerMonth: Record<string, number>;
}

const StadisticContext = createContext<StadisticContextData | undefined>(
  undefined
);

const getMonthsOfYear = (dates: string[], year: number) =>
  dates
    .filter((key) => parseInt(key.split("-")[1]) === year)
    .map((key) => parseInt(key.split("-")[0]));

const getAvailableYears = (dates: string[]) =>
  Array.from(new Set(dates.map((date) => parseInt(date.split("-")[1])))).sort(
    (a, b) => a - b
  );

interface UseGetUsedDatesArgs {
  defaultValues: {
    from: {
      month: number;
      year: number;
    };
    to: {
      month: number;
      year: number;
    };
  };
  firstDateAvailable: string;
  lastDateAvailable: string;
}

const useGetUsedDates = ({
  defaultValues,
  firstDateAvailable,
  lastDateAvailable,
}: UseGetUsedDatesArgs) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const alreadyFixedParams = useRef(false);

  const dateParamSchema = z
    .string()
    .regex(/^\d{1,2}-\d{4}$/)
    .refine((value) => {
      const month = parseInt(value.split("-")[0]);
      const year = parseInt(value.split("-")[1]);

      const firstDateAvailableMonth = parseInt(
        firstDateAvailable.split("-")[0]
      );
      const firstDateAvailableYear = parseInt(firstDateAvailable.split("-")[1]);

      const firstDateAvailableIsAfter =
        year < firstDateAvailableYear ||
        (year === firstDateAvailableYear && month < firstDateAvailableMonth);

      if (firstDateAvailableIsAfter) {
        return false;
      }

      const lastDateAvailableMonth = parseInt(lastDateAvailable.split("-")[0]);

      const lastDateAvailableYear = parseInt(lastDateAvailable.split("-")[1]);

      const lastDateAvailableIsBefore =
        year > lastDateAvailableYear ||
        (year === lastDateAvailableYear && month > lastDateAvailableMonth);

      if (lastDateAvailableIsBefore) {
        return false;
      }

      return true;
    });

  const fromParam = dateParamSchema.safeParse(searchParams.get("from"));
  const toParam = dateParamSchema.safeParse(searchParams.get("to"));

  const fromMonth = fromParam.success
    ? parseInt(fromParam.data.split("-")[0])
    : defaultValues.from.month;
  const fromYear = fromParam.success
    ? parseInt(fromParam.data.split("-")[1])
    : defaultValues.from.year;

  const toMonth = toParam.success
    ? parseInt(toParam.data.split("-")[0])
    : defaultValues.to.month;
  const toYear = toParam.success
    ? parseInt(toParam.data.split("-")[1])
    : defaultValues.to.year;

  useEffect(() => {
    const somethingNotSuccess = !fromParam.success || !toParam.success;

    if (!somethingNotSuccess || alreadyFixedParams.current) {
      return;
    }

    const newParams = new URLSearchParams(searchParams);

    if (!fromParam.success) {
      newParams.delete("from");
    }

    if (!toParam.success) {
      newParams.delete("to");
    }

    router.replace(`?${newParams.toString()}`);
  }, [
    fromMonth,
    fromParam.success,
    fromYear,
    router,
    searchParams,
    toMonth,
    toParam.success,
    toYear,
  ]);

  return {
    fromMonth,
    fromYear,
    toMonth,
    toYear,
    fromParam: fromParam.success ? fromParam.data : null,
    toParam: toParam.success ? toParam.data : null,
  };
};

export const StadisticProvider: React.FC<StadisticProviderProps> = ({
  children,
  stadisticPerMonth,
}) => {
  const dates = Object.keys(stadisticPerMonth);
  const availableYears = getAvailableYears(dates);

  const firstYear = availableYears[0];
  const firstMonth = getMonthsOfYear(dates, firstYear)[0];

  const lastYear = availableYears[availableYears.length - 1];
  const lastMonth = getMonthsOfYear(dates, lastYear).at(-1) as number;

  const searchParams = useSearchParams();

  const {
    fromMonth = firstMonth,
    fromYear = firstYear,
    toMonth = lastMonth,
    toYear = lastYear,
  } = useGetUsedDates({
    defaultValues: {
      from: {
        month: firstMonth,
        year: firstYear,
      },
      to: {
        month: lastMonth,
        year: lastYear,
      },
    },
    firstDateAvailable: dates[0],
    lastDateAvailable: dates[dates.length - 1],
  });

  const fromYears = availableYears.filter((year) => year <= toYear);
  const toYears = availableYears.filter((year) => year >= fromYear);

  const monthsOfToYear = getMonthsOfYear(dates, toYear).filter(
    (month) => toYear !== fromYear || month >= fromMonth
  );
  const monthsOfFromYear = getMonthsOfYear(dates, fromYear).filter(
    (month) => toYear !== fromYear || month <= toMonth
  );

  const setFrom = (value: `${number}-${number}`) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("from", value.toString());

    window.history.pushState(null, "", `?${newParams.toString()}`);
  };

  const setTo = (value: `${number}-${number}`) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("to", value.toString());

    window.history.pushState(null, "", `?${newParams.toString()}`);
  };

  const contextValue: StadisticContextData = {
    stadisticPerMonth,
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
  };

  return (
    <StadisticContext.Provider value={contextValue}>
      {children}
    </StadisticContext.Provider>
  );
};

export const useStadistic = () => {
  const context = useContext(StadisticContext);
  if (!context) {
    throw new Error("useStadistic must be used within a StadisticProvider");
  }
  return context;
};
