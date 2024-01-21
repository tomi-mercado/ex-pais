import React from "react";

interface ResultProps {
  label: string;
  result: string;
}

const Result: React.FC<ResultProps> = ({ label, result }) => {
  return (
    <div className="flex flex-col gap-1 h-32 text-center items-center">
      <p className="text-lg">{label}</p>
      <p className="text-2xl text-red-700 bg-red-100 w-fit p-3 rounded-md">
        <strong>{result}</strong>
      </p>
    </div>
  );
};

export default Result;
