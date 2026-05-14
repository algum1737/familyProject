import { describe, expect, it } from "vitest";

import {
  getTimePickerBottomSheetPaddingBottom,
  TIME_PICKER_BASE_BOTTOM_PADDING,
  TIME_PICKER_BOTTOM_INSET_GAP
} from "../apps/expo/src/app-shell/expo-time-picker-safe-area";

describe("expo time picker safe area", () => {
  it("keeps the existing bottom padding when there is no navigation inset", () => {
    expect(getTimePickerBottomSheetPaddingBottom(0)).toBe(TIME_PICKER_BASE_BOTTOM_PADDING);
  });

  it("adds breathing room above Android navigation bar insets", () => {
    expect(getTimePickerBottomSheetPaddingBottom(48)).toBe(48 + TIME_PICKER_BOTTOM_INSET_GAP);
  });

  it("normalizes invalid or fractional inset values conservatively", () => {
    expect(getTimePickerBottomSheetPaddingBottom(-12)).toBe(TIME_PICKER_BASE_BOTTOM_PADDING);
    expect(getTimePickerBottomSheetPaddingBottom(10.2)).toBe(11 + TIME_PICKER_BOTTOM_INSET_GAP);
    expect(getTimePickerBottomSheetPaddingBottom(20.2)).toBe(21 + TIME_PICKER_BOTTOM_INSET_GAP);
  });
});
