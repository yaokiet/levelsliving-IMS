import "@/app/globals.css";
import { AuthInitializer } from "@/components/AuthInitializer";
import ReduxProvider from "./_store/ReduxProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                {/* Add any meta tags, title, or links here */}
            </head>
            <body className="dark bg-background text-foreground">
                <ReduxProvider>
                    <AuthInitializer />
                    {children}
                </ReduxProvider>
            </body>
        </html>
    );
}
