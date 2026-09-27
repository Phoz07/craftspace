import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const lineSeedSansTH = localFont({
  src: [
    {
      path: "../../public/fonts/LINESeedSansTH_W_Th.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/LINESeedSansTH_W_Rg.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/LINESeedSansTH_W_Bd.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/LINESeedSansTH_W_He.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../public/fonts/LINESeedSansTH_W_XBd.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-line-seed",
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
    <html
      lang="th"
      className={`${lineSeedSansTH.variable} font-sans scroll-smooth`}
    >
      <body className="font-sans antialiased min-h-screen bg-[#FBF9F5] text-[#1F1D1A] flex flex-col">
        {children}
      </body>
    </html>
  );
}
