import { test, expect } from "@playwright/test";
import { TEST_NOW_STORAGE_KEY } from "../../src/providers/time/time-source";

test.describe("planner browser flows", () => {
  const testNowIso = "local:2026-04-24T05:30:00";
  const seededPlans = [
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

  async function fillPlanForm(
    page: import("@playwright/test").Page,
    values: {
      title: string;
      startTime: string;
      endTime: string;
    }
  ) {
    await page.locator('input[name="title"]').fill(values.title);
    await page.locator('input[name="startTime"]').fill(values.startTime);
    await page.locator('input[name="endTime"]').fill(values.endTime);
  }

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(({ nowIso, plans, storageKey }) => {
      window.localStorage.clear();
      window.localStorage.setItem(storageKey, nowIso);
      window.localStorage.setItem(
        "today-did-you-finish:plans",
        JSON.stringify(plans)
      );
    }, {
      nowIso: testNowIso,
      plans: seededPlans,
      storageKey: TEST_NOW_STORAGE_KEY
    });
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "지금 해야 할 계획을 시계처럼 바로 확인하세요" })
    ).toBeVisible();
    await expect(page.locator(".summary-tile strong").first()).toHaveText("0/2");
    await expect(page.locator(".plan-item")).toHaveCount(2);
    await expect(
      page.locator(".plan-item", {
        has: page.locator(".plan-meta strong", { hasText: "영어 공부" })
      })
    ).toBeVisible();
  });

  test("adds a plan and blocks an overlapping plan with the existing schedule name", async ({
    page
  }) => {
    await fillPlanForm(page, {
      title: "아침 산책",
      startTime: "06:30",
      endTime: "07:00"
    });
    await page.getByRole("button", { name: "계획 추가" }).click();

    const planList = page.locator(".plan-list");
    await expect(planList.getByText("아침 산책")).toBeVisible();
    await expect(page.locator(".summary-tile strong").first()).toHaveText("0/3");

    await fillPlanForm(page, {
      title: "아침 준비",
      startTime: "04:50",
      endTime: "05:10"
    });
    await page.getByRole("button", { name: "계획 추가" }).click();

    await expect(
      page.getByText("이미 등록된 일정 '취침'(00:00 - 05:00)과 겹쳐 저장할 수 없습니다.")
    ).toBeVisible();
    await expect(planList.getByText("아침 준비")).toHaveCount(0);
  });

  test("edits, completes, and deletes a plan", async ({ page }) => {
    const studyItem = page.locator(".plan-item", {
      has: page.locator(".plan-meta strong", { hasText: "영어 공부" })
    });

    await studyItem.getByRole("button", { name: "수정" }).click();
    await expect(page.getByRole("heading", { name: "계획 수정" })).toBeVisible();

    await fillPlanForm(page, {
      title: "영어 회화",
      startTime: "05:30",
      endTime: "06:30"
    });
    await page.getByRole("button", { name: "계획 저장" }).click();

    const editedItem = page.locator(".plan-item", {
      has: page.locator(".plan-meta strong", { hasText: "영어 회화" })
    });

    await expect(editedItem).toBeVisible();
    await expect(page.getByRole("heading", { name: "계획 등록" })).toBeVisible();

    await editedItem.getByRole("button", { name: "지금" }).click();
    await expect(editedItem.getByRole("button", { name: "완료" })).toBeVisible();
    await expect(page.locator(".summary-tile strong").first()).toHaveText("1/2");

    await editedItem.getByRole("button", { name: "삭제" }).click();
    await expect(page.locator(".plan-item", {
      has: page.locator(".plan-meta strong", { hasText: "영어 회화" })
    })).toHaveCount(0);
  });

  test("shows the blocked reschedule reason in the browser", async ({ browser }) => {
    const context = await browser.newContext();
    await context.addInitScript(({ nowIso, storageKey }) => {
      window.localStorage.clear();
      window.localStorage.setItem(storageKey, nowIso);
      window.localStorage.setItem(
        "today-did-you-finish:plans",
        JSON.stringify([
          {
            id: "maxed",
            title: "운동",
            color: "#767676",
            startMinute: 60,
            endMinute: 120,
            rescheduleCount: 3,
            status: "missed"
          }
        ])
      );
    }, {
      nowIso: testNowIso,
      storageKey: TEST_NOW_STORAGE_KEY
    });
    const page = await context.newPage();
    await page.goto("/");

    const maxedItem = page.locator(".plan-item", {
      has: page.locator(".plan-meta strong", { hasText: "운동" })
    });

    await expect(maxedItem).toBeVisible();
    await expect(maxedItem.getByText("다시 지정 3/3 사용 완료")).toBeVisible();
    await expect(maxedItem.getByRole("button", { name: "다시 지정" })).toBeDisabled();
    await context.close();
  });
});
