import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  leftDecorator?: React.ReactNode;
  rightDecorator?: React.ReactNode;
  wrapperClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      leftDecorator,
      rightDecorator,
      wrapperClassName,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={cn("relative w-full", className, wrapperClassName)}
        ref={ref}
      >
        {leftDecorator && (
          <div className="absolute top-0 left-0 h-full w-8 flex items-center justify-center bg-secondary">
            {leftDecorator}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            leftDecorator && "pl-9",
            rightDecorator && "pr-9",
            className
          )}
          {...props}
        />
        {rightDecorator && (
          <div className="absolute top-0 right-0 h-full w-8 flex items-center justify-center bg-secondary">
            {rightDecorator}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
