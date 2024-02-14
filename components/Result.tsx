import { cn } from "@/lib/utils";
import React from "react";

interface ResultProps {
  label: string;
  result: string;
  colorBasedOnFirstChar?: boolean;
}

const Result: React.FC<ResultProps> = ({
  label,
  result,
  colorBasedOnFirstChar,
}) => {
  return (
    <div className="flex flex-col gap-1 h-32 text-center items-center">
      <p className="text-lg">{label}</p>
      <p
        className={cn(
          "text-2xl text-red-700 bg-red-100 w-fit p-3 rounded-md",
          colorBasedOnFirstChar &&
            !result.startsWith("-") &&
            "text-green-700 bg-green-100"
        )}
      >
        <strong>{result}</strong>
      </p>
    </div>
  );
};

export default Result;
