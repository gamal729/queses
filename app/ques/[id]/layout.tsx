import type { Metadata } from "next";
import "@/app/globals.css";
// import { dir } from 'rtl-css-js';

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "نظام الاختبارات",
  description: "نظام اختبارات تفاعلي على غرار Duolingo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

      <main 
    //   className={inter.className}
      >{children}</main>

  );
}