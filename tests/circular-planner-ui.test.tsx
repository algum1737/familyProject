// @vitest-environment jsdom

import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";

import { CircularPlanner } from "@/ui/planner/circular-planner";
import type { DailyPlan } from "@/domains/plans/types";

const STORAGE_KEY = "today-did-you-finish:plans";

const basePlans: DailyPlan[] = [
  {
    id: "sleep",
    title: "취침",
    color: "#767676",
    startMinute: 0,
    endMinute: 300,
    status: "pending"
  },
  {
    id: "study",
    title: "영어 공부",
    color: "#ef8d75",
    startMinute: 300,
    endMinute: 360,
    status: "pending"
  }
];

vi.mock("@/providers/time/time-source", () => ({
  systemTimeSource: {
    now: () => new Date("2026-04-24T05:30:00+09:00")
  }
}));

function seedPlans(plans: DailyPlan[] = basePlans) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
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
    render(<CircularPlanner />);

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
      basePlans[0],
      basePlans[1],
      {
        id: "new-plan-id",
        title: "아침 산책",
        color: "#767676",
        startMinute: 390,
        endMinute: 420,
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

    render(<CircularPlanner />);

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
    render(<CircularPlanner />);

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

  it("resets the form when deleting the plan currently being edited", async () => {
    render(<CircularPlanner />);

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
