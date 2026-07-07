'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';

interface SliderProps {
  value: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  disabled?: boolean;
}

export function Slider({ value, onValueChange, min = 0, max = 100, step = 1, className, disabled }: SliderProps) {
  const [internalValue, setInternalValue] = React.useState(value);
  const percentage = ((internalValue[0] - min) / (max - min)) * 100;

  return (
    <div className={cn('relative flex w-full touch-none select-none items-center', className)}>
      <div className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
        <div className="absolute h-full bg-primary" style={{ width: `${percentage}%` }} />
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={internalValue[0]}
        disabled={disabled}
        onChange={e => {
          const v = [Number(e.target.value)];
          setInternalValue(v);
          onValueChange?.(v);
        }}
        className="absolute inset-0 w-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />
      <div className="absolute h-5 w-5 rounded-full border-2 border-primary bg-background shadow-md pointer-events-none transition-transform"
        style={{ left: `calc(${percentage}% - 10px)` }}
      />
    </div>
  );
}