import { useInflation } from "@/context";
import React from "react";

const InflationResult: React.FC = () => {
  const { result } = useInflation();

  return (
    <div className="flex flex-col gap-1 h-32 text-center items-center">
      <p className="text-lg">La inflación acumulada entre fue de:</p>
      <p className="text-2xl text-red-700 bg-red-100 w-fit p-3 rounded-md">
        <strong>{result.toFixed(2)}%</strong>
      </p>
    </div>
  );
};

export default InflationResult;
