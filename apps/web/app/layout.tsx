import type { Metadata } from 'next'
import { Providers } from './providers'
import Nav from '../components/Nav'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fountain Quiz - Learn & Retain SOP Knowledge',
  description: 'Help Fountain team members quickly learn & retain SOP/workflow knowledge via quizzes and scenario practice',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Nav />
          {children}
        </Providers>
      </body>
    </html>
  )
}
