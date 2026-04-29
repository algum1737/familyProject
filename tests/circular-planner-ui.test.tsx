// @vitest-environment jsdom

import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";

import type { DailyPlan } from "@/domains/plans/types";
import { LABEL_SETTINGS_STORAGE_KEY } from "@/providers/labels/local-planner-label-settings";
import { localPlansStore, STORAGE_KEY } from "@/providers/plans/local-plans";
import { RECOVERY_HIGHLIGHT_OBSERVATIONS_KEY } from "@/providers/recovery/recovery-highlight-observation-store";
import {
  REMINDER_OBSERVATIONS_KEY,
  type ReminderObservation
} from "@/providers/reminders/reminder-observation-store";
import { PlannerShell } from "@/ui/planner/planner-shell";

const basePlans: DailyPlan[] = [
  {
    id: "sleep",
    title: "취침",
    color: "#767676",
    startMinute: 0,
    endMinute: 300,
    rescheduleCount: 0,
    status: "pending"
  },
  {
    id: "study",
    title: "영어 공부",
    color: "#ef8d75",
    startMinute: 300,
    endMinute: 360,
    rescheduleCount: 0,
    status: "pending"
  }
];

const fixedTimeSource = {
  now: () => new Date("2026-04-24T05:30:00+09:00")
};

const reminderTimeSource = {
  now: () => new Date("2026-04-24T05:05:00+09:00")
};

const earlyReminderTimeSource = {
  now: () => new Date("2026-04-24T04:56:00+09:00")
};

const rescheduleSoonTimeSource = {
  now: () => new Date("2026-04-24T09:30:00+09:00")
};

const blockedRescheduleTimeSource = {
  now: () => new Date("2026-04-24T20:30:00+09:00")
};

function seedPlans(plans: DailyPlan[] = basePlans) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
}

function seedReminderObservations(observations: ReminderObservation[]) {
  window.localStorage.setItem(REMINDER_OBSERVATIONS_KEY, JSON.stringify(observations));
}

function fillPlanForm({
  title,
  startTime,
  endTime
}: {
  title: string;
  startTime: string;
  endTime: string;
}) {
  fireEvent.change(screen.getByLabelText("제목"), {
    target: { value: title }
  });
  fireEvent.change(screen.getByLabelText("시작 시간"), {
    target: { value: startTime }
  });
  fireEvent.change(screen.getByLabelText("종료 시간"), {
    target: { value: endTime }
  });
}

function getPlanItem(title: string) {
  const list = document.querySelector(".plan-list");
  const items = Array.from(list?.querySelectorAll("li") ?? []);

  return items.find((item) => item.querySelector(".plan-meta strong")?.textContent === title) ?? null;
}

async function renderPlanner(timeSource = fixedTimeSource) {
  render(<PlannerShell plansStore={localPlansStore} timeSource={timeSource} />);

  await waitFor(() => {
    expect(document.querySelectorAll(".plan-list li")).toHaveLength(2);
  });
}

