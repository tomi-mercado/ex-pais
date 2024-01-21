import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const Loading: React.FC = () => {
  return (
    <div className="w-full h-full items-center flex justify-center grow">
      <Skeleton className="h-[300px] w-[630px]" />
    </div>
  );
};

export default Loading;
