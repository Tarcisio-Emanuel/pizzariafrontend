import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.scss";
import { Toaster } from "sonner";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Sujeito Pizza",
  description: "A melhor pizaria do Brazil",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning={true}>
          <Toaster position="bottom-right" toastOptions={{style:{
            backgroundColor: "#f1f1f1", color: "#131313", borderColor: "rgba(255,255,255, 0.2)" 
            }}}/>
        {children}
      </body>
    </html>
  );
}
