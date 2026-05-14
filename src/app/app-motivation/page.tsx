import { AppMotivationShell } from "@/features/planner/app/app-motivation-shell";
import { AppPreviewFrame } from "@/features/planner/app/components/app-preview-frame";

export default function AppMotivationPage() {
  return (
    <AppPreviewFrame routeLabel="동기" screenLabel="동기">
      <AppMotivationShell />
    </AppPreviewFrame>
  );
}
