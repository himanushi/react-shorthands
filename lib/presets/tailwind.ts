import { ShorthandSettings } from "../core/types";

export const tailwindcssSettings: ShorthandSettings = {
  shorthands: {
    flex: { display: "flex" },
    grid: { display: "grid" },
    block: { display: "block" },
    hidden: { display: "none" },
    row: { flexDirection: "row" },
    col: { flexDirection: "column" },
    wrap: { flexWrap: "wrap" },
    justifyCenter: { justifyContent: "center" },
    itemsCenter: { alignItems: "center" },
    m: { margin: "$1" },
    p: { padding: "$1" },
    w: { width: "$1" },
    h: { height: "$1" },
    bg: { backgroundColor: "$1" },
    color: { color: "$1" },
    border: { borderWidth: "$1" },
    rounded: { borderRadius: "$1" },
  },
  pseudoSelectors: {
    __hover: ":hover",
    __focus: ":focus",
    __active: ":active",
    __disabled: ":disabled",
  },
  allowedProps: [
    "children",
    "className",
    "style",
    "id",
    "ref",
    /^on/,
    /^aria-/,
    /^data-/,
  ],
};
