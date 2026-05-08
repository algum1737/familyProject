import { AppReflectionShell } from "@/features/planner/app/app-reflection-shell";
import { AppPreviewFrame } from "@/features/planner/app/components/app-preview-frame";

export default function AppReflectionPage() {
  return (
    <AppPreviewFrame routeLabel="/app-reflection" screenLabel="Reflection">
      <AppReflectionShell />
    </AppPreviewFrame>
  );
}
