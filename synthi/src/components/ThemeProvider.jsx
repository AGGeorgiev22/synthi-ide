"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Class-based theme provider. Adds `.light` / `.dark` to <html>.
 * The marketing surface follows the visitor's system preference. Product
 * screens keep their dark runtime chrome in either page theme.
 */
export function ThemeProvider({ children }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  );
}
