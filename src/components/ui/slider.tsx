"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

interface SliderProps
  extends Omit<
    React.ComponentProps<typeof SliderPrimitive.Root>,
    "value" | "onValueChange"
  > {
  value?: number[];
  onValueChange?: (value: number[]) => void;
  onValueCommit?: (value: number[]) => void;
}

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  onValueChange,
  onValueCommit,
  ...props
}: SliderProps) {
  // Use internal state for smooth dragging
  const [internalValue, setInternalValue] = React.useState<number[]>(
    value ?? defaultValue ?? [min, max]
  );
  const frameRef = React.useRef<number | null>(null);

  // Sync with external value when it changes (but not during drag)
  const isDragging = React.useRef(false);
  const lastValue = React.useRef(internalValue);

  React.useEffect(() => {
    if (!isDragging.current && value) {
      setInternalValue(value);
      lastValue.current = value;
    }
  }, [value]);

  React.useEffect(
    () => () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    },
    []
  );

  // Throttle external change notifications to avoid jank while dragging
  const emitValueChange = React.useCallback(
    (newValue: number[]) => {
      if (!onValueChange) return;
      lastValue.current = newValue;

      if (frameRef.current) return;

      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;
        onValueChange(lastValue.current);
      });
    },
    [onValueChange]
  );

  const handleValueChange = (newValue: number[]) => {
    isDragging.current = true;
    setInternalValue(newValue);
    emitValueChange(newValue);
  };

  const handleValueCommit = (newValue: number[]) => {
    isDragging.current = false;
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    onValueChange?.(newValue);
    onValueCommit?.(newValue);
  };

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      value={internalValue}
      onValueChange={handleValueChange}
      onValueCommit={handleValueCommit}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col py-2",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "bg-muted relative grow overflow-hidden rounded-full cursor-pointer data-[orientation=horizontal]:h-2 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2"
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "bg-accent absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
          )}
        />
      </SliderPrimitive.Track>
      {internalValue.map((_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className="border-accent block size-5 shrink-0 rounded-full border-2 bg-white shadow-md focus:outline-none focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-grab active:cursor-grabbing transition-transform duration-150 hover:scale-[1.03] active:scale-[0.98]"
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
