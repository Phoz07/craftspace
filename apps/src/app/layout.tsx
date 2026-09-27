import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";

const prompt = Prompt({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  display: "swap",
  variable: "--font-prompt",
});

export const metadata: Metadata = {
  title: "CraftSpace Interior & Built-in Studio | ประเมินราคาบิวท์อินใน 1 นาที",
  description:
    "สตูดิโอออกแบบตกแต่งภายในและบิวท์อินระดับพรีเมียม สไตล์ Minimal Japandi & Modern Luxury คัดกรองงบประมาณจริงด้วยระบบคำนวณราคาประเมินสด พร้อมรับสิทธิ์สำรวจหน้างานฟรี",
  keywords: [
    "บิวท์อินคอนโด",
    "ตกแต่งภายใน",
    "ราคาบิวท์อิน",
    "Japandi",
    "Modern Luxury",
    "CraftSpace",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={`${prompt.variable} scroll-smooth`}>
      <body className="font-sans antialiased min-h-screen bg-[#FBF9F5] text-[#1F1D1A] flex flex-col">
        {children}
      </body>
    </html>
  );
}
