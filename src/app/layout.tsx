import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";
import { Container } from "@/components/layout/Container";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title:
    "Khant Wai Yan | Software Engineer | Simple Blog Based Portfolio using only next.js",
  description:
    "A software engineer portfolio documenting my journey in building scalable systems, sharing projects, architecture decisions, and real-world implementations.",
  openGraph: {
    title: "Khant Wai Yan | Software Engineer",
    description:
      "Full-stack engineer building scalable systems and modern applications",
    url: "https://khantwaiyan.cloud",
    siteName: "Khant Portfolio",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={cn(
        "h-full",
        "antialiased",
        inter.variable,
        jetbrainsMono.variable,
      )}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <main>
            <Container>
              {children}
            </Container>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
