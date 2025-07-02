import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "VSM Lecture Storage System",
  description: "Hệ thống quản lý bài giảng cho Vietnam Student Marathon",
  keywords: ["VSM", "Vietnam Student Marathon", "bài giảng", "marathon", "giáo dục"],
  authors: [{ name: "VSM Team" }],
  viewport: "width=device-width, initial-scale=1",
    generator: 'VSM Lecture Storage System',
  applicationName: "VSM Lecture Storage System",
  creator: "VSM Team",
  publisher: "VSM Team",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className="dark">
      <body className={cn(inter.className, "min-h-screen antialiased")}>{children}</body>
    </html>
  )
}
