"use client";

import { HelpCircleIcon } from "lucide-react";
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const Aclaration: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <Popover>
      <PopoverTrigger>
        <HelpCircleIcon className="w-4 h-4" />
      </PopoverTrigger>
      <PopoverContent className="text-sm p-2">{children}</PopoverContent>
    </Popover>
  );
};

export default Aclaration;
