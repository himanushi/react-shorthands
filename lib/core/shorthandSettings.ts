import { ElementType, ComponentProps } from "react";
import {
  ShorthandSettings,
  ResponsiveValue,
  Breakpoint,
  StyleObject,
  PseudoSelector,
  PseudoStyles,
} from "./types";

// メインの実装
export function shorthandSettings<T extends ElementType = "div">(
  settings: ShorthandSettings<T>,
) {
  const finalSettings: Required<ShorthandSettings<T>> = {
    extend: settings.extend || {},
    shorthands: {
      ...(settings.extend?.shorthands || {}),
      ...(settings.shorthands || {}),
    },
    allowedProps: [
      ...(settings.extend?.allowedProps || []),
      ...(settings.allowedProps || []),
    ],
    breakpoints: {
      ...(settings.extend?.breakpoints || {}),
      ...(settings.breakpoints || {
        xs: 0,
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
        "2xl": 1536,
      }),
    },
    colors: {
      ...(settings.extend?.colors || {}),
      ...(settings.colors || {}),
    },
    pseudoSelectors: {
      ...(settings.extend?.pseudoSelectors || {}),
      ...(settings.pseudoSelectors || {}),
    },
    defaultProps: {
      ...(settings.extend?.defaultProps || {}),
      ...(settings.defaultProps || {}),
    },
    variants: {
      ...(settings.extend?.variants || {}),
      ...(settings.variants || {}),
    },
  };

  function resolveColor(value: string): string {
    return finalSettings.colors[value] || value;
  }

  function processResponsiveValue(
    prop: string,
    value: ResponsiveValue<string | number>,
  ): string {
    if (typeof value === "object") {
      return Object.entries(value)
        .map(([breakpoint, val]) => {
          const minWidth = finalSettings.breakpoints[breakpoint as Breakpoint];
          return `@media (min-width: ${minWidth}px) { ${prop}: ${
            typeof val === "number" ? `${val}px` : resolveColor(String(val))
          }; }`;
        })
        .join(" ");
    }
    return typeof value === "number"
      ? `${value}px`
      : resolveColor(String(value));
  }

  function processShorthand(
    shorthand: StyleObject,
    value: any,
    nestedPseudoSelectors?: boolean,
  ): Record<string, any> {
    const result: Record<string, any> = {};

    Object.entries(shorthand).forEach(([prop, shorthandValue]) => {
      if (prop.startsWith("__") && nestedPseudoSelectors) {
        const selector = finalSettings.pseudoSelectors[prop as PseudoSelector];
        if (selector && typeof shorthandValue === "object") {
          result[selector] = processShorthand(shorthandValue, null, true);
        }
      } else if (
        typeof shorthandValue === "string" &&
        shorthandValue.startsWith("$")
      ) {
        const processedValue =
          typeof value === "string" ? resolveColor(value) : value;
        result[prop] =
          typeof processedValue === "number"
            ? `${processedValue}px`
            : processedValue;
      } else {
        result[prop] = processResponsiveValue(prop, shorthandValue);
      }
    });

    return result;
  }

  function processor(props: Record<string, any>) {
    const output: Record<string, any> = { ...finalSettings.defaultProps };
    const style: Record<string, any> = {};

    // バリアントのデフォルト値を適用
    Object.entries(finalSettings.variants).forEach(([key, variant]) => {
      if (variant.default && !props[key]) {
        Object.assign(
          style,
          processShorthand(variant.values[variant.default], null),
        );
      }
    });

    // プロパティの処理
    Object.entries(props).forEach(([key, value]) => {
      // 許可されたプロパティの処理
      if (
        finalSettings.allowedProps.some((prop) =>
          typeof prop === "string" ? prop === key : prop.test(key),
        )
      ) {
        output[key] = value;
        return;
      }

      // バリアントの処理
      if (finalSettings.variants[key]) {
        const variantValue = finalSettings.variants[key].values[value];
        if (variantValue) {
          Object.assign(style, processShorthand(variantValue, null));
        }
        return;
      }

      // ショートハンドの処理
      if (finalSettings.shorthands[key]) {
        if (value === true) {
          Object.assign(
            style,
            processShorthand(finalSettings.shorthands[key], null),
          );
        } else if (typeof value === "string" || typeof value === "number") {
          Object.assign(
            style,
            processShorthand(finalSettings.shorthands[key], value),
          );
        } else if (typeof value === "object") {
          // レスポンシブ値の処理
          const prop = Object.keys(finalSettings.shorthands[key])[0];
          style[prop] = processResponsiveValue(prop, value);
        }
        return;
      }

      // 疑似セレクタの処理
      if (key.startsWith("__")) {
        const selector = finalSettings.pseudoSelectors[key as PseudoSelector];
        if (selector && typeof value === "object") {
          const pseudoStyles: Record<string, any> = {};
          Object.entries(value).forEach(([pseudoProp, pseudoValue]) => {
            if (finalSettings.shorthands[pseudoProp]) {
              Object.assign(
                pseudoStyles,
                processShorthand(
                  finalSettings.shorthands[pseudoProp],
                  pseudoValue,
                ),
              );
            } else {
              pseudoStyles[pseudoProp] = processResponsiveValue(
                pseudoProp,
                pseudoValue,
              );
            }
          });
          style[selector] = pseudoStyles;
        }
        return;
      }

      // その他のスタイルプロパティの直接指定
      style[key] = processResponsiveValue(key, value);
    });

    if (Object.keys(style).length > 0) {
      output.style = style;
    }

    return output;
  }

  // 型推論のためのプロパティ
  processor.inferProps = {} as ComponentProps<T> &
    Record<keyof typeof finalSettings.shorthands, boolean | string> &
    PseudoStyles &
    Record<keyof typeof finalSettings.variants, string>;

  processor.settings = finalSettings;

  return processor;
}
