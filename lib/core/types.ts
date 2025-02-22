import { ComponentProps, ElementType } from "react";

// 型定義
export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;
export type PseudoSelector = `__${string}`;
export type StyleValue = string | number | ResponsiveValue<string | number>;
export type StyleObject = Record<string, StyleValue>;
export type PseudoStyles = Record<PseudoSelector, StyleObject>;

export interface ShorthandSettings<T extends ElementType = "div"> {
  extend?: ShorthandSettings;
  shorthands?: Record<string, StyleObject>;
  allowedProps?: (string | RegExp)[];
  breakpoints?: Record<Breakpoint, number>;
  colors?: Record<string, string>;
  pseudoSelectors?: Record<PseudoSelector, string>;
  defaultProps?: Partial<ComponentProps<T>>;
  variants?: Record<
    string,
    {
      values: Record<string, StyleObject>;
      default?: string;
    }
  >;
}
