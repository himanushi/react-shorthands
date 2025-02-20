# react-shorthands

# Root Shorthands

```ts
import { shorthandSettings } from "react-shorthands";

export const shorthands = shorthandSettings({
  shorthands: {
    jCenter: { justifyContent: "center" },
  },
  domProps: ["children", "id", "className", "style", /^on/, /^data-/],
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
});
```

# Example Components

```tsx
import { shorthandSettings } from "react-shorthands";
import { shorthands } from "./shorthands";

const boxShorthands = shorthandSettings({
  margeSettings: shorthands.settings,
  shorthands: {
    jEnd: { justifyContent: "end" },
    w: { width: "$1" },
  },
  defaultProps: {
    display: "flex",
    alignItems: "center",
    jCenter: true,
  },
});

type BoxProps = typeof boxShorthands.inferProps;

export const Box = (props: BoxProps) => (
  <div {...shorthands(props)}>Hello, World!</div>
);

export const App = () => <Box jEnd w="100px" />;
```
