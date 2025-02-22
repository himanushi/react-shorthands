import { describe, it, expect } from "vitest";
import { resolveColor, processResponsiveValue } from "./styles";
import type { Breakpoint } from "./types";

describe("resolveColor", () => {
  const colors = {
    primary: "#ff0000",
    secondary: "#00ff00",
    dark: "#000000",
    "gradient-1": "linear-gradient(to right, #ff0000, #00ff00)",
    "spacing.1": "8px",
    "with space": "#ffffff",
  };

  it("色トークンが存在する場合、対応する色コードを返す", () => {
    expect(resolveColor(colors, "primary")).toBe("#ff0000");
    expect(resolveColor(colors, "secondary")).toBe("#00ff00");
    expect(resolveColor(colors, "dark")).toBe("#000000");
  });

  it("色トークンが存在しない場合、入力値をそのまま返す", () => {
    expect(resolveColor(colors, "#0000ff")).toBe("#0000ff");
    expect(resolveColor(colors, "blue")).toBe("blue");
    expect(resolveColor(colors, "rgb(0, 0, 255)")).toBe("rgb(0, 0, 255)");
  });

  it("空のカラーマップでも動作する", () => {
    const emptyColors: Record<string, string> = {};
    expect(resolveColor(emptyColors, "primary")).toBe("primary");
    expect(resolveColor(emptyColors, "#ff0000")).toBe("#ff0000");
  });

  it("空文字列を処理する", () => {
    expect(resolveColor(colors, "")).toBe("");
  });

  it("特殊文字を含むカラートークンを処理する", () => {
    expect(resolveColor(colors, "gradient-1")).toBe(
      "linear-gradient(to right, #ff0000, #00ff00)",
    );
    expect(resolveColor(colors, "spacing.1")).toBe("8px");
    expect(resolveColor(colors, "with space")).toBe("#ffffff");
  });

  it("CSSの関数値（gradient等）を正しく処理する", () => {
    expect(resolveColor(colors, "gradient-1")).toBe(
      "linear-gradient(to right, #ff0000, #00ff00)",
    );
  });

  it("ドット記法のカラートークンを処理する", () => {
    expect(resolveColor(colors, "spacing.1")).toBe("8px");
  });

  it("スペースを含むカラートークンを処理する", () => {
    expect(resolveColor(colors, "with space")).toBe("#ffffff");
  });
});

