"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Class-based theme provider. Adds `.light` / `.dark` to <html>.
 * Default is light for the marketing site; product "screens" opt out via
 * `.surface-dark` so runtime chrome stays faithful to the IDE.
 */
export function ThemeProvider({ children }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  );
}
