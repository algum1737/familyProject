import type { DailyPlan } from "@/domains/plans/types";

export const demoPlans: DailyPlan[] = [
  {
    id: "1",
    title: "취침",
    color: "#767676",
    startMinute: 60,
    endMinute: 420,
    status: "pending"
  },
  {
    id: "2",
    title: "운동",
    color: "#9a80eb",
    startMinute: 1260,
    endMinute: 1320,
    status: "pending"
  },
  {
    id: "3",
    title: "저녁",
    color: "#f7b347",
    startMinute: 1080,
    endMinute: 1140,
    status: "pending"
  },
  {
    id: "4",
    title: "넷플릭스",
    color: "#ef668f",
    startMinute: 870,
    endMinute: 945,
    status: "done"
  },
  {
    id: "5",
    title: "영어 공부",
    color: "#ef8d75",
    startMinute: 510,
    endMinute: 585,
    status: "pending"
  },
  {
    id: "6",
    title: "점심 식사",
    color: "#f4bc58",
    startMinute: 720,
    endMinute: 780,
    status: "done"
  }
];

