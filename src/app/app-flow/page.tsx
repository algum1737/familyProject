import { AppFlowShell } from "@/features/planner/app/app-flow-shell";
import { AppPreviewFrame } from "@/features/planner/app/components/app-preview-frame";

export default function AppFlowPage() {
  return (
    <AppPreviewFrame routeLabel="/app-flow" screenLabel="Planner Flow">
      <AppFlowShell />
    </AppPreviewFrame>
  );
}
