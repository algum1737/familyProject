export const TIME_PICKER_BASE_BOTTOM_PADDING = 28;
export const TIME_PICKER_BOTTOM_INSET_GAP = 18;

export function getTimePickerBottomSheetPaddingBottom(bottomInset: number) {
  return Math.max(
    TIME_PICKER_BASE_BOTTOM_PADDING,
    Math.ceil(Math.max(0, bottomInset)) + TIME_PICKER_BOTTOM_INSET_GAP
  );
}

