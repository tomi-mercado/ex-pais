import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

const DepressorWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const searchParams = useSearchParams();
  const collapseState = searchParams.get("collapse") || "close";

  return (
    <Collapsible
      open={collapseState === "open"}
      onOpenChange={() => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("collapse", collapseState === "open" ? "close" : "open");

        window.history.pushState(null, "", `?${newParams.toString()}`);
      }}
      className="w-full"
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="default"
          size="lg"
          className={cn(
            "flex justify-between gap-4 items-center w-full whitespace-break-spaces text-left",
            collapseState === "open" ? "rounded-b-none" : "rounded-b-md"
          )}
        >
          <p>¿Querés deprimirte un poco más? 👇</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-4 h-4 transform transition-transform duration-300 ${
              collapseState === "open" ? "" : "rotate-180"
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 4a1 1 0 01.707.293l7 7a1 1 0 01-1.414 1.414L10 6.414 4.707 11.707a1 1 0 01-1.414-1.414l7-7A1 1 0 0110 4z"
              clipRule="evenodd"
            />
          </svg>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent
        className={cn(
          "p-4 border border-primary rounded-b-md",
          collapseState === "open" ? "animate-slide-down" : "animate-slide-up"
        )}
      >
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default DepressorWrapper;
