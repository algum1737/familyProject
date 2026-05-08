export type ObservationPolicyTone = "hold" | "review" | "watch";

export type ObservationPolicyStatus = {
  label: string;
  detail: string;
  tone: ObservationPolicyTone;
};

export type ObservationSummaryItem = {
  label: string;
  value: string;
};

export type ObservationListItem = {
  label: string;
  observedMinuteText: string;
};

export type ReminderObservationLike = {
  currentMinute: number | null;
  id: string;
  occurredAt: string;
  planTitle: string;
  startMinute: number;
  type: "shown" | "dismissed" | "completed";
};

export type RecoveryObservationLike = {
  currentMinute: number | null;
  id: string;
  occurredAt: string;
  planTitle: string;
  type:
    | "reflection_prompt"
    | "end_recovery_prompt"
    | "end_recovery_continue"
    | "reschedule_prompt"
    | "reschedule_unavailable"
    | "followup_scheduled"
    | "followup_soon"
    | "followup_active";
};

function formatObservationWindow(observedAt: string[]) {
  if (observedAt.length === 0) {
    return "아직 관찰 기간이 없습니다.";
  }

  const firstTime = new Date(observedAt[0]);
  const lastTime = new Date(observedAt.at(-1) ?? observedAt[0]);
  const format = (value: Date) =>
    `${String(value.getMonth() + 1).padStart(2, "0")}/${String(value.getDate()).padStart(2, "0")} ${String(value.getHours()).padStart(2, "0")}:${String(value.getMinutes()).padStart(2, "0")}`;

  return `${format(firstTime)} ~ ${format(lastTime)}`;
}

function formatObservedMinuteText(currentMinute: number | null) {
  if (currentMinute === null) {
    return "시간 미확인";
  }

  const hour = Math.floor(currentMinute / 60);
  const minute = currentMinute % 60;

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")} 감지`;
}