describe("processResponsiveValue", () => {
  const breakpoints: Record<Breakpoint, number> = {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
  };

  const colors = {
    primary: "#ff0000",
    secondary: "#00ff00",
  };

  it("数値を適切にピクセル値に変換する", () => {
    expect(processResponsiveValue("width", 100, breakpoints, colors)).toBe(
      "100px",
    );
    expect(processResponsiveValue("height", 50, breakpoints, colors)).toBe(
      "50px",
    );
  });

  it("文字列値をそのまま使用する", () => {
    expect(processResponsiveValue("width", "100%", breakpoints, colors)).toBe(
      "100%",
    );
    expect(processResponsiveValue("display", "flex", breakpoints, colors)).toBe(
      "flex",
    );
  });

  it("色トークンを正しく解決する", () => {
    expect(
      processResponsiveValue("color", "primary", breakpoints, colors),
    ).toBe("#ff0000");
    expect(
      processResponsiveValue(
        "backgroundColor",
        "secondary",
        breakpoints,
        colors,
      ),
    ).toBe("#00ff00");
  });

  it("レスポンシブ値を適切なメディアクエリに変換する", () => {
    const responsiveValue = {
      xs: 100,
      md: 200,
      lg: "50%",
    };

    const result = processResponsiveValue(
      "width",
      responsiveValue,
      breakpoints,
      colors,
    );

    expect(result).toContain("@media (min-width: 0px) { width: 100px; }");
    expect(result).toContain("@media (min-width: 768px) { width: 200px; }");
    expect(result).toContain("@media (min-width: 1024px) { width: 50%; }");
  });

  it("レスポンシブ値で色トークンを正しく解決する", () => {
    const responsiveValue = {
      xs: "primary",
      md: "secondary",
      lg: "#0000ff",
    };

    const result = processResponsiveValue(
      "color",
      responsiveValue,
      breakpoints,
      colors,
    );

    expect(result).toContain("@media (min-width: 0px) { color: #ff0000; }");
    expect(result).toContain("@media (min-width: 768px) { color: #00ff00; }");
    expect(result).toContain("@media (min-width: 1024px) { color: #0000ff; }");
  });

  it("空のブレイクポイントマップでも動作する", () => {
    const emptyBreakpoints = {} as Record<Breakpoint, number>;
    expect(processResponsiveValue("width", 100, emptyBreakpoints, colors)).toBe(
      "100px",
    );
  });

  it("空のカラーマップでも動作する", () => {
    const emptyColors = {} as Record<string, string>;
    expect(
      processResponsiveValue("color", "primary", breakpoints, emptyColors),
    ).toBe("primary");
  });

  it("空のブレイクポイントマップと空のカラーマップでも動作する", () => {
    const emptyBreakpoints = {} as Record<Breakpoint, number>;
    const emptyColors = {} as Record<string, string>;

    expect(
      processResponsiveValue("width", 100, emptyBreakpoints, emptyColors),
    ).toBe("100px");
    expect(
      processResponsiveValue("color", "#ff0000", emptyBreakpoints, emptyColors),
    ).toBe("#ff0000");

    const responsiveValue = {
      xs: 100,
      md: "primary",
      lg: "50%",
    };
    const result = processResponsiveValue(
      "width",
      responsiveValue,
      emptyBreakpoints,
      emptyColors,
    );

    expect(result).toContain(
      "@media (min-width: undefinedpx) { width: 100px; }",
    );
    expect(result).toContain(
      "@media (min-width: undefinedpx) { width: primary; }",
    );
    expect(result).toContain("@media (min-width: undefinedpx) { width: 50%; }");
  });

  it("無効な値の型を処理する", () => {
    expect(
      processResponsiveValue("width", null as any, breakpoints, colors),
    ).toBe("null");
    expect(
      processResponsiveValue("width", undefined as any, breakpoints, colors),
    ).toBe("undefined");
  });

  it("複数のブレイクポイントを正しい順序で処理する", () => {
    const responsiveValue = {
      lg: "100%",
      xs: "50%",
      md: "75%",
    };

    const result = processResponsiveValue(
      "width",
      responsiveValue,
      breakpoints,
      colors,
    );
    const matches = result.match(/@media.*?{.*?}/g);
    expect(matches?.[0]).toContain("min-width: 0px");
    expect(matches?.[1]).toContain("min-width: 768px");
    expect(matches?.[2]).toContain("min-width: 1024px");
  });

  it("無効なブレイクポイントを無視する", () => {
    const responsiveValue = {
      xs: "50%",
      invalid: "75%",
      lg: "100%",
    } as any;

    const result = processResponsiveValue(
      "width",
      responsiveValue,
      breakpoints,
      colors,
    );
    expect(result).not.toContain("invalid");
  });

  it("単位付きの文字列値を正しく処理する", () => {
    expect(processResponsiveValue("width", "50%", breakpoints, colors)).toBe(
      "50%",
    );
    expect(processResponsiveValue("margin", "2rem", breakpoints, colors)).toBe(
      "2rem",
    );
    expect(processResponsiveValue("padding", "10vh", breakpoints, colors)).toBe(
      "10vh",
    );
  });

  it("CSS関数を含む値を正しく処理する", () => {
    expect(
      processResponsiveValue("transform", "rotate(45deg)", breakpoints, colors),
    ).toBe("rotate(45deg)");
    expect(
      processResponsiveValue(
        "background",
        "linear-gradient(to right, red, blue)",
        breakpoints,
        colors,
      ),
    ).toBe("linear-gradient(to right, red, blue)");
  });

  it("複数のブレイクポイントで同じ値を設定した場合を処理する", () => {
    const value = {
      xs: "100px",
      sm: "100px",
      md: "200px",
    };
    const result = processResponsiveValue("width", value, breakpoints, colors);
    expect(result).toContain("@media (min-width: 0px) { width: 100px; }");
    expect(result).toContain("@media (min-width: 640px) { width: 100px; }");
    expect(result).toContain("@media (min-width: 768px) { width: 200px; }");
  });

  it("数値とパーセンテージが混在するレスポンシブ値を処理する", () => {
    const value = {
      xs: 100,
      sm: "50%",
      md: 200,
    };
    const result = processResponsiveValue("width", value, breakpoints, colors);
    expect(result).toContain("@media (min-width: 0px) { width: 100px; }");
    expect(result).toContain("@media (min-width: 640px) { width: 50%; }");
    expect(result).toContain("@media (min-width: 768px) { width: 200px; }");
  });

  it("カラートークンとそのまま使用する色が混在するレスポンシブ値を処理する", () => {
    const value = {
      xs: "primary",
      sm: "#000000",
      md: "secondary",
    };
    const result = processResponsiveValue("color", value, breakpoints, colors);
    expect(result).toContain("@media (min-width: 0px) { color: #ff0000; }");
    expect(result).toContain("@media (min-width: 640px) { color: #000000; }");
    expect(result).toContain("@media (min-width: 768px) { color: #00ff00; }");
  });

  it("0の値を正しく処理する", () => {
    expect(processResponsiveValue("margin", 0, breakpoints, colors)).toBe(
      "0px",
    );
    expect(processResponsiveValue("padding", "0", breakpoints, colors)).toBe(
      "0",
    );
  });

  it("非常に大きな数値を処理する", () => {
    expect(processResponsiveValue("width", 999999, breakpoints, colors)).toBe(
      "999999px",
    );
  });

  it("負の値を処理する", () => {
    expect(processResponsiveValue("margin", -10, breakpoints, colors)).toBe(
      "-10px",
    );
    expect(processResponsiveValue("margin", "-10px", breakpoints, colors)).toBe(
      "-10px",
    );
  });
});
