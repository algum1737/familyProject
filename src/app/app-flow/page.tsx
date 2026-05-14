import { AppFlowShell } from "@/features/planner/app/app-flow-shell";
import { AppPreviewFrame } from "@/features/planner/app/components/app-preview-frame";

export default function AppFlowPage() {
  return (
    <AppPreviewFrame routeLabel="오늘 계획 흐름" screenLabel="오늘 계획 흐름">
      <AppFlowShell />
    </AppPreviewFrame>
  );
}
