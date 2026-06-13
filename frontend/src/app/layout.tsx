import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DeckHub | GitHub-native Anki Deck Archive",
  description: "GitHub Releases and manifests for verified Anki APKG sharing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
