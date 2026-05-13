import type {
  DailyPlan,
  DatedPlanRecord,
  PlannerRecordMap
} from "../../../../src/domains/plans/types";
import { getPlanDateKey } from "../../../../src/providers/plans/record-backed-shared";

function toDateRecord(date: string, plans: DailyPlan[]): DatedPlanRecord[] {
  return plans.map((plan) => ({
    ...plan,
    date
  }));
}

export function getExpoPlannerDateKey(now: Date) {
  return getPlanDateKey(now);
}

export function getExpoPlannerMonthKey(now: Date) {
  return getPlanDateKey(now).slice(0, 7);
}

export function toExpoDateRecord(date: string, plans: DailyPlan[]): DatedPlanRecord[] {
  return toDateRecord(date, plans);
}

export function createExpoDemoPlans(now: Date): DailyPlan[] {
  const currentMinute = now.getHours() * 60 + now.getMinutes();
  const focusStart = Math.max(0, currentMinute - 20);
  const focusEnd = Math.min(24 * 60, focusStart + 80);

  return [
    {
      id: "focus-1",
      title: "집중 작업",
      color: "#f07c61",
      startMinute: focusStart,
      endMinute: focusEnd,
      rescheduleCount: 0,
      status: currentMinute >= focusEnd ? "done" : "pending"
    },
    {
      id: "walk-1",
      title: "가벼운 산책",
      color: "#5f86b3",
      startMinute: Math.min(24 * 60 - 50, focusEnd + 20),
      endMinute: Math.min(24 * 60, focusEnd + 70),
      rescheduleCount: 0,
      status: "pending"
    },
    {
      id: "review-1",
      title: "회고 정리",
      color: "#87b889",
      startMinute: Math.min(24 * 60 - 40, focusEnd + 100),
      endMinute: Math.min(24 * 60, focusEnd + 140),
      rescheduleCount: 1,
      sourcePlanId: "review-root",
      status: "missed",
      reflectionNote: "저녁 전환 시 흐름이 끊겼습니다."
    }
  ];
}

export function createExpoDemoRecords(now: Date): PlannerRecordMap {
  const currentDate = getPlanDateKey(now);
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const twoDaysAgo = new Date(now);
  twoDaysAgo.setDate(now.getDate() - 2);

  return {
    [getPlanDateKey(twoDaysAgo)]: toDateRecord(getPlanDateKey(twoDaysAgo), [
      {
        id: "deep-work-1",
        title: "깊은 작업",
        color: "#f07c61",
        startMinute: 9 * 60,
        endMinute: 11 * 60,
        rescheduleCount: 0,
        status: "done"
      },
      {
        id: "exercise-1",
        title: "운동",
        color: "#5f86b3",
        startMinute: 18 * 60,
        endMinute: 19 * 60,
        rescheduleCount: 0,
        status: "done"
      }
    ]),
    [getPlanDateKey(yesterday)]: toDateRecord(getPlanDateKey(yesterday), [
      {
        id: "deep-work-2",
        title: "깊은 작업",
        color: "#f07c61",
        startMinute: 10 * 60,
        endMinute: 12 * 60,
        rescheduleCount: 0,
        status: "done"
      },
      {
        id: "recovery-1",
        title: "놓친 일정 회복",
        color: "#87b889",
        startMinute: 20 * 60,
        endMinute: 21 * 60,
        rescheduleCount: 1,
        sourcePlanId: "recovery-root",
        status: "done",
        reflectionNote: "퇴근 직후 바로 다시 잡으니 해결됐습니다."
      }
    ]),
    [currentDate]: toDateRecord(currentDate, createExpoDemoPlans(now))
  };
}
