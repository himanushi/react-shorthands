import "@testing-library/jest-dom";
import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
import { expect as vitestExpect } from "vitest";

vitestExpect.extend(matchers);

afterEach(() => {
  cleanup();
});
