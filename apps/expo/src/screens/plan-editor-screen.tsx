import { useEffect, useMemo, useRef, useState } from "react";
import { Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  describeMinuteWithFormat,
  minuteToTimeString,
  normalizeEndMinute,
  timeStringToMinute,
  type TimeDisplayFormat
} from "../../../../src/domains/plans/service/planner";
import type { RescheduleFailureGuidance } from "../../../../src/features/planner/core/reschedule-failure-guidance";
import { PLAN_COLORS } from "../../../../src/ui/planner/planner-colors";
import type {
  ExpoPlanFormErrors,
  ExpoPlanFormField,
  ExpoPlanFormState
} from "../app-shell/use-expo-planner-state";
import { useExpoTheme } from "../app-shell/expo-theme-provider";

type ExpoPlanEditorScreenProps = {
  error: string | null;
  fieldErrors: ExpoPlanFormErrors;
  focusField: ExpoPlanFormField | null;
  focusRequest: number;
  form: ExpoPlanFormState;
  onCancel: () => void;
  onSubmit: () => void;
  onUpdateForm: (values: Partial<ExpoPlanFormState>) => void;
  planTitleMaxLength: number;
  plannedCount: number;
  rescheduleFailureGuidance: RescheduleFailureGuidance | null;
  timeDisplayFormat: TimeDisplayFormat;
  title: string;
};

function parseTimeOrFallback(value: string, fallbackMinute: number) {
  try {
    return timeStringToMinute(value);
  } catch {
    return fallbackMinute;
  }
}

