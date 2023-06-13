import './globals.css'
import {Inter} from 'next/font/google'
import {TrpcProvider} from "@/providers/TrpcProvider";

const inter = Inter({subsets: ['latin']})

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
            <body className={inter.className}>{children}</body>
        </TrpcProvider>
        </html>
    )
}
