# react-shorthands

# Root Shorthands

```ts
import { shorthandSettings } from "react-shorthands";

export const shorthands = shorthandSettings({
  shorthands: {
    jCenter: { justifyContent: "center" },
    bg: { backgroundColor: "$1" },
  },
  domProps: ["children", "id", "className", "style", "ref", /^on/, /^data-/],
  // @media (width >= xx) { ... }
  breakpoints: {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
  },
  colors: {
    "slate-5": "oklch(0.984 0.003 247.858)",
    "slate-50": "oklch(0.554 0.046 257.417)",
    "slate-95": "oklch(0.129 0.042 264.695)",
    "gray-5": "oklch(0.985 0.002 247.839)",
    "gray-50": "oklch(0.551 0.027 264.364)",
    "gray-95": "oklch(0.13 0.028 261.692)",
  },
  pseudoSelectors: {
    __hover: ":hover",
    __focus: ":focus",
    __active: ":active",
    __disabled: ":disabled",
    __checked: ":checked",
    __before: "::before",
    __after: "::after",
  },
  defaultProps: {
    as: "div",
  },
});
```

# Box Component

```tsx
import { shorthandSettings } from "react-shorthands";
import { shorthands } from "./shorthands";

const boxShorthands = shorthandSettings({
  margeSettings: shorthands.settings,
  shorthands: {
    jEnd: { justifyContent: "end" },
    // $1 is the value of the prop
    w: { width: "$1" },
  },
  defaultProps: {
    display: "flex",
    jCenter: true,
  },
});

type BoxProps = typeof boxShorthands.inferProps;

export const Box = ({ as: Component, ...props }: BoxProps) => (
  <Component {...boxShorthands(props)}>Hello, World!</Component>
);

export const App = () => <Box jEnd w="100px" />;
```

# Button Component

```tsx
import { shorthandSettings } from "react-shorthands";
import { shorthands } from "./shorthands";

const buttonShorthands = shorthandSettings({
  margeSettings: shorthands.settings,
  shorthands: {
    primary: {
      color: "white",
      bg: "blue-500",
      __hover: { bg: "blue-600" },
      __active: { bg: "blue-700" },
      __disabled: {
        __hover: { bg: "blue-500" },
        __active: { bg: "blue-500" },
      },
    },
  },
  defaultProps: {
    display: "flex",
    jCenter: true,
  },
});

type ButtonProps = typeof buttonShorthands.inferProps;

export const Button = ({ as: Component, ...props }: ButtonProps) => (
  <Component {...buttonShorthands(props)}>Hello, World!</Component>
);

export const App = () => <Button primary>Click Me!</Button>;
```
