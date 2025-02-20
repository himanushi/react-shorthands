# react-shorthands

A simple utility to create shorthand props for React components.
CSS-in-JS is great, but it can be verbose. This library allows you to create shorthand props for your components.

# Root Shorthands

```ts
import { shorthandSettings, recommendSettings } from "react-shorthands";

export const shorthands = shorthandSettings({
  margeSettings: recommendSettings,
  shorthands: {
    jCenter: { justifyContent: "center" },
    bg: { backgroundColor: "$1" },
  },
  // allowed dom props
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

// Check the settings
console.log(shorthands.settings);
```

# Box Component

```tsx
import { shorthandSettings } from "react-shorthands";
import { shorthands } from "./shorthands";

const boxShorthands = shorthandSettings({
  margeSettings: shorthands.settings,
  defaultProps: {
    display: "flex",
  },
});

// Check the settings
console.log(boxShorthands.settings);

type BoxProps = typeof boxShorthands.inferProps;

export const Box = ({ as: Component, ...props }: BoxProps) => (
  <Component {...boxShorthands(props)}>Hello, World!</Component>
);

--
import { css } from "react-shorthands";

export const App = () => (
  <Box
    // pseudo selectors
    __hover={{
      bg: "gray-50", // "#f00" or "red" etc.
    }}
    width="100px"
    style={{ padding: "10px" }}
    className={css(`
      color: red;
    `)}
  >
    Hello, World!
  </Box>
);
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
      // nested shorthands
      __hover: { bg: "blue-600" },
      __active: { bg: "blue-700" },
      __disabled: {
        // responsive shorthands
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

// Check the settings
console.log(buttonShorthands.settings);

type ButtonProps = typeof buttonShorthands.inferProps;

export const Button = ({ as: Component, ...props }: ButtonProps) => (
  <Component {...buttonShorthands(props)}>Hello, World!</Component>
);

export const App = () => <Button primary>Click Me!</Button>;
```

# Text Component

```tsx
import { shorthandSettings } from "react-shorthands";
import { shorthands } from "./shorthands";

const textShorthands = shorthandSettings({
  margeSettings: shorthands.settings,
  shorthands: {
    // responsive shorthands
    sizeS: { fontSize: { xs: "0.75rem", md: "1rem" } },
    sizeM: { fontSize: { xs: "1rem", md: "1.25rem" } },
    sizeL: { fontSize: { xs: "1.25rem", md: "1.5rem" } },

    // Component shorthands
    h1: { as: "h1" },
    h2: { as: "h2" },
    h3: { as: "h3" },
    h4: { as: "h4" },
    h5: { as: "h5" },
    h6: { as: "h6" },

    bold: { fontWeight: "bold" },
  },
  groupShorthands: {
    heading: { list: ["h1", "h2", "h3", "h4", "h5", "h6"] },
    size: { list: ["sizeS", "sizeM", "sizeL"], default: "sizeM" },
  },
  defaultProps: {
    as: "p",
  },
});

type TextProps = typeof textShorthands.inferProps;

export const Text = ({ as: Component, ...props }: TextProps) => (
  <Component {...textShorthands(props)}>Hello, World!</Component>
);

export const App = () => (
  <Text h1 bold sizeL>
    Heading 1
  </Text>
);
```
