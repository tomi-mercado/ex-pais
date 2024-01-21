"use client";

import React from "react";
import { FaQuestionCircle } from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const Aclaration: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <FaQuestionCircle />
        </TooltipTrigger>
        <TooltipContent side="bottom">{children}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default Aclaration;
