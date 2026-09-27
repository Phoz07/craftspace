export interface PortfolioProject {
  id: string;
  name: string;
  location: string;
  propertyType: "CONDO" | "TOWNHOME" | "HOUSE";
  propertyLabel: string;
  style: "JAPANDI" | "LUXURY" | "CLASSIC";
  styleLabel: string;
  areaSqm: number;
  durationDays: number;
  actualBudget: number;
  highlight: string;
  imageUrl: string;
}

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: "the-monument-thonglor",
    name: "The Monument Thonglor",
    location: "ทองหล่อ, กรุงเทพฯ",
    propertyType: "CONDO",
    propertyLabel: "คอนโดมิเนียม",
    style: "LUXURY",
    styleLabel: "Modern Luxury",
    areaSqm: 45,
    durationDays: 35,
    actualBudget: 480_000,
    highlight:
      "ตู้กระจกชาทองกรอบอลูมิเนียมบางเฉียบ ท็อปหินควอทซ์ขาว และซ่อนไฟ Linear LED อบอุ่น",
    imageUrl:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "life-ladprao-valley",
    name: "Life Ladprao Valley",
    location: "ห้าแยกลาดพร้าว, กรุงเทพฯ",
    propertyType: "CONDO",
    propertyLabel: "คอนโดมิเนียม",
    style: "JAPANDI",
    styleLabel: "Minimal Japandi",
    areaSqm: 35,
    durationDays: 28,
    actualBudget: 320_000,
    highlight:
      "งานไม้โอ๊คเซาะร่อง เตียงยกพื้นพร้อมช่องเก็บของอเนกประสงค์ และตู้รองเท้าพาร์ทิชันกั้นโซน",
    imageUrl:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "grand-pleno-phahol",
    name: "Grand Pleno Phahol-Watcharapol",
    location: "วัชรพล, กรุงเทพฯ",
    propertyType: "TOWNHOME",
    propertyLabel: "ทาวน์โฮม",
    style: "JAPANDI",
    styleLabel: "Minimal Japandi",
    areaSqm: 75,
    durationDays: 45,
    actualBudget: 650_000,
    highlight:
      "พาร์ทิชันระแนงไม้กั้นโซนทำงาน เคาน์เตอร์ครัวตัวแอล และผนังทีวีมุมโค้งมนสบายตา",
    imageUrl:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "town-avenue-srinakarin",
    name: "Town Avenue Srinakarin",
    location: "ศรีนครินทร์, กรุงเทพฯ",
    propertyType: "TOWNHOME",
    propertyLabel: "ทาวน์โฮม",
    style: "CLASSIC",
    styleLabel: "Contemporary Classic",
    areaSqm: 80,
    durationDays: 50,
    actualBudget: 790_000,
    highlight:
      "ตู้เสื้อผ้า Walk-in คิ้วบัวสไตล์โมเดิร์นคลาสสิก พร้อมแพนทรี่หินสังเคราะห์กันรอย",
    imageUrl:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "centro-bangna",
    name: "Centro Bangna",
    location: "บางนา, สมุทรปราการ",
    propertyType: "HOUSE",
    propertyLabel: "บ้านเดี่ยว",
    style: "LUXURY",
    styleLabel: "Modern Luxury",
    areaSqm: 160,
    durationDays: 60,
    actualBudget: 1_350_000,
    highlight:
      "โถง Double Volume กรุผนังหินอ่อนลายแรร์ ตู้โชว์ไวน์แบบบิลท์อิน และ Master Suite หรูหรา",
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "setthasiri-krungthep-kreetha",
    name: "Setthasiri Krungthep Kreetha",
    location: "กรุงเทพกรีฑา, กรุงเทพฯ",
    propertyType: "HOUSE",
    propertyLabel: "บ้านเดี่ยว",
    style: "JAPANDI",
    styleLabel: "Japandi Luxury",
    areaSqm: 180,
    durationDays: 65,
    actualBudget: 1_580_000,
    highlight:
      "ผสมผสานไม้แอชแท้กับสแตนเลสคอปเปอร์ ตู้เสื้อผ้า Island กลางห้อง และฟังก์ชันบิวท์อินครบทั้ง 3 โซนหลัก",
    imageUrl:
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
  },
];
