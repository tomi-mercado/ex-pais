"use client";

import React, { useState } from "react";

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

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSelectedMonth = parseInt(event.target.value);
    setSelectedMonth(newSelectedMonth);
    onChange(newSelectedMonth, selectedYear);
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSelectedYear = parseInt(event.target.value);
    setSelectedYear(newSelectedYear);
    onChange(selectedMonth, newSelectedYear);
  };

  const defaultYears = Array.from(
    { length: 10 },
    (_, index) => currentDate.getFullYear() - 5 + index
  );
  const years = availableYears || defaultYears;

  const defaultMonths = Array.from({ length: 12 }, (_, index) => index + 1);
  const months = availableMonths || defaultMonths;

  return (
    <div className="grid grid-cols-[2fr,1fr] gap-2">
      <select
        className="select select-bordered"
        value={selectedMonth}
        onChange={handleMonthChange}
      >
        {months.map((month) => {
          let dateStr = new Date(0, month - 1).toLocaleString("es-ES", {
            month: "long",
          });
          dateStr = dateStr[0].toUpperCase() + dateStr.slice(1);

          return (
            <option key={month} value={month}>
              {dateStr}
            </option>
          );
        })}
      </select>
      <select
        className="select select-bordered"
        value={selectedYear}
        onChange={handleYearChange}
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MonthYearSelector;
