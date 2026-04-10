import type { Metadata } from 'next'
import { Cinzel, IM_Fell_English } from 'next/font/google'
import './globals.css'

const cinzel = Cinzel({
  variable: '--font-cinzel',
  subsets: ['latin'],
  weight: ['400', '700', '900'],
})

const imFell = IM_Fell_English({
  variable: '--font-im-fell',
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  title: 'Your Nightmare — Horror Folklore from Around the World',
  description:
    'Explore supernatural horror stories, ancient folklore, and terrifying beings from every corner of the world.',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cinzel.variable} ${imFell.variable} h-full`}>
      <body className="h-full">{children}</body>
    </html>
  )
}
