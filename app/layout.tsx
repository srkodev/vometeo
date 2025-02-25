import type React from "react"
import type { Metadata } from "next"
import { Comfortaa } from "next/font/google"
import "./globals.css"

const comfortaa = Comfortaa({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "VoMeteo",
  description: "Votre application météo personnelle",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={comfortaa.className}>
        {children}
      </body>
    </html>
  )
}



import './globals.css'