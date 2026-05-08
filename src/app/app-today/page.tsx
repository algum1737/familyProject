import { AppTodayShell } from "@/features/planner/app/app-today-shell";
import { AppPreviewFrame } from "@/features/planner/app/components/app-preview-frame";

export default function AppTodayPage() {
  return (
    <AppPreviewFrame routeLabel="/app-today" screenLabel="Today Screen">
      <AppTodayShell />
    </AppPreviewFrame>
  );
}