beforeEach(() => {
  window.localStorage.clear();
  seedPlans();
  Object.defineProperty(globalThis, "crypto", {
    configurable: true,
    value: {
      randomUUID: () => "new-plan-id"
    }
  });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("circular planner user flows", () => {
  it("adds a new plan and persists it in sorted order", async () => {
    await renderPlanner(fixedTimeSource);

    fillPlanForm({
      title: "아침 산책",
      startTime: "06:30",
      endTime: "07:00"
    });

    fireEvent.click(screen.getByRole("button", { name: "계획 추가" }));

    const items = Array.from(document.querySelectorAll(".plan-list li"));
    expect(items).toHaveLength(3);
    expect(items.map((item) => item.textContent)).toEqual([
      expect.stringContaining("취침"),
      expect.stringContaining("영어 공부"),
      expect.stringContaining("아침 산책")
    ]);

    expect(document.querySelector(".summary-tile strong")?.textContent).toBe("0/3");
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]")).toEqual([
      {
        ...basePlans[0],
        status: "missed"
      },
      basePlans[1],
      {
        id: "new-plan-id",
        title: "아침 산책",
        color: "#767676",
        startMinute: 390,
        endMinute: 420,
        rescheduleCount: 0,
        status: "pending"
      }
    ]);
  });

  it("keeps completion status when editing an already completed plan", async () => {
    seedPlans([
      {
        ...basePlans[0],
        status: "done"
      },
      basePlans[1]
    ]);

    await renderPlanner(fixedTimeSource);

    const sleepItem = getPlanItem("취침");
    expect(sleepItem).toBeTruthy();
    fireEvent.click(within(sleepItem as HTMLElement).getByRole("button", { name: "수정" }));

    const titleInput = screen.getByLabelText("제목") as HTMLInputElement;
    expect(titleInput.value).toBe("취침");

    fillPlanForm({
      title: "숙면",
      startTime: "00:00",
      endTime: "05:00"
    });

    fireEvent.click(screen.getByRole("button", { name: "계획 저장" }));

    const editedRow = getPlanItem("숙면");
    expect(editedRow).toBeTruthy();
    expect(within(editedRow as HTMLElement).getByRole("button", { name: "완료" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "계획 등록" })).toBeTruthy();
  });

  it("shows the existing conflicting plan in the overlap error", async () => {
    await renderPlanner(fixedTimeSource);

    fillPlanForm({
      title: "아침 준비",
      startTime: "04:50",
      endTime: "05:10"
    });

    fireEvent.click(screen.getByRole("button", { name: "계획 추가" }));

    expect(
      await screen.findByText(
        "이미 등록된 일정 '취침'(00:00 - 05:00)과 겹쳐 저장할 수 없습니다."
      )
    ).toBeTruthy();
    expect(screen.queryByText("아침 준비")).toBeNull();
  });

  it("shows a start reminder banner and lets the user complete the plan from it", async () => {
    await renderPlanner(reminderTimeSource);

    const reminderBanner = await screen.findByRole("status");
    expect(within(reminderBanner).getByText("시작 리마인드")).toBeTruthy();
    expect(within(reminderBanner).getByText("영어 공부")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "지금 완료" }));

    expect(screen.queryByText("시작 리마인드")).toBeNull();

    const studyItem = getPlanItem("영어 공부");
    expect(studyItem).toBeTruthy();
    expect(within(studyItem as HTMLElement).getByRole("button", { name: "완료" })).toBeTruthy();
    expect(window.localStorage.getItem(REMINDER_OBSERVATIONS_KEY)).toContain('"type":"completed"');
  });

  it("shows the reminder shortly before start time and keeps it dismissed for the same reminder window", async () => {
    await renderPlanner(earlyReminderTimeSource);

    const reminderBanner = await screen.findByRole("status");
    expect(within(reminderBanner).getByText("시작 리마인드")).toBeTruthy();
    expect(within(reminderBanner).getByText("영어 공부")).toBeTruthy();
    expect(within(reminderBanner).queryByRole("button", { name: "지금 완료" })).toBeNull();

    const studyItem = getPlanItem("영어 공부");
    expect(studyItem).toBeTruthy();
    expect(
      within(studyItem as HTMLElement).getByRole("button", { name: "대기" }).hasAttribute(
        "disabled"
      )
    ).toBe(true);

    fireEvent.click(screen.getByRole("button", { name: "닫기" }));

    expect(screen.queryByText("시작 리마인드")).toBeNull();
    expect(window.localStorage.getItem(REMINDER_OBSERVATIONS_KEY)).toContain('"type":"dismissed"');
  });

  it("allows saving a reflection note for a missed plan", async () => {
    await renderPlanner(fixedTimeSource);

    const initialSleepItem = getPlanItem("취침");
    expect(initialSleepItem).toBeTruthy();
    expect(within(initialSleepItem as HTMLElement).getByText("회고 다시 보기")).toBeTruthy();

    const sleepItem = getPlanItem("취침");
    expect(sleepItem).toBeTruthy();
    fireEvent.click(within(sleepItem as HTMLElement).getByRole("button", { name: "회고" }));

    const textarea = screen.getByPlaceholderText(
      "왜 놓쳤는지, 다음에는 어떻게 바꿀지 적어두세요."
    ) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: "잠들기 전 준비 시간이 부족했다." } });
    fireEvent.click(screen.getByRole("button", { name: "회고 저장" }));

    expect(screen.queryByRole("heading", { name: "놓침 회고" })).toBeNull();
    expect(window.localStorage.getItem(STORAGE_KEY)).toContain("잠들기 전 준비 시간이 부족했다.");
    const updatedSleepItem = getPlanItem("취침");
    expect(updatedSleepItem).toBeTruthy();
    expect(within(updatedSleepItem as HTMLElement).getByText("회고 저장됨")).toBeTruthy();
    expect(
      within(updatedSleepItem as HTMLElement).getByText("잠들기 전 준비 시간이 부족했다.")
    ).toBeTruthy();
    expect(within(updatedSleepItem as HTMLElement).queryByText("회고 다시 보기")).toBeNull();
  });

  it("creates a new rescheduled plan from a missed plan", async () => {
    await renderPlanner(fixedTimeSource);

    const sleepItem = getPlanItem("취침");
    expect(sleepItem).toBeTruthy();
    fireEvent.click(within(sleepItem as HTMLElement).getByRole("button", { name: "다시 지정" }));

    expect(screen.getByRole("heading", { name: "다시 지정" })).toBeTruthy();

    fillPlanForm({
      title: "취침 보충",
      startTime: "10:00",
      endTime: "11:00"
    });

    fireEvent.click(screen.getByRole("button", { name: "다시 지정 저장" }));

    const rescheduledItem = getPlanItem("취침 보충");
    expect(rescheduledItem).toBeTruthy();
    const missedSleepItem = getPlanItem("취침");
    expect(missedSleepItem).toBeTruthy();
    expect(within(missedSleepItem as HTMLElement).getByText("다시 지정 1/3")).toBeTruthy();
    expect(within(rescheduledItem as HTMLElement).getByText("다시 지정 1/3")).toBeTruthy();
    expect(window.localStorage.getItem(STORAGE_KEY)).toContain('"sourcePlanId":"sleep"');
    expect(window.localStorage.getItem(STORAGE_KEY)).toContain('"rescheduleCount":1');
  });

  it("re-emphasizes a missed plan when its rescheduled follow-up is starting soon", async () => {
    await renderPlanner(rescheduleSoonTimeSource);

    const sleepItem = getPlanItem("취침");
    expect(sleepItem).toBeTruthy();
    fireEvent.click(within(sleepItem as HTMLElement).getByRole("button", { name: "회고" }));

    const textarea = screen.getByPlaceholderText(
      "왜 놓쳤는지, 다음에는 어떻게 바꿀지 적어두세요."
    ) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: "늦잠 때문에 일정이 밀렸다." } });
    fireEvent.click(screen.getByRole("button", { name: "회고 저장" }));

    fireEvent.click(within(getPlanItem("취침") as HTMLElement).getByRole("button", { name: "다시 지정" }));
    fillPlanForm({
      title: "취침 보충",
      startTime: "10:00",
      endTime: "11:00"
    });
    fireEvent.click(screen.getByRole("button", { name: "다시 지정 저장" }));

    const updatedSleepItem = getPlanItem("취침");
    expect(updatedSleepItem).toBeTruthy();
    expect(within(updatedSleepItem as HTMLElement).getByText("다시 지정 곧 시작")).toBeTruthy();
    expect(
      within(updatedSleepItem as HTMLElement).getByText(
        "10:00에 다시 지정한 일정이 곧 시작됩니다."
      )
    ).toBeTruthy();
    expect(window.localStorage.getItem(RECOVERY_HIGHLIGHT_OBSERVATIONS_KEY)).toContain(
      '"type":"followup_soon"'
    );
  });

  it("shows a scheduled follow-up when the rescheduled time is still far away", async () => {
    await renderPlanner(fixedTimeSource);

    const sleepItem = getPlanItem("취침");
    expect(sleepItem).toBeTruthy();
    fireEvent.click(within(sleepItem as HTMLElement).getByRole("button", { name: "회고" }));

    const textarea = screen.getByPlaceholderText(
      "왜 놓쳤는지, 다음에는 어떻게 바꿀지 적어두세요."
    ) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: "늦잠 때문에 일정이 밀렸다." } });
    fireEvent.click(screen.getByRole("button", { name: "회고 저장" }));

    fireEvent.click(within(getPlanItem("취침") as HTMLElement).getByRole("button", { name: "다시 지정" }));
    fillPlanForm({
      title: "취침 보충",
      startTime: "18:00",
      endTime: "18:50"
    });
    fireEvent.click(screen.getByRole("button", { name: "다시 지정 저장" }));

    const updatedSleepItem = getPlanItem("취침");
    expect(updatedSleepItem).toBeTruthy();
    expect(within(updatedSleepItem as HTMLElement).getByText("다시 지정됨")).toBeTruthy();
    expect(
      within(updatedSleepItem as HTMLElement).getByText(
        "18:00에 취침 보충 일정으로 다시 지정돼 있습니다."
      )
    ).toBeTruthy();
    expect(window.localStorage.getItem(RECOVERY_HIGHLIGHT_OBSERVATIONS_KEY)).toContain(
      '"type":"followup_scheduled"'
    );
  });

  it("records reschedule failures when there is not enough continuous time left", async () => {
    seedPlans([
      {
        id: "exercise",
        title: "운동",
        color: "#767676",
        startMinute: 1080,
        endMinute: 1200,
        rescheduleCount: 0,
        status: "pending"
      },
      {
        id: "late-work",
        title: "야간 작업",
        color: "#ef8d75",
        startMinute: 1200,
        endMinute: 1440,
        rescheduleCount: 0,
        status: "pending"
      }
    ]);

    await renderPlanner(blockedRescheduleTimeSource);

    const exerciseItem = getPlanItem("운동");
    expect(exerciseItem).toBeTruthy();
    fireEvent.click(within(exerciseItem as HTMLElement).getByRole("button", { name: "다시 지정" }));

    expect(
      screen.getByText("원래 길이를 그대로 넣을 연속 시간이 없다는 뜻입니다. 더 짧은 새 시간을 직접 입력해 다시 저장해보십시오.")
    ).toBeTruthy();
    expect(window.localStorage.getItem(RECOVERY_HIGHLIGHT_OBSERVATIONS_KEY)).toContain(
      '"type":"reschedule_unavailable"'
    );
  });

  it("persists customized status and action labels", async () => {
    await renderPlanner(reminderTimeSource);

    expect(
      screen.getByText("앱에서도 유지할 범위는 상태 4개와 핵심 액션 3개, 총 7개 키로 제한합니다.")
    ).toBeTruthy();
    expect(screen.queryByRole("dialog")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "표시 문구 변경" }));

    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("각 문구는 최대 10자까지 입력할 수 있습니다.")).toBeTruthy();

    fireEvent.change(within(dialog).getByLabelText("지금 라벨"), {
      target: { value: "ABCDEFGHIJKL" }
    });
    fireEvent.change(within(dialog).getByLabelText("완료 라벨"), {
      target: { value: "끝냄" }
    });
    fireEvent.change(within(dialog).getByLabelText("놓침 라벨"), {
      target: { value: "놓쳤음" }
    });
    fireEvent.change(within(dialog).getByLabelText("리마인드 완료 버튼"), {
      target: { value: "12345678901" }
    });
    fireEvent.change(within(dialog).getByLabelText("회고 버튼"), {
      target: { value: "회고하기" }
    });
    fireEvent.change(within(dialog).getByLabelText("다시 지정 버튼"), {
      target: { value: "다시 잡기" }
    });
    fireEvent.click(within(dialog).getByRole("button", { name: "변경 적용" }));

    expect(screen.getByRole("button", { name: "1234567890" })).toBeTruthy();

    const studyItem = getPlanItem("영어 공부");
    expect(studyItem).toBeTruthy();
    expect(within(studyItem as HTMLElement).getByRole("button", { name: "ABCDEFGHIJ" })).toBeTruthy();

    const sleepItem = getPlanItem("취침");
    expect(sleepItem).toBeTruthy();
    expect(within(sleepItem as HTMLElement).getByRole("button", { name: "놓쳤음" })).toBeTruthy();
    expect(within(sleepItem as HTMLElement).getByRole("button", { name: "회고하기" })).toBeTruthy();
    expect(within(sleepItem as HTMLElement).getByRole("button", { name: "다시 잡기" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "1234567890" }));
    expect(within(studyItem as HTMLElement).getByRole("button", { name: "끝냄" })).toBeTruthy();
    expect(window.localStorage.getItem(LABEL_SETTINGS_STORAGE_KEY)).toContain("ABCDEFGHIJ");
    expect(window.localStorage.getItem(LABEL_SETTINGS_STORAGE_KEY)).toContain("1234567890");
  });

  it("records recovery re-exposure prompts for later observation", async () => {
    await renderPlanner(fixedTimeSource);

    const panelToggle = screen.getByText("회복 관찰 로그");
    fireEvent.click(panelToggle);

    const panel = panelToggle.closest("details") as HTMLElement;
    expect(
      within(panel).getAllByText("회고 다시 보기", { selector: ".observation-summary-tile span" })
    ).toHaveLength(1);
    expect(within(panel).getByText("1회")).toBeTruthy();
    expect(
      within(panel).getAllByText("회고 다시 보기", { selector: ".observation-item strong" })
    ).toHaveLength(1);
    expect(within(panel).getByText("관찰 더 필요")).toBeTruthy();
    expect(
      within(panel).getByText("기록이 더 필요합니다. 어떤 재강조가 가장 자주 쌓이는지 조금 더 보십시오.")
    ).toBeTruthy();
    expect(
      within(panel).getByText("추천: 지금은 규칙을 바꾸기보다 실제 사용 로그를 조금 더 모으십시오.")
    ).toBeTruthy();
    expect(window.localStorage.getItem(RECOVERY_HIGHLIGHT_OBSERVATIONS_KEY)).toContain(
      '"type":"reflection_prompt"'
    );
  });

  it("marks recovery re-exposure policy for review when the same prompts repeat", async () => {
    window.localStorage.setItem(
      RECOVERY_HIGHLIGHT_OBSERVATIONS_KEY,
      JSON.stringify([
        {
          id: "a",
          currentMinute: 330,
          occurredAt: "2026-04-24T05:30:00+09:00",
          planId: "sleep",
          planTitle: "취침",
          type: "reflection_prompt"
        },
        {
          id: "b",
          currentMinute: 331,
          occurredAt: "2026-04-24T05:31:00+09:00",
          planId: "sleep",
          planTitle: "취침",
          type: "reflection_prompt"
        },
        {
          id: "c",
          currentMinute: 332,
          occurredAt: "2026-04-24T05:32:00+09:00",
          planId: "sleep",
          planTitle: "취침",
          type: "reflection_prompt"
        }
      ])
    );

    await renderPlanner(fixedTimeSource);

    const panelToggle = screen.getByText("회복 관찰 로그");
    fireEvent.click(panelToggle);

    const panel = panelToggle.closest("details") as HTMLElement;
    expect(within(panel).getByText("조정 검토")).toBeTruthy();
    expect(
      within(panel).getByText(
        "같은 회복 신호나 다시 지정 실패가 반복됩니다. 노출 시점, 강조 강도, 또는 재지정 정책을 조정할 후보입니다."
      )
    ).toBeTruthy();
    expect(
      within(panel).getByText("회고 다시 보기가 반복됩니다. 회고 진입을 더 단순하게 하거나 재노출 시점을 늦출지 보십시오.")
    ).toBeTruthy();
    expect(
      within(panel).getByText("추천: 회고 진입을 더 단순하게 하거나 재노출 시점을 늦출지 먼저 검토하십시오.")
    ).toBeTruthy();
  });

  it("shows reminder observation summary metrics for policy checks", async () => {
    await renderPlanner(reminderTimeSource);

    const reminderBanner = await screen.findByRole("status");
    fireEvent.click(within(reminderBanner).getByRole("button", { name: "지금 완료" }));
    const panelToggle = screen.getByText("리마인드 관찰 로그");
    fireEvent.click(panelToggle);

    const panel = panelToggle.closest("details") as HTMLElement;
    expect(within(panel).getByText("표시")).toBeTruthy();
    expect(within(panel).getAllByText("1회")).toHaveLength(2);
    expect(within(panel).getByText("닫기 비율")).toBeTruthy();
    expect(within(panel).getByText("0%")).toBeTruthy();
    expect(within(panel).getByText("완료 전환율")).toBeTruthy();
    expect(within(panel).getByText("100%")).toBeTruthy();
    expect(within(panel).getByText("관찰 더 필요")).toBeTruthy();
    expect(
      within(panel).getByText("표본이 아직 적습니다. 최소 3회 이상 표시된 뒤 다시 판단하십시오.")
    ).toBeTruthy();
    expect(
      within(panel).getByText(
        "기록이 더 필요합니다. 표시 후 실제 완료와 닫기 비율을 조금 더 모아 보십시오."
      )
    ).toBeTruthy();
  });

  it("marks reminder policy for review when dismissals dominate after enough samples", async () => {
    seedReminderObservations([
      {
        id: "study:300:shown:1",
        currentMinute: 296,
        occurredAt: "2026-04-24T04:56:00+09:00",
        planId: "study",
        planTitle: "영어 공부",
        startMinute: 300,
        type: "shown"
      },
      {
        id: "study:300:dismissed:1",
        currentMinute: 296,
        occurredAt: "2026-04-24T04:57:00+09:00",
        planId: "study",
        planTitle: "영어 공부",
        startMinute: 300,
        type: "dismissed"
      },
      {
        id: "study:300:shown:2",
        currentMinute: 297,
        occurredAt: "2026-04-25T04:57:00+09:00",
        planId: "study",
        planTitle: "영어 공부",
        startMinute: 300,
        type: "shown"
      },
      {
        id: "study:300:dismissed:2",
        currentMinute: 297,
        occurredAt: "2026-04-25T04:58:00+09:00",
        planId: "study",
        planTitle: "영어 공부",
        startMinute: 300,
        type: "dismissed"
      },
      {
        id: "study:300:shown:3",
        currentMinute: 298,
        occurredAt: "2026-04-26T04:58:00+09:00",
        planId: "study",
        planTitle: "영어 공부",
        startMinute: 300,
        type: "shown"
      }
    ]);

    await renderPlanner(fixedTimeSource);

    const panelToggle = screen.getByText("리마인드 관찰 로그");
    fireEvent.click(panelToggle);

    const panel = panelToggle.closest("details") as HTMLElement;
    expect(within(panel).getByText("조정 검토")).toBeTruthy();
    expect(
      within(panel).getByText("닫기 비율이 높습니다. 시간 창을 더 늦추거나 배너 표현을 낮출 후보입니다.")
    ).toBeTruthy();
    expect(within(panel).getByText("67%")).toBeTruthy();
  });

  it("marks reminder policy to hold when completions keep up after enough samples", async () => {
    seedReminderObservations([
      {
        id: "study:300:shown:1",
        currentMinute: 296,
        occurredAt: "2026-04-24T04:56:00+09:00",
        planId: "study",
        planTitle: "영어 공부",
        startMinute: 300,
        type: "shown"
      },
      {
        id: "study:300:completed:1",
        currentMinute: 305,
        occurredAt: "2026-04-24T05:05:00+09:00",
        planId: "study",
        planTitle: "영어 공부",
        startMinute: 300,
        type: "completed"
      },
      {
        id: "study:300:shown:2",
        currentMinute: 296,
        occurredAt: "2026-04-25T04:56:00+09:00",
        planId: "study",
        planTitle: "영어 공부",
        startMinute: 300,
        type: "shown"
      },
      {
        id: "study:300:completed:2",
        currentMinute: 305,
        occurredAt: "2026-04-25T05:05:00+09:00",
        planId: "study",
        planTitle: "영어 공부",
        startMinute: 300,
        type: "completed"
      },
      {
        id: "study:300:shown:3",
        currentMinute: 296,
        occurredAt: "2026-04-26T04:56:00+09:00",
        planId: "study",
        planTitle: "영어 공부",
        startMinute: 300,
        type: "shown"
      },
      {
        id: "study:300:dismissed:1",
        currentMinute: 297,
        occurredAt: "2026-04-26T04:57:00+09:00",
        planId: "study",
        planTitle: "영어 공부",
        startMinute: 300,
        type: "dismissed"
      }
    ]);

    await renderPlanner(fixedTimeSource);

    const panelToggle = screen.getByText("리마인드 관찰 로그");
    fireEvent.click(panelToggle);

    const panel = panelToggle.closest("details") as HTMLElement;
    expect(within(panel).getByText("우선 유지")).toBeTruthy();
    expect(
      within(panel).getByText("완료 전환이 닫기보다 유지됩니다. 현재 시간 창은 우선 유지해도 됩니다.")
    ).toBeTruthy();
    expect(within(panel).getByText("33%")).toBeTruthy();
  });

  it("deduplicates reminder observations loaded from localStorage", async () => {
    seedReminderObservations([
      {
        id: "duplicate-a",
        currentMinute: 296,
        occurredAt: "2026-04-28T04:14:58.105Z",
        planId: "study",
        planTitle: "영어 공부",
        startMinute: 300,
        type: "shown"
      },
      {
        id: "duplicate-b",
        currentMinute: 296,
        occurredAt: "2026-04-28T04:14:58.105Z",
        planId: "study",
        planTitle: "영어 공부",
        startMinute: 300,
        type: "shown"
      }
    ]);

    await renderPlanner(fixedTimeSource);

    const panelToggle = screen.getByText("리마인드 관찰 로그");
    fireEvent.click(panelToggle);

    const panel = panelToggle.closest("details") as HTMLElement;
    expect(within(panel).getAllByText("배너 표시")).toHaveLength(1);
    expect(within(panel).getByText("1회")).toBeTruthy();

    const storedObservations = JSON.parse(
      window.localStorage.getItem(REMINDER_OBSERVATIONS_KEY) ?? "[]"
    );
    expect(storedObservations).toHaveLength(1);
  });

  it("resets the form when deleting the plan currently being edited", async () => {
    await renderPlanner(fixedTimeSource);

    const studyItem = getPlanItem("영어 공부");
    expect(studyItem).toBeTruthy();
    fireEvent.click(within(studyItem as HTMLElement).getByRole("button", { name: "수정" }));

    expect(screen.getByRole("heading", { name: "계획 수정" })).toBeTruthy();
    fireEvent.click(within(studyItem as HTMLElement).getByRole("button", { name: "삭제" }));

    expect(await screen.findByRole("heading", { name: "계획 등록" })).toBeTruthy();
    expect((screen.getByLabelText("제목") as HTMLInputElement).value).toBe("");
    expect(screen.queryByText("영어 공부")).toBeNull();
  });
});