function formatMinuteText(minuteValue: number) {
  const hour = Math.floor(minuteValue / 60);
  const minute = minuteValue % 60;

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function getReminderObservationSummaryItems(
  observations: ReminderObservationLike[]
): ObservationSummaryItem[] {
  const shownCount = observations.filter((item) => item.type === "shown").length;
  const dismissedCount = observations.filter((item) => item.type === "dismissed").length;
  const completedCount = observations.filter((item) => item.type === "completed").length;
  const completionRate =
    shownCount === 0 ? "0%" : `${Math.round((completedCount / shownCount) * 100)}%`;
  const dismissRate =
    shownCount === 0 ? "0%" : `${Math.round((dismissedCount / shownCount) * 100)}%`;

  return [
    { label: "표시", value: `${shownCount}회` },
    { label: "닫기", value: `${dismissedCount}회` },
    { label: "완료", value: `${completedCount}회` },
    { label: "닫기 비율", value: dismissRate },
    { label: "완료 전환율", value: completionRate }
  ];
}

export function getReminderObservationPolicyStatus(
  observations: ReminderObservationLike[]
): ObservationPolicyStatus {
  const shownCount = observations.filter((item) => item.type === "shown").length;
  const dismissedCount = observations.filter((item) => item.type === "dismissed").length;
  const completedCount = observations.filter((item) => item.type === "completed").length;
  const dismissRate = shownCount === 0 ? 0 : dismissedCount / shownCount;

  if (shownCount < 3) {
    return {
      detail: "표본이 아직 적습니다. 최소 3회 이상 표시된 뒤 다시 판단하십시오.",
      label: "관찰 더 필요",
      tone: "watch"
    };
  }

  if (dismissedCount > completedCount && dismissRate >= 0.5) {
    return {
      detail: "닫기 비율이 높습니다. 시간 창을 더 늦추거나 배너 표현을 낮출 후보입니다.",
      label: "조정 검토",
      tone: "review"
    };
  }

  return {
    detail: "완료 전환이 닫기보다 유지됩니다. 현재 시간 창은 우선 유지해도 됩니다.",
    label: "우선 유지",
    tone: "hold"
  };
}

export function getReminderObservationHint(observations: ReminderObservationLike[]) {
  const shownCount = observations.filter((item) => item.type === "shown").length;
  const dismissedCount = observations.filter((item) => item.type === "dismissed").length;
  const completedCount = observations.filter((item) => item.type === "completed").length;

  if (shownCount === 0) {
    return "아직 관찰 기록이 없어 정책 판단을 내리기 이릅니다.";
  }

  if (dismissedCount > completedCount && dismissedCount >= 2) {
    return "닫기가 완료보다 많습니다. 현재 시간 창이 이르거나 배너가 거슬릴 가능성을 먼저 보십시오.";
  }

  if (completedCount >= dismissedCount && completedCount >= 2) {
    return "리마인드에서 완료 전환이 유지됩니다. 현재 시간 창은 우선 유지해도 됩니다.";
  }

  return "기록이 더 필요합니다. 표시 후 실제 완료와 닫기 비율을 조금 더 모아 보십시오.";
}

export function getReminderObservationWindowText(observations: ReminderObservationLike[]) {
  return formatObservationWindow(observations.map((item) => item.occurredAt));
}

export function getReminderObservationListItems(
  observations: ReminderObservationLike[]
) {
  return [...observations]
    .reverse()
    .slice(0, 5)
    .map((item) => ({
      ...item,
      label:
        item.type === "shown"
          ? "배너 표시"
          : item.type === "dismissed"
            ? "배너 닫기"
            : "리마인드에서 완료",
      observedMinuteText: formatObservedMinuteText(item.currentMinute),
      timeText: `${formatMinuteText(item.startMinute)} 시작`
    }));
}

export function getRecoveryObservationSummaryItems(
  observations: RecoveryObservationLike[]
): ObservationSummaryItem[] {
  const count = (type: RecoveryObservationLike["type"]) =>
    observations.filter((item) => item.type === type).length;

  return [
    { label: "회고 다시 보기", value: `${count("reflection_prompt")}회` },
    { label: "종료 전 확인", value: `${count("end_recovery_prompt")}회` },
    { label: "계속 진행", value: `${count("end_recovery_continue")}회` },
    { label: "다시 지정 다시 보기", value: `${count("reschedule_prompt")}회` },
    { label: "다시 지정 불가", value: `${count("reschedule_unavailable")}회` },
    { label: "다시 지정됨", value: `${count("followup_scheduled")}회` },
    { label: "다시 지정 곧 시작", value: `${count("followup_soon")}회` },
    { label: "회복 진행 중", value: `${count("followup_active")}회` }
  ];
}

export function getRecoveryObservationWindowText(observations: RecoveryObservationLike[]) {
  return formatObservationWindow(observations.map((item) => item.occurredAt));
}

export function getRecoveryObservationLabel(
  type: RecoveryObservationLike["type"]
) {
  switch (type) {
    case "reflection_prompt":
      return "회고 다시 보기";
    case "end_recovery_prompt":
      return "종료 전 확인";
    case "end_recovery_continue":
      return "계속 진행";
    case "reschedule_prompt":
      return "다시 지정 다시 보기";
    case "reschedule_unavailable":
      return "다시 지정 불가";
    case "followup_scheduled":
      return "다시 지정됨";
    case "followup_soon":
      return "다시 지정 곧 시작";
    default:
      return "회복 진행 중";
  }
}

export function getRecoveryObservationListItems(
  observations: RecoveryObservationLike[]
) {
  return [...observations]
    .reverse()
    .slice(0, 5)
    .map((item) => ({
      ...item,
      label: getRecoveryObservationLabel(item.type),
      observedMinuteText: formatObservedMinuteText(item.currentMinute)
    }));
}

export function getRecoveryObservationPolicyStatus(
  observations: RecoveryObservationLike[]
): ObservationPolicyStatus {
  const count = (type: RecoveryObservationLike["type"]) =>
    observations.filter((item) => item.type === type).length;
  const totalCount = observations.length;

  if (totalCount < 3) {
    return {
      detail: "표본이 아직 적습니다. 재강조가 반복되는지 조금 더 관찰하십시오.",
      label: "관찰 더 필요",
      tone: "watch"
    };
  }

  if (count("reflection_prompt") >= 3 || count("followup_soon") >= 3 || count("reschedule_unavailable") >= 2) {
    return {
      detail: "같은 회복 신호나 다시 지정 실패가 반복됩니다. 노출 시점, 강조 강도, 또는 재지정 정책을 조정할 후보입니다.",
      label: "조정 검토",
      tone: "review"
    };
  }

  if (count("followup_active") > 0 || (count("reschedule_prompt") <= 1 && count("followup_soon") <= 1 && count("followup_scheduled") <= 2)) {
    return {
      detail: "재강조가 회복 흐름을 다시 잡아주는 수준에 머뭅니다. 현재 규칙은 우선 유지해도 됩니다.",
      label: "우선 유지",
      tone: "hold"
    };
  }

  return {
    detail: "재강조가 쌓이고 있지만 아직 과하다고 단정하기는 어렵습니다. 실제 사용 로그를 더 보십시오.",
    label: "관찰 더 필요",
    tone: "watch"
  };
}

export function getRecoveryObservationHint(observations: RecoveryObservationLike[]) {
  const count = (type: RecoveryObservationLike["type"]) =>
    observations.filter((item) => item.type === type).length;

  if (observations.length === 0) {
    return "아직 회복 재강조 기록이 없어 정책 판단을 내리기 이릅니다.";
  }

  if (count("reschedule_unavailable") >= 2) {
    return "연속 빈 시간이 없어 다시 지정이 막히는 경우가 반복됩니다. 자동 축약 허용이나 수동 단축 안내가 필요한지 검토하십시오.";
  }

  if (count("reflection_prompt") >= 2) {
    return "회고 다시 보기가 반복됩니다. 회고 진입을 더 단순하게 하거나 재노출 시점을 늦출지 보십시오.";
  }

  if (count("followup_soon") >= 2) {
    return "임박한 후속 일정 신호가 반복됩니다. 60분 기준이 이른지 먼저 확인하십시오.";
  }

  return "기록이 더 필요합니다. 어떤 재강조가 가장 자주 쌓이는지 조금 더 보십시오.";
}

export function getRecoveryObservationRecommendation(observations: RecoveryObservationLike[]) {
  const count = (type: RecoveryObservationLike["type"]) =>
    observations.filter((item) => item.type === type).length;

  if (count("reschedule_unavailable") >= 2) {
    return "추천: 자동 축약 허용 여부 또는 수동 단축 입력 안내를 먼저 검토하십시오.";
  }

  if (count("reflection_prompt") >= 2) {
    return "추천: 회고 진입을 더 단순하게 하거나 재노출 시점을 늦출지 먼저 검토하십시오.";
  }

  if (count("followup_soon") >= 2) {
    return "추천: `다시 지정 곧 시작` 기준 60분을 더 짧게 줄일지 먼저 검토하십시오.";
  }

  return "추천: 지금은 규칙을 바꾸기보다 실제 사용 로그를 조금 더 모으십시오.";
}
