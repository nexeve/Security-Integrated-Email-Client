import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "Cyber Leek — Secure Email Intelligence",
  description: "Secure-by-design webmail client with native threat detection and forensic analysis",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className="h-full antialiased dark"
    >
      <body className="min-h-full flex flex-col bg-atmospheric">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