export function ExpoPlanEditorScreen({
  error,
  fieldErrors,
  focusField,
  focusRequest,
  form,
  onCancel,
  onSubmit,
  onUpdateForm,
  planTitleMaxLength,
  plannedCount,
  rescheduleFailureGuidance,
  timeDisplayFormat,
  title
}: ExpoPlanEditorScreenProps) {
  const { theme: expoTheme } = useExpoTheme();
  const TIME_PICKER_OPTION_HEIGHT = 52;
  const TIME_PICKER_SCROLL_OFFSET = 104;
  const titleRef = useRef<TextInput>(null);
  const meridiemScrollRef = useRef<ScrollView>(null);
  const hourScrollRef = useRef<ScrollView>(null);
  const minuteScrollRef = useRef<ScrollView>(null);
  const [isColorOptionsOpen, setIsColorOptionsOpen] = useState(false);
  const [activeTimeField, setActiveTimeField] = useState<"endTime" | "startTime" | null>(null);
  const [pickerMinute, setPickerMinute] = useState(0);
  const selectedColorOption = useMemo(
    () => PLAN_COLORS.find((option) => option.value === form.color) ?? PLAN_COLORS[0],
    [form.color]
  );
  const pickerHour24 = Math.floor(pickerMinute / 60) % 24;
  const pickerMinutePart = pickerMinute % 60;
  const pickerMeridiem = pickerHour24 < 12 ? "오전" : "오후";
  const pickerHour12 = pickerHour24 % 12 === 0 ? 12 : pickerHour24 % 12;
  const pickerTitle = activeTimeField === "startTime" ? "시작 시간" : "종료 시간";
  const hourOptions24 = Array.from({ length: 24 }, (_, index) => index);
  const hourOptions12 = Array.from({ length: 12 }, (_, index) => index + 1);
  const minuteOptions = Array.from({ length: 60 }, (_, index) => index);
  const formStartMinute = parseTimeOrFallback(form.startTime, 8 * 60);
  const formEndMinute = parseTimeOrFallback(form.endTime, 9 * 60);

  const schedulePreviewText = useMemo(() => {
    try {
      const normalizedEndMinute = normalizeEndMinute(formStartMinute, formEndMinute);
      const startText = describeMinuteWithFormat(formStartMinute, timeDisplayFormat);
      const endText = describeMinuteWithFormat(normalizedEndMinute, timeDisplayFormat);

      return normalizedEndMinute >= 24 * 60
        ? `저장 예정: ${startText} - 다음 날 ${endText}`
        : `저장 예정: ${startText} - ${endText}`;
    } catch {
      return null;
    }
  }, [formEndMinute, formStartMinute, timeDisplayFormat]);

  useEffect(() => {
    if (!focusField) {
      return;
    }

    if (focusField === "title") {
      titleRef.current?.focus();
      return;
    }

    openTimePicker(focusField);
  }, [focusField, focusRequest]);

  useEffect(() => {
    if (!activeTimeField) {
      return;
    }

    const scrollToOption = (ref: { current: ScrollView | null }, index: number) => {
      const nextOffset = Math.max(0, index * TIME_PICKER_OPTION_HEIGHT - TIME_PICKER_SCROLL_OFFSET);

      requestAnimationFrame(() => {
        ref.current?.scrollTo({ animated: false, y: nextOffset });
      });
    };

    if (timeDisplayFormat === "12h") {
      scrollToOption(meridiemScrollRef, pickerMeridiem === "오전" ? 0 : 1);
      scrollToOption(hourScrollRef, Math.max(0, pickerHour12 - 1));
    } else {
      scrollToOption(hourScrollRef, pickerHour24);
    }

    scrollToOption(minuteScrollRef, pickerMinutePart);
  }, [
    TIME_PICKER_OPTION_HEIGHT,
    TIME_PICKER_SCROLL_OFFSET,
    activeTimeField,
    pickerHour12,
    pickerHour24,
    pickerMeridiem,
    pickerMinutePart,
    timeDisplayFormat
  ]);

  function openTimePicker(field: "endTime" | "startTime") {
    setPickerMinute(
      parseTimeOrFallback(
        field === "startTime" ? form.startTime : form.endTime,
        field === "startTime" ? 8 * 60 : 9 * 60
      )
    );
    setActiveTimeField(field);
  }

  function closeTimePicker() {
    setActiveTimeField(null);
  }

  function confirmTimePicker() {
    if (!activeTimeField) {
      return;
    }

    onUpdateForm({ [activeTimeField]: minuteToTimeString(pickerMinute) });
    closeTimePicker();
  }

  function updatePickerHour24(nextHour: number) {
    setPickerMinute(nextHour * 60 + pickerMinutePart);
  }

  function updatePickerMinute(nextMinutePart: number) {
    setPickerMinute(pickerHour24 * 60 + nextMinutePart);
  }

  function updatePickerMeridiem(nextMeridiem: "오전" | "오후") {
    const baseHour = pickerHour12 % 12;
    const nextHour24 = nextMeridiem === "오전" ? baseHour : baseHour + 12;

    setPickerMinute(nextHour24 * 60 + pickerMinutePart);
  }

  function updatePickerHour12(nextHour12: number) {
    const normalizedHour = nextHour12 % 12;
    const nextHour24 = pickerMeridiem === "오전" ? normalizedHour : normalizedHour + 12;

    setPickerMinute(nextHour24 * 60 + pickerMinutePart);
  }

  return (
    <SafeAreaView edges={["top"]} style={expoTheme.routeSafeArea}>
      <ScrollView
        contentContainerStyle={expoTheme.routeScrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={expoTheme.routeScroll}
      >
        <View style={expoTheme.surfaceCard}>
          <Text style={expoTheme.sectionTitle}>Plan Editor</Text>
          <Text style={expoTheme.bodyStrong}>{title}</Text>
          <Text style={expoTheme.bodyText}>
            웹 `PlanEditorScreen`의 입력 흐름을 React Native 입력 위젯으로 치환하고,
            저장/검증은 공용 selector와 store 계약을 유지할 예정입니다.
          </Text>
          <Text style={expoTheme.bodyText}>오늘 불러온 계획 수: {plannedCount}</Text>
          <View style={expoTheme.inputStack}>
            <Text style={expoTheme.inputLabel}>제목</Text>
            <TextInput
              maxLength={planTitleMaxLength}
              onChangeText={(value) => onUpdateForm({ title: value })}
              ref={titleRef}
              style={[expoTheme.input, fieldErrors.title ? expoTheme.inputError : null]}
              value={form.title}
            />
            {fieldErrors.title ? (
              <Text style={expoTheme.fieldErrorText}>{fieldErrors.title}</Text>
            ) : null}
          </View>
          <View style={expoTheme.inputStack}>
            <Text style={expoTheme.inputLabel}>시작 시간</Text>
            <Pressable
              onPress={() => openTimePicker("startTime")}
              style={[expoTheme.selectTrigger, fieldErrors.startTime ? expoTheme.inputError : null]}
            >
              <Text style={expoTheme.selectTriggerText}>
                {describeMinuteWithFormat(
                  parseTimeOrFallback(form.startTime, 8 * 60),
                  timeDisplayFormat
                )}
              </Text>
              <Text style={expoTheme.selectTriggerChevron}>▾</Text>
            </Pressable>
            {fieldErrors.startTime ? (
              <Text style={expoTheme.fieldErrorText}>{fieldErrors.startTime}</Text>
            ) : null}
          </View>
          <View style={expoTheme.inputStack}>
            <Text style={expoTheme.inputLabel}>종료 시간</Text>
            <Pressable
              onPress={() => openTimePicker("endTime")}
              style={[expoTheme.selectTrigger, fieldErrors.endTime ? expoTheme.inputError : null]}
            >
              <Text style={expoTheme.selectTriggerText}>
                {describeMinuteWithFormat(
                  parseTimeOrFallback(form.endTime, 9 * 60),
                  timeDisplayFormat
                )}
              </Text>
              <Text style={expoTheme.selectTriggerChevron}>▾</Text>
            </Pressable>
            {fieldErrors.endTime ? (
              <Text style={expoTheme.fieldErrorText}>{fieldErrors.endTime}</Text>
            ) : null}
          </View>
          {schedulePreviewText ? (
            <View style={expoTheme.timePreviewCard}>
              <Text style={expoTheme.timePreviewText}>{schedulePreviewText}</Text>
            </View>
          ) : null}
          <View style={expoTheme.inputStack}>
            <Text style={expoTheme.inputLabel}>색상</Text>
            <View style={expoTheme.selectStack}>
              <Pressable
                onPress={() => setIsColorOptionsOpen((current) => !current)}
                style={expoTheme.selectTrigger}
              >
                <View style={expoTheme.selectTriggerValue}>
                  <View
                    style={[
                      expoTheme.selectColorPreview,
                      { backgroundColor: selectedColorOption.value }
                    ]}
                  />
                  <Text style={expoTheme.selectTriggerText}>{selectedColorOption.label}</Text>
                </View>
                <Text style={expoTheme.selectTriggerChevron}>
                  {isColorOptionsOpen ? "▴" : "▾"}
                </Text>
              </Pressable>
              {isColorOptionsOpen ? (
                <ScrollView
                  nestedScrollEnabled
                  style={expoTheme.selectOptionsPanel}
                  showsVerticalScrollIndicator={false}
                >
                  {PLAN_COLORS.map((colorOption) => {
                    const active = form.color === colorOption.value;

                    return (
                      <Pressable
                        key={colorOption.value}
                        onPress={() => {
                          onUpdateForm({ color: colorOption.value });
                          setIsColorOptionsOpen(false);
                        }}
                        style={[
                          expoTheme.selectOptionRow,
                          active ? expoTheme.selectOptionRowActive : null
                        ]}
                      >
                        <View
                          style={[
                            expoTheme.selectColorPreview,
                            { backgroundColor: colorOption.value }
                          ]}
                        />
                        <Text
                          style={[
                            expoTheme.selectOptionText,
                            active ? expoTheme.selectOptionTextActive : null
                          ]}
                        >
                          {colorOption.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              ) : null}
            </View>
            {isColorOptionsOpen ? <View style={expoTheme.selectOptionsSpacer} /> : null}
          </View>
          <Text style={expoTheme.bodyText}>
            시간은 바텀시트 선택기에서 바로 고를 수 있습니다. 자정을 넘기는 일정도 시작/종료
            시각만 고르면 다음 날 일정으로 자동 처리합니다.
          </Text>
          {error ? (
            <View style={expoTheme.errorBanner}>
              <Text style={expoTheme.bodyTextError}>{error}</Text>
            </View>
          ) : null}
          {rescheduleFailureGuidance ? (
            <View style={expoTheme.warningCard}>
              <Text style={expoTheme.warningCardTitle}>{rescheduleFailureGuidance.title}</Text>
              <Text style={expoTheme.warningCardText}>
                {rescheduleFailureGuidance.description}
              </Text>
            </View>
          ) : null}
          <View style={expoTheme.formActionRow}>
            <Pressable onPress={onCancel} style={expoTheme.secondaryButton}>
              <Text style={expoTheme.secondaryButtonText}>취소</Text>
            </Pressable>
            <Pressable onPress={onSubmit} style={expoTheme.primaryButton}>
              <Text style={expoTheme.primaryButtonText}>저장</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      <Modal
        animationType="slide"
        onRequestClose={closeTimePicker}
        transparent
        visible={activeTimeField !== null}
      >
        <View style={expoTheme.bottomSheetOverlay}>
          <Pressable onPress={closeTimePicker} style={expoTheme.bottomSheetBackdrop} />
          <View style={expoTheme.bottomSheetCard}>
            <View style={expoTheme.bottomSheetHeader}>
              <Text style={expoTheme.sectionTitle}>{pickerTitle}</Text>
              <Text style={expoTheme.bodyText}>
                {describeMinuteWithFormat(pickerMinute, timeDisplayFormat)}
              </Text>
            </View>
            <View style={expoTheme.timePickerColumns}>
              {timeDisplayFormat === "12h" ? (
                <ScrollView
                  contentContainerStyle={expoTheme.timePickerColumnContent}
                  ref={meridiemScrollRef}
                  showsVerticalScrollIndicator={false}
                  style={expoTheme.timePickerColumn}
                >
                  {(["오전", "오후"] as const).map((option) => (
                    <Pressable
                      key={option}
                      onPress={() => updatePickerMeridiem(option)}
                      style={[
                        expoTheme.timePickerOption,
                        pickerMeridiem === option ? expoTheme.timePickerOptionActive : null
                      ]}
                    >
                      <Text
                        style={[
                          expoTheme.timePickerOptionText,
                          pickerMeridiem === option ? expoTheme.timePickerOptionTextActive : null
                        ]}
                      >
                        {option}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              ) : null}
              <ScrollView
                contentContainerStyle={expoTheme.timePickerColumnContent}
                ref={hourScrollRef}
                showsVerticalScrollIndicator={false}
                style={expoTheme.timePickerColumn}
              >
                {(timeDisplayFormat === "12h" ? hourOptions12 : hourOptions24).map((option) => {
                  const active =
                    timeDisplayFormat === "12h" ? pickerHour12 === option : pickerHour24 === option;

                  return (
                    <Pressable
                      key={`hour-${option}`}
                      onPress={() =>
                        timeDisplayFormat === "12h"
                          ? updatePickerHour12(option)
                          : updatePickerHour24(option)
                      }
                      style={[
                        expoTheme.timePickerOption,
                        active ? expoTheme.timePickerOptionActive : null
                      ]}
                    >
                      <Text
                        style={[
                          expoTheme.timePickerOptionText,
                          active ? expoTheme.timePickerOptionTextActive : null
                        ]}
                      >
                        {String(option).padStart(2, "0")}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
              <ScrollView
                contentContainerStyle={expoTheme.timePickerColumnContent}
                ref={minuteScrollRef}
                showsVerticalScrollIndicator={false}
                style={expoTheme.timePickerColumn}
              >
                {minuteOptions.map((option) => (
                  <Pressable
                    key={`minute-${option}`}
                    onPress={() => updatePickerMinute(option)}
                    style={[
                      expoTheme.timePickerOption,
                      pickerMinutePart === option ? expoTheme.timePickerOptionActive : null
                    ]}
                  >
                    <Text
                      style={[
                        expoTheme.timePickerOptionText,
                        pickerMinutePart === option
                          ? expoTheme.timePickerOptionTextActive
                          : null
                      ]}
                    >
                      {String(option).padStart(2, "0")}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
            <View style={expoTheme.formActionRow}>
              <Pressable onPress={closeTimePicker} style={expoTheme.secondaryButton}>
                <Text style={expoTheme.secondaryButtonText}>취소</Text>
              </Pressable>
              <Pressable onPress={confirmTimePicker} style={expoTheme.primaryButton}>
                <Text style={expoTheme.primaryButtonText}>확인</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
