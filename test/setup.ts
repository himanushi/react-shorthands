import "@testing-library/jest-dom";
import * as matchers from "@testing-library/jest-dom/matchers";
import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { afterEach, type expect } from "vitest";
import { expect as vitestExpect } from "vitest";

declare module "vitest" {
  interface Assertion<T = any>
    extends TestingLibraryMatchers<typeof expect.stringContaining, T> {}
}

vitestExpect.extend(matchers);

afterEach(() => {
  cleanup();
});
