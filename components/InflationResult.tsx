import { useInflation } from "@/context";
import Image from "next/image";
import React from "react";

interface InflationResultProps {
  isExploding: boolean;
}

const InflationResult: React.FC<InflationResultProps> = ({ isExploding }) => {
  const { result } = useInflation();

  return (
    <>
      {!!result ? (
        <div className="flex flex-col gap-1 h-32 text-center items-center">
          <p className="text-lg">La inflación acumulada entre fue de:</p>
          <p className="text-2xl text-red-700 bg-red-100 w-fit p-3 rounded-md">
            <strong>{result.toFixed(2)}%</strong>
          </p>
        </div>
      ) : (
        <div className="relative h-32 w-32 flex items-center justify-center">
          {!isExploding && <p className="text-8xl">🇦🇷</p>}

          <Image
            priority
            src="/explosion.gif"
            alt="Explosion"
            style={{
              zIndex: 1,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: isExploding ? "block" : "none",
            }}
            layout="fill"
          />
        </div>
      )}
    </>
  );
};

export default InflationResult;
