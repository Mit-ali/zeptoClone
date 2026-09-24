"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Label } from "./label"

const inputVariants = cva(
  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
  {
    variants: {
      variant: {
        default: "",
        destructive:
          "border-destructive/50 text-destructive placeholder:text-destructive/60 focus-visible:ring-destructive/30 focus-visible:border-destructive",
      },
      inputSize: {
        default: "h-10",
        sm: "h-9 px-3 py-1 text-xs",
        lg: "h-12 px-4 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    },
  }
)

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof inputVariants> & {
    label?: React.ReactNode
    error?: string
    startIcon?: React.ReactNode
    backIcon?: React.ReactNode
    onClickBackIcon?: () => void
  }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      onClickBackIcon,
      inputSize,
      type,
      label,
      error,
      required,
      startIcon,
      backIcon,
      id,
      ...props
    },
    ref
  ) => {
    // Determine variant based on error presence if not explicitly set
    const appliedVariant = error ? "destructive" : variant
    const inputId =
      id ||
      (typeof label === "string"
        ? label.toLowerCase().replace(/\s+/g, "-")
        : undefined)

    return (
      <div className="w-full">
        {label && (
          <Label htmlFor={inputId} required={required}>
            {label}
          </Label>
        )}
        <div className="relative">
          {startIcon && (
            <div className="pointer-events-none absolute top-1/2 left-3 z-10 -translate-y-1/2 text-slate-400">
              {startIcon}
            </div>
          )}
          <input
            id={inputId}
            type={type}
            className={cn(
              inputVariants({ variant: appliedVariant, inputSize, className }),
              startIcon && "pl-10",
              backIcon && "pr-10",
              type === "date" &&
              backIcon &&
              "[&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-8 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
            )}
            ref={ref}
            required={required}
            {...props}
          />
          {backIcon && (
            <div
              onClick={onClickBackIcon}
              className={`absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 ${onClickBackIcon ? "cursor-pointer" : "pointer-events-none"
                }`}
            >
              {backIcon}
            </div>
          )}
        </div>
        {error && (
          <span className="mt-1.5 flex items-center gap-1 text-xs font-medium text-destructive animate-in fade-in-0 slide-in-from-top-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            {error}
          </span>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }
