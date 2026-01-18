import "./globals.css";
import { ConvexClientProvider } from "@/lib/convex";

// Force dynamic rendering to avoid build-time errors with Convex
export const dynamic = "force-dynamic";

export const metadata = {
  title: "VoltAgent + Convex Chat",
  description: "A chat example using VoltAgent with Convex storage",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
