import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { StoreProvider } from "@/store/providers/StoreProvider";
import { AppProviders, ThemeListener } from "@/components/common/AppProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "NexusHub — Enterprise Operations Console",
    template: "%s · NexusHub",
  },
  description:
    "Role-based enterprise dashboard architecture: RBAC routing, server-side datatables, realtime sync and global state with Redux Toolkit.",
};

const themeBootstrap = `(function(){try{var s=JSON.parse(localStorage.getItem("nexus-hub:ui:v1")||"{}");var d=s.theme?s.theme==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;var r=document.documentElement;r.classList.toggle("dark",d);r.style.colorScheme=d?"dark":"light";}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <StoreProvider>
          <AppProviders>
            <ThemeListener />
            {children}
          </AppProviders>
        </StoreProvider>
      </body>
    </html>
  );
}
