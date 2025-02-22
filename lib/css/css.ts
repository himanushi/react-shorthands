import { injectGlobal } from "@emotion/css";

export { css } from "@emotion/css";

export function createGlobalStyle(styles: string): void {
  if (typeof document !== "undefined") {
    injectGlobal(styles);
  }
}
