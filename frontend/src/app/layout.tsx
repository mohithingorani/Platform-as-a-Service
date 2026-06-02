import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Poppins } from "next/font/google";
import RecoilContextProvider from "@/lib/recoilContextProvider";
import SiteFooter from "./components/SiteFooter";

const inter = Inter({ subsets: ["latin"] });
const poppins_init = Poppins({
  subsets: ["latin"],
  weight: ["100", "300", "700"],
  variable: "--font-poppins",
});
export const metadata: Metadata = {
  title: "Voltex",
  description: "Deploy Your React Applications",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins_init.className} min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <RecoilContextProvider>
            <div className="flex-1 flex flex-col">{children}</div>
            <SiteFooter />
          </RecoilContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
