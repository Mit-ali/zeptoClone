"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inputVariants = cva(
  "text-md flex w-full rounded-md border border-2 border-input border-transparent bg-black/5 px-4 py-2 ring-offset-background transition-all duration-500 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground hover:bg-black/10 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "focus-visible:border-2 focus-visible:border-primary focus-visible:bg-transparent",
        destructive:
          "bg-red-0 border-red-500 text-red-900 placeholder:text-red-300 hover:bg-red-50 focus-visible:border-red-500 focus-visible:ring-red-500",
      },
      inputSize: {
        default: "h-10",
        sm: "h-9 rounded-md",
        lg: "h-11 rounded-md",
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
          <label
            htmlFor={inputId}
            className="mb-1 block text-sm font-semibold text-slate-700"
          >
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
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
              startIcon && "pl-10", // Add padding if start icon exists
              backIcon && "pr-10", // Add padding if back icon exists
              // Hide default date picker indicator when backIcon is present on a date input
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
              className={`absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 ${
                onClickBackIcon ? "cursor-pointer" : "pointer-events-none"
              }`}
            >
              {backIcon}
            </div>
          )}
        </div>
        {error && (
          <span className="mt-1 block animate-in text-xs font-medium text-red-500 fade-in-0 slide-in-from-top-1">
            {error}
          </span>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }
