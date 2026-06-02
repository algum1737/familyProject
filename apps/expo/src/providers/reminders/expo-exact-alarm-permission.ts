import { NativeModules, Platform } from "react-native";

import type { ExpoExactAlarmAccessState } from "./expo-exact-alarm-access";
export type { ExpoExactAlarmAccessState } from "./expo-exact-alarm-access";

type ExactAlarmNativeModule = {
  canScheduleExactAlarms?: () => Promise<boolean>;
  openExactAlarmSettings?: () => Promise<boolean>;
};

const exactAlarmModule = NativeModules.ExactAlarmModule as
  | ExactAlarmNativeModule
  | undefined;

export async function getExpoExactAlarmAccessState(): Promise<ExpoExactAlarmAccessState> {
  if (Platform.OS !== "android") {
    return "not-required";
  }

  if (!exactAlarmModule?.canScheduleExactAlarms) {
    return "unavailable";
  }

  const canSchedule = await exactAlarmModule.canScheduleExactAlarms();

  return canSchedule ? "granted" : "needs-permission";
}

export async function openExpoExactAlarmSettings() {
  if (Platform.OS !== "android") {
    return false;
  }

  if (!exactAlarmModule?.openExactAlarmSettings) {
    return false;
  }

  return exactAlarmModule.openExactAlarmSettings();
}
