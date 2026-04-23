"use client";

import { useEffect, useState } from "react";

import { CircularPlanner } from "@/ui/planner/circular-planner";

export function PlannerShell() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <main className="shell planner-loading" />;
  }

  return <CircularPlanner />;
}
