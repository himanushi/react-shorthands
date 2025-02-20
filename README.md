# react-shorthands

A simple utility to create shorthand props for React components.
CSS-in-JS is great, but it can be verbose. This library allows you to create shorthand props for your components.

# Usage

```ts
import { shorthandSettings, tailwindcssSettings } from "react-shorthands";

export const shorthands = shorthandSettings({
  extend: tailwindcssSettings,
});
```

```tsx
import { shorthands } from "./shorthands";

type UiProps = typeof shorthands.inferProps;

const Ui = ({ as: Component, ...props }: UiProps) => (
  <Component {...shorthands(props)}>React Shorthands!!</Component>
);
```

```tsx
const App = () => {
  return (
    <Ui
      // Component type
      as="button"
      // TailwindCSS like shorthands
      justifyCenter
      bg="gray-50"
      color="gray-500"
      p="10px"
      m="10px"
      // pseudo selectors
      __hover={{
        bg: "gray-100",
      }}
      __focus={{
        // responsive shorthands
        bg: { xs: "gray-100", md: "gray-200" },
      }}
      // responsive shorthands
      width={{ xs: "100%", md: "50%" }}
      // nested shorthands
      __disabled={{
        bg: "gray-50",
        color: "gray-200",
        __hover: {
          bg: { xs: "gray-100", md: "gray-200" },
        },
      }}
    />
  );
};
```

# Custom Shorthands

```ts
import { shorthandSettings, tailwindcssSettings } from "react-shorthands";

export const shorthands = shorthandSettings({
  extend: tailwindcssSettings,
  shorthands: {
    jCenter: { justifyContent: "center" },
    w: { width: "$1" },
    px: { paddingLeft: "$1", paddingRight: "$1" },
  },
  // allowed dom props
  allowedProps: [
    "children",
    "id",
    "className",
    "style",
    "ref",
    /^on/,
    /^data-/,
  ],
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
  extend: shorthands.settings,
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

// @emotion/css
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
  extend: shorthands.settings,
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
  extend: shorthands.settings,
  shorthands: {
    bold: { fontWeight: "bold" },
  },
  variants: {
    size: {
      values: {
        s: { fontSize: "0.875rem" },
        m: { fontSize: "1rem" },
        l: { fontSize: "1.125rem" },
      },
      default: "m",
    },
    heading: {
      values: {
        h1: { as: "h1", fontSize: { xs: "2rem", md: "2.5rem" } },
        h2: { as: "h2", fontSize: { xs: "1.5rem", md: "2rem" } },
        h3: { as: "h3", fontSize: { xs: "1.25rem", md: "1.75rem" } },
      },
    },
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
  <Text size="l" heading="h1" bold>
    Heading 1
  </Text>
);
```

# Third-party Component Integration

```tsx
import { shorthandSettings } from "react-shorthands";
import { shorthands } from "./shorthands";
import { ComponentProps } from "react";
import TextareaAutosize from "react-textarea-autosize";

const textareaShorthands = shorthandSettings<
  ComponentProps<typeof TextareaAutosize>
>({
  extend: shorthands.settings,
  defaultProps: {
    as: TextareaAutosize,
  },
  allowedProps: [
    "minRows",
    "maxRows",
    "onHeightChange",
    "useCacheForDOMMeasurements",
    "autoFocus",
  ],
});

type TextareaProps = typeof textareaShorthands.inferProps;

export const Textarea = ({ as: Component, ...props }: TextareaProps) => (
  <Component {...textareaShorthands(props)} />
);

export const App = () => {
  const [value, setValue] = React.useState("");
  return (
    <Textarea
      // Style shorthands
      bg="gray-50"
      p="12px"
      borderRadius="4px"
      color="gray-700"
      // Pseudo selectors
      __hover={{
        bg: "gray-100",
      }}
      __focus={{
        bg: "white",
        borderColor: "blue-500",
      }}
      // Responsive styles
      width={{ xs: "100%", md: "400px" }}
      fontSize={{ xs: "14px", md: "16px" }}
      // TextareaAutosize props
      minRows={3}
      maxRows={10}
      // Event handlers
      value={value}
      onChange={(e) => setValue(e.target.value)}
      // Standard HTML attributes
      placeholder="Enter text here..."
    />
  );
};
```
