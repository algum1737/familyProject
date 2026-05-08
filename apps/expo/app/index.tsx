import { Redirect } from "expo-router";

import { EXPO_ROUTE_PATHS } from "../src/app-shell/expo-router-contract";

export default function IndexRoute() {
  return <Redirect href={EXPO_ROUTE_PATHS.today} />;
}
