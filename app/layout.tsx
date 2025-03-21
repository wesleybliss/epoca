import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeSync } from '@/components/theme-sync'
import './globals.css'

export const metadata: Metadata = {
    title: 'v0 App',
    description: 'Created with v0',
    generator: 'v0.dev',
}

export default function RootLayout({
    children,
}: Readonly<{
  children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body style={{ isolation: 'isolate' }}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                    forcedTheme={process.env.NODE_ENV === 'production' ? 'light' : undefined}>
                    <ThemeSync />
                    {children}
                </ThemeProvider>
            </body>
        </html>
    )
}
