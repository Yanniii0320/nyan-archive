import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NÝAN.ARCHIVE",
  description:
    "A personal archive of tender systems: image, identity, sound and experiments.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "NÝAN.ARCHIVE",
    description: "A personal archive of tender systems.",
    images: [{ url: "/og.png", width: 1680, height: 940, alt: "A luminous organism within NÝAN.ARCHIVE" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NÝAN.ARCHIVE",
    description: "A personal archive of tender systems.",
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
