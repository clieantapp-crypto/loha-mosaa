import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'لوحة التحكم',
  description: 'لوحة تحكم لإدارة المستخدمين والإشعارات',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" className="dark bg-background">
      <body>
        {children}
      </body>
    </html>
  )
}
