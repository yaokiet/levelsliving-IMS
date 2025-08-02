import "../globals.css";
import { ThemeProvider } from "@/components/ui/topbar/theme-provider";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}