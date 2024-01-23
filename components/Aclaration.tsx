"use client";

import React from "react";
import { FaQuestionCircle } from "react-icons/fa";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const Aclaration: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <Popover>
      <PopoverTrigger>
        <FaQuestionCircle />
      </PopoverTrigger>
      <PopoverContent>{children}</PopoverContent>
    </Popover>
  );
};

export default Aclaration;
