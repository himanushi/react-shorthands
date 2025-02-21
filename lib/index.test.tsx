import { describe, it, expect, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { shorthandSettings, tailwindcssSettings, css, Global } from ".";

describe("shorthandSettings", () => {
  describe("基本機能", () => {
    it("デフォルトの設定で初期化できる", () => {
      const shorthands = shorthandSettings({});
      expect(shorthands).toBeDefined();
      expect(typeof shorthands).toBe("function");
    });

    it("カスタム設定で初期化できる", () => {
      const settings = {
        shorthands: {
          customProp: { color: "red" },
        },
      };
      const shorthands = shorthandSettings(settings);
      expect(shorthands.settings.shorthands.customProp).toBeDefined();
    });
  });

  describe("スタイル処理", () => {
    it("基本的なスタイルプロパティを処理する", () => {
      const shorthands = shorthandSettings({
        shorthands: {
          primary: { color: "blue", backgroundColor: "white" },
        },
      });
      const result = shorthands({ primary: true });
      expect(result.style).toEqual({
        color: "blue",
        backgroundColor: "white",
      });
    });

    it("数値を適切にピクセル値に変換する", () => {
      const shorthands = shorthandSettings({
        shorthands: {
          pad: { padding: 10 },
        },
      });
      const result = shorthands({ pad: true });
      expect(result.style.padding).toBe("10px");
    });

    it("カラートークンを処理する", () => {
      const shorthands = shorthandSettings({
        colors: {
          primary: "#ff0000",
        },
        shorthands: {
          bg: { backgroundColor: "$1" },
        },
      });
      const result = shorthands({ bg: "primary" });
      expect(result.style.backgroundColor).toBe("#ff0000");
    });
  });

  describe("レスポンシブ機能", () => {
    it("ブレイクポイントに基づくメディアクエリを生成する", () => {
      const shorthands = shorthandSettings({
        breakpoints: {
          xs: 0,
          sm: 640,
          md: 768,
        },
        shorthands: {
          w: { width: "$1" },
        },
      });

      const result = shorthands({
        w: { xs: "100%", md: "50%" },
      });
      expect(result.style.width).toContain(
        "@media (min-width: 0px) { width: 100%; }",
      );
      expect(result.style.width).toContain(
        "@media (min-width: 768px) { width: 50%; }",
      );
    });
  });

  describe("疑似セレクタ", () => {
    it("疑似セレクタスタイルを処理する", () => {
      const shorthands = shorthandSettings({
        pseudoSelectors: {
          __hover: ":hover",
          __focus: ":focus",
        },
      });
      const result = shorthands({
        __hover: { color: "red" },
        __focus: { color: "blue" },
      });

      expect(result.style[":hover"]).toEqual({ color: "red" });
      expect(result.style[":focus"]).toEqual({ color: "blue" });
    });
  });

  describe("バリアント", () => {
    it("バリアントを適切に処理する", () => {
      const shorthands = shorthandSettings({
        variants: {
          size: {
            values: {
              sm: { fontSize: "14px" },
              md: { fontSize: "16px" },
            },
            default: "md",
          },
        },
      });
      const result = shorthands({ size: "sm" });
      expect(result.style.fontSize).toBe("14px");
    });

    it("デフォルトのバリアント値を適用する", () => {
      const shorthands = shorthandSettings({
        variants: {
          size: {
            values: {
              sm: { fontSize: "14px" },
              md: { fontSize: "16px" },
            },
            default: "md",
          },
        },
      });
      const result = shorthands({});
      expect(result.style.fontSize).toBe("16px");
    });
  });
});

describe("tailwindcssSettings", () => {
  it("TailwindCSSの設定が正しく定義されている", () => {
    expect(tailwindcssSettings).toBeDefined();
    expect(tailwindcssSettings.shorthands).toBeDefined();
    expect(tailwindcssSettings.pseudoSelectors).toBeDefined();
  });

  it("基本的なTailwindショートハンドが機能する", () => {
    const shorthands = shorthandSettings({
      extend: tailwindcssSettings,
    });
    const result = shorthands({
      flex: true,
      justifyCenter: true,
      p: "4",
    });
    expect(result.style).toMatchObject({
      display: "flex",
      justifyContent: "center",
      padding: "4",
    });
  });
});

describe("css機能", () => {
  it("テンプレートリテラルを処理する", () => {
    const color = "red";
    const result = css`
      color: ${color};
      padding: 10px;
    `;
    expect(typeof result).toBe("string");
    expect(result).toMatch(/^css-[a-zA-Z0-9]+$/);

    const styleElement = document.head.querySelector("style");
    expect(styleElement?.textContent).toContain("color:red");
    expect(styleElement?.textContent).toContain("padding:10px");
  });
});

describe("Globalコンポーネント", () => {
  afterEach(() => {
    document.head.querySelectorAll("style").forEach((el) => el.remove());
  });

  it("グローバルスタイルをDOMに注入する", () => {
    const styles = css`
      body {
        margin: 0;
      }
      .test {
        color: red;
      }
    `;

    render(<Global styles={styles} />);

    const styleElements = document.head.querySelectorAll("style");
    expect(styleElements.length).toBeGreaterThan(0);

    const allStyles = Array.from(styleElements)
      .map((el) => el.textContent)
      .join("");

    expect(allStyles).toContain("{margin:0;}");
    expect(allStyles).toContain("{color:red;}");
  });
});

// 統合テスト
describe("統合テスト", () => {
  it("複雑なコンポーネントスタイリングを処理できる", () => {
    const shorthands = shorthandSettings({
      extend: tailwindcssSettings,
      colors: {
        primary: "#007bff",
        secondary: "#6c757d",
      },
      variants: {
        size: {
          values: {
            sm: { padding: "0.5rem", fontSize: "0.875rem" },
            lg: { padding: "1rem", fontSize: "1.25rem" },
          },
        },
      },
    });

    const result = shorthands({
      flex: true,
      justifyCenter: true,
      bg: "primary",
      size: "lg",
      __hover: {
        bg: "secondary",
      },
      width: { xs: "100%", md: "50%" },
    });

    expect(result.style).toMatchObject({
      display: "flex",
      justifyContent: "center",
      backgroundColor: "#007bff",
      padding: "1rem",
      fontSize: "1.25rem",
    });
    expect(result.style[":hover"]).toMatchObject({
      backgroundColor: "#6c757d",
    });
    expect(result.style.width).toContain("@media");
  });
});
