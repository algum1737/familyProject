import { AppPlanEditorShell } from "@/features/planner/app/app-plan-editor-shell";
import { AppPreviewFrame } from "@/features/planner/app/components/app-preview-frame";

export default function AppPlanEditorPage() {
  return (
    <AppPreviewFrame routeLabel="/app-plan-editor" screenLabel="Plan Editor">
      <AppPlanEditorShell />
    </AppPreviewFrame>
  );
}
