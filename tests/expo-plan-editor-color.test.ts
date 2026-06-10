import { describe, expect, it } from "vitest";

import { defaultExpoPlanFormState } from "../apps/expo/src/app-shell/use-expo-planner-state";
import { PLAN_COLORS } from "../src/ui/planner/planner-colors";

describe("expo plan editor color defaults", () => {
  it("uses a palette color as the default editor color", () => {
    expect(defaultExpoPlanFormState.color).toBe(PLAN_COLORS[0].value);
    expect(PLAN_COLORS.some((colorOption) => colorOption.value === defaultExpoPlanFormState.color))
      .toBe(true);
  });
});
