import './globals.css'
import {Inter} from 'next/font/google'
import {TrpcProvider} from "@/providers/TrpcProvider";
import {cn} from "@/lib/cn";

const fontSans = Inter({
    subsets: ["latin"],
    variable: "--font-sans"
});

export const metadata = {
    title: 'Chat Paper',
    description: 'Chat Paper',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <TrpcProvider>
            <body className={cn(
                "min-h-screen bg-background font-sans antialiased",
                fontSans.variable
            )}>{children}</body>
        </TrpcProvider>
        </html>
    )
}
