import { AuthInitializer } from "@/components/AuthInitializer";
import ReduxProvider from "./_store/ReduxProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                {/* Add any meta tags, title, or links here */}
            </head>
            <body>
                <ReduxProvider>
                    <AuthInitializer />
                    {children}
                </ReduxProvider>
            </body>
        </html>
    );
}
