"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface MonthYearSelectorProps {
  onChange: (selectedMonth: number, selectedYear: number) => void;
  defaultMonth?: number;
  defaultYear?: number;
  availableYears?: number[];
  availableMonths?: number[];
}

const MonthYearSelector: React.FC<MonthYearSelectorProps> = ({
  onChange,
  defaultMonth,
  defaultYear,
  availableYears,
  availableMonths,
}) => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    defaultMonth || currentDate.getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState(
    defaultYear || currentDate.getFullYear()
  );

  const handleMonthChange = (value: string) => {
    const newSelectedMonth = parseInt(value);
    setSelectedMonth(newSelectedMonth);
    onChange(newSelectedMonth, selectedYear);
  };

  const handleYearChange = (newSelectedYear: string) => {
    const newYear = parseInt(newSelectedYear);
    setSelectedYear(newYear);
    onChange(selectedMonth, newYear);
  };

  const defaultYears = Array.from(
    { length: 10 },
    (_, index) => currentDate.getFullYear() - 5 + index
  );
  const years = availableYears || defaultYears;

  const defaultMonths = Array.from({ length: 12 }, (_, index) => index + 1);
  const months = availableMonths || defaultMonths;

  const defaultMonthStr = new Date(0, selectedMonth - 1).toLocaleString(
    "es-ES",
    {
      month: "long",
    }
  );

  return (
    <div className="grid grid-cols-[3fr,2fr] gap-2">
      <Select onValueChange={handleMonthChange}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder={defaultMonthStr} />
        </SelectTrigger>
        <SelectContent>
          {months.map((month) => {
            let dateStr = new Date(0, month - 1).toLocaleString("es-ES", {
              month: "long",
            });
            dateStr = dateStr[0].toUpperCase() + dateStr.slice(1);

            return (
              <SelectItem key={month} value={`${month}`}>
                {dateStr}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      <Select onValueChange={handleYearChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={defaultYear} />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={`${year}`}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default MonthYearSelector;
