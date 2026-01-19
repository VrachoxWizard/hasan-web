"use client";

import * as React from "react";
import { useState, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface FloatingInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  error?: string;
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  (
    { className, type, label, icon: Icon, error, id: providedId, ...props },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const generatedId = useId();
    const id = providedId || generatedId;
    const errorId = `${id}-error`;

    const hasValue = props.value !== undefined && props.value !== "";
    const isFloating = isFocused || hasValue;

    return (
      <div className="relative">
        {/* Icon */}
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
            <Icon
              className={cn(
                "w-5 h-5 transition-colors duration-200",
                isFocused ? "text-accent" : "text-muted-foreground",
                error && "text-destructive"
              )}
            />
          </div>
        )}

        {/* Input */}
        <input
          type={type}
          id={id}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          className={cn(
            // Base styles
            "peer w-full h-14 rounded-xl border bg-background text-foreground",
            "text-base transition-all duration-200 outline-none",
            // Padding with/without icon
            Icon ? "pl-12 pr-4 pt-5 pb-2" : "px-4 pt-5 pb-2",
            // Border styles
            "border-input",
            // Focus styles
            "focus:border-accent focus:ring-2 focus:ring-accent/20",
            // Error styles
            error &&
              "border-destructive focus:border-destructive focus:ring-destructive/20",
            // Disabled styles
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          placeholder=" "
          {...props}
        />

        {/* Floating Label */}
        <motion.label
          htmlFor={id}
          initial={false}
          animate={{
            y: isFloating ? -10 : 0,
            scale: isFloating ? 0.85 : 1,
            x: isFloating ? (Icon ? -8 : 0) : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className={cn(
            "absolute pointer-events-none origin-left",
            "transition-colors duration-200",
            Icon ? "left-12" : "left-4",
            "top-1/2 -translate-y-1/2",
            // Color based on state
            isFocused
              ? error
                ? "text-destructive"
                : "text-accent"
              : "text-muted-foreground"
          )}
        >
          {label}
        </motion.label>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.p
              id={errorId}
              role="alert"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-sm text-destructive mt-1.5 ml-1"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

FloatingInput.displayName = "FloatingInput";

export interface FloatingTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  icon?: LucideIcon;
  error?: string;
  showCharCount?: boolean;
  maxLength?: number;
}

const FloatingTextarea = React.forwardRef<
  HTMLTextAreaElement,
  FloatingTextareaProps
>(
  (
    {
      className,
      label,
      icon: Icon,
      error,
      showCharCount = false,
      maxLength = 500,
      id: providedId,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const generatedId = useId();
    const id = providedId || generatedId;
    const errorId = `${id}-error`;

    const value = (props.value as string) || "";
    const hasValue = value.length > 0;
    const isFloating = isFocused || hasValue;
    const charCount = value.length;

    return (
      <div className="relative">
        {/* Icon */}
        {Icon && (
          <div className="absolute left-4 top-5 z-10 pointer-events-none">
            <Icon
              className={cn(
                "w-5 h-5 transition-colors duration-200",
                isFocused ? "text-accent" : "text-muted-foreground",
                error && "text-destructive"
              )}
            />
          </div>
        )}

        {/* Textarea */}
        <textarea
          id={id}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          maxLength={maxLength}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          className={cn(
            // Base styles
            "peer w-full min-h-[180px] rounded-xl border bg-background text-foreground",
            "text-base leading-relaxed transition-all duration-200 outline-none resize-y",
            // Padding with/without icon
            Icon ? "pl-12 pr-4 pt-8 pb-10" : "px-4 pt-8 pb-10",
            // Border styles
            "border-input",
            // Focus styles
            "focus:border-accent focus:ring-2 focus:ring-accent/20",
            // Error styles
            error &&
              "border-destructive focus:border-destructive focus:ring-destructive/20",
            // Disabled styles
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          placeholder=" "
          {...props}
        />

        {/* Floating Label */}
        <motion.label
          htmlFor={id}
          initial={false}
          animate={{
            y: isFloating ? -8 : 8,
            scale: isFloating ? 0.85 : 1,
            x: isFloating ? (Icon ? -8 : 0) : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className={cn(
            "absolute pointer-events-none origin-left",
            "transition-colors duration-200",
            Icon ? "left-12" : "left-4",
            "top-5",
            // Color based on state
            isFocused
              ? error
                ? "text-destructive"
                : "text-accent"
              : "text-muted-foreground"
          )}
        >
          {label}
        </motion.label>

        {/* Character Count */}
        {showCharCount && (
          <div className="absolute bottom-4 right-4 text-sm text-muted-foreground bg-background/80 px-2 py-1 rounded-md">
            <span
              className={cn(
                charCount >= maxLength ? "text-destructive font-medium" : "",
                charCount >= maxLength * 0.9 ? "text-warning" : ""
              )}
            >
              {charCount}
            </span>
            <span className="text-muted-foreground/60">/{maxLength}</span>
          </div>
        )}

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.p
              id={errorId}
              role="alert"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-sm text-destructive mt-1.5 ml-1"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

FloatingTextarea.displayName = "FloatingTextarea";

export { FloatingInput, FloatingTextarea };
