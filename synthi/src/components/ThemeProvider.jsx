"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Class-based theme provider. Adds `.light` / `.dark` to <html>.
 * Default is dark (the product is terminal-forward); system preference is
 * respected on first visit. globals.css flips page-chrome tokens under
 * `html.light`; product "screens" opt out via `.surface-dark`.
 */
export function ThemeProvider({ children }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  );
}
