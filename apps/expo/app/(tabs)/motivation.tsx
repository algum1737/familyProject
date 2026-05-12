import { ExpoMotivationScreen } from "../../src/screens/motivation-screen";
import { useExpoRouterAppModel } from "../../src/app-shell/expo-router-app-provider";

export default function MotivationRoute() {
  const model = useExpoRouterAppModel();

  return (
    <ExpoMotivationScreen
      calendarDays={model.monthlyCalendar}
      recoverySummary={model.recoverySummary}
      summary={model.monthlySummary}
    />
  );
}
