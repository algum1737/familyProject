import { AppReflectionShell } from "@/features/planner/app/app-reflection-shell";
import { AppPreviewFrame } from "@/features/planner/app/components/app-preview-frame";

export default function AppReflectionPage() {
  return (
    <AppPreviewFrame routeLabel="회고" screenLabel="회고">
      <AppReflectionShell />
    </AppPreviewFrame>
  );
}
