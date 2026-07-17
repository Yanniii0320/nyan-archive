import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RESONANCE — NÝAN.ARCHIVE",
  description:
    "An explorable listening organism inside NÝAN.ARCHIVE. Music is encountered as a living emotional space.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "RESONANCE — NÝAN.ARCHIVE",
    description: "Listening is entering someone else’s emotional space.",
    images: [{ url: "/og.png", width: 1680, height: 940, alt: "A luminous organism within the RESONANCE world" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "RESONANCE — NÝAN.ARCHIVE",
    description: "Listening is entering someone else’s emotional space.",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#02030a",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
