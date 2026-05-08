import { AppMotivationShell } from "@/features/planner/app/app-motivation-shell";
import { AppPreviewFrame } from "@/features/planner/app/components/app-preview-frame";

export default function AppMotivationPage() {
  return (
    <AppPreviewFrame routeLabel="/app-motivation" screenLabel="Motivation">
      <AppMotivationShell />
    </AppPreviewFrame>
  );
}
