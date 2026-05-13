import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

import {
  EXPO_THEME_OPTIONS,
  EXPO_THEME_STORAGE_KEY,
  getExpoStatusBarStyle,
  getExpoTheme,
  getExpoThemePalette,
  type ExpoThemeKey
} from "./expo-theme";

type ExpoThemeContextValue = {
  setThemeKey: (themeKey: ExpoThemeKey) => void;
  statusBarStyle: "dark-content" | "light-content";
  theme: ReturnType<typeof getExpoTheme>;
  themeKey: ExpoThemeKey;
  themeOptions: typeof EXPO_THEME_OPTIONS;
};

const ExpoThemeContext = createContext<ExpoThemeContextValue | null>(null);

export function ExpoThemeProvider({ children }: { children: ReactNode }) {
  const [themeKey, setThemeKey] = useState<ExpoThemeKey>("sand");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadThemePreference() {
      try {
        const storedThemeKey = await AsyncStorage.getItem(EXPO_THEME_STORAGE_KEY);

        if (!active) {
          return;
        }

        if (storedThemeKey === "sand" || storedThemeKey === "mint" || storedThemeKey === "night-ink") {
          setThemeKey(storedThemeKey);
        }
      } finally {
        if (active) {
          setIsLoaded(true);
        }
      }
    }

    void loadThemePreference();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    void AsyncStorage.setItem(EXPO_THEME_STORAGE_KEY, themeKey);
  }, [isLoaded, themeKey]);

  const value = useMemo(
    () => ({
      setThemeKey,
      statusBarStyle: getExpoStatusBarStyle(themeKey),
      theme: getExpoTheme(themeKey),
      themeKey,
      themeOptions: EXPO_THEME_OPTIONS
    }),
    [themeKey]
  );

  return <ExpoThemeContext.Provider value={value}>{children}</ExpoThemeContext.Provider>;
}

export function useExpoTheme() {
  const context = useContext(ExpoThemeContext);

  if (!context) {
    throw new Error("useExpoTheme must be used within ExpoThemeProvider");
  }

  return context;
}

export function useExpoThemePalette() {
  const { themeKey } = useExpoTheme();
  return getExpoThemePalette(themeKey);
}
