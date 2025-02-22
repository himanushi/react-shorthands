import { ResponsiveValue, Breakpoint } from "./types";

export function resolveColor(
  colors: Record<string, string>,
  value: string,
): string {
  return colors[value] || value;
}

export function processResponsiveValue(
  prop: string,
  value: ResponsiveValue<string | number>,
  breakpoints: Record<Breakpoint, number>,
  colors: Record<string, string>,
): string {
  // nullやundefinedの処理
  if (value === null || value === undefined) {
    return String(value);
  }

  if (typeof value === "object" && value !== null) {
    // ブレイクポイントの順序を保持するための配列
    const breakpointOrder: Breakpoint[] = ["xs", "sm", "md", "lg", "xl", "2xl"];

    // エントリーを順序に従ってソート
    const sortedEntries = Object.entries(value).sort(([a], [b]) => {
      const indexA = breakpointOrder.indexOf(a as Breakpoint);
      const indexB = breakpointOrder.indexOf(b as Breakpoint);
      return indexA - indexB;
    });

    return sortedEntries
      .map(([breakpoint, val]) => {
        const minWidth = breakpoints[breakpoint as Breakpoint];
        return `@media (min-width: ${minWidth}px) { ${prop}: ${
          typeof val === "number"
            ? `${val}px`
            : resolveColor(colors, String(val))
        }; }`;
      })
      .join(" ");
  }

  return typeof value === "number"
    ? `${value}px`
    : resolveColor(colors, String(value));
}
