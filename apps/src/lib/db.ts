import { PrismaClient } from "@prisma/client";

// Lead status enum
export type LeadStatus =
  | "NEW_LEAD"
  | "CONTACTED"
  | "SITE_SURVEY_SCHEDULED"
  | "WON"
  | "LOST";

export interface LeadRecord {
  id: string;
  refCode: string;
  customerName: string;
  phoneNumber: string;
  lineId: string | null;
  propertyType: string;
  areaSqm: number;
  selectedZones: string[];
  materialGrade: string;
  estimatedMin: number;
  estimatedMax: number;
  status: LeadStatus;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Global Prisma instance singleton for Next.js App Router
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Realistic initial seed leads for immediate testing across all stages (12 leads)
export const INITIAL_SEED_LEADS: LeadRecord[] = [
  {
    id: "lead-01",
    refCode: "#CS-2609-7K2X",
    customerName: "คุณกิตติศักดิ์ วรเมธ",
    phoneNumber: "0891234567",
    lineId: "kittisak.w",
    propertyType: "CONDO",
    areaSqm: 35,
    selectedZones: ["LIVING", "BEDROOM"],
    materialGrade: "PREMIUM",
    estimatedMin: 222750,
    estimatedMax: 267300,
    status: "NEW_LEAD",
    notes: "สนใจแบบห้องสไตล์ Japandi คอนโด Life Ladprao Valley",
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "lead-02",
    refCode: "#CS-2609-8M4P",
    customerName: "คุณณภัทร สิริโชค",
    phoneNumber: "0819876543",
    lineId: "naphat_s",
    propertyType: "TOWNHOME",
    areaSqm: 75,
    selectedZones: ["LIVING", "BEDROOM", "KITCHEN", "SYSTEM"],
    materialGrade: "LUXURY",
    estimatedMin: 432630,
    estimatedMax: 519156,
    status: "CONTACTED",
    notes: "โทรคุยเบื้องต้นแล้ว นัดส่ง Moodboard สไตล์โมเดิร์นคลาสสิกพรุ่งนี้",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "lead-03",
    refCode: "#CS-2609-3W9R",
    customerName: "คุณธนพร จินดาพงศ์",
    phoneNumber: "0863456789",
    lineId: "tanaporn_j",
    propertyType: "HOUSE",
    areaSqm: 160,
    selectedZones: ["LIVING", "BEDROOM", "KITCHEN"],
    materialGrade: "LUXURY",
    estimatedMin: 356400,
    estimatedMax: 427680,
    status: "SITE_SURVEY_SCHEDULED",
    notes: "นัดหมายทีมดีไซเนอร์เข้าวัดพื้นที่จริง วันเสาร์นี้ 10:30 น. Centro บางนา",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
  },
  {
    id: "lead-04",
    refCode: "#CS-2609-5D8T",
    customerName: "คุณปิยะวัฒน์ เจริญสุข",
    phoneNumber: "0845558888",
    lineId: null,
    propertyType: "CONDO",
    areaSqm: 45,
    selectedZones: ["LIVING", "BEDROOM", "SYSTEM"],
    materialGrade: "PREMIUM",
    estimatedMin: 228000,
    estimatedMax: 273600,
    status: "WON",
    notes: "เซ็นสัญญาและชำระมัดจำงวดแรกเรียบร้อย เริ่มผลิตงานไม้ที่โรงงาน",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: "lead-05",
    refCode: "#CS-2609-9Z2L",
    customerName: "คุณวรัญญา สุวรรณ",
    phoneNumber: "0823334444",
    lineId: "waranya_sw",
    propertyType: "TOWNHOME",
    areaSqm: 65,
    selectedZones: ["LIVING"],
    materialGrade: "STANDARD",
    estimatedMin: 120000,
    estimatedMax: 144000,
    status: "LOST",
    notes: "ลูกค้าแจ้งว่าโครงการคอนโดเลื่อนรับโอนห้องไปปีหน้า ขอยกเลิกนัดหมายก่อน",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96), // 4 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
  },
  {
    id: "lead-06",
    refCode: "#CS-2609-2B7V",
    customerName: "คุณชานนท์ เมธาพิริยะ",
    phoneNumber: "0852221199",
    lineId: "chanon_m",
    propertyType: "CONDO",
    areaSqm: 52,
    selectedZones: ["LIVING", "BEDROOM", "KITCHEN"],
    materialGrade: "LUXURY",
    estimatedMin: 327060,
    estimatedMax: 392472,
    status: "NEW_LEAD",
    notes: "คอนโด Whizdom The Forestias เพิ่งรับมอบห้อง สนใจงานไม้โอ๊คธรรมชาติ",
    createdAt: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 45),
  },
  {
    id: "lead-07",
    refCode: "#CS-2609-4J8H",
    customerName: "คุณมัณฑนา เอกวิจิตร์",
    phoneNumber: "0876543210",
    lineId: "manthana.e",
    propertyType: "HOUSE",
    areaSqm: 220,
    selectedZones: ["LIVING", "BEDROOM", "KITCHEN", "SYSTEM"],
    materialGrade: "LUXURY",
    estimatedMin: 504600,
    estimatedMax: 605520,
    status: "NEW_LEAD",
    notes: "บ้านเดี่ยวโครงการ Mantana บางนา-กม.7 ต้องการทำ Walk-in Closet ขนาดใหญ่",
    createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: "lead-08",
    refCode: "#CS-2609-6Q3W",
    customerName: "คุณอัครเดช รัตนพาณิชย์",
    phoneNumber: "0839998877",
    lineId: "akkaradech_r",
    propertyType: "TOWNHOME",
    areaSqm: 90,
    selectedZones: ["LIVING", "BEDROOM"],
    materialGrade: "PREMIUM",
    estimatedMin: 286000,
    estimatedMax: 343200,
    status: "CONTACTED",
    notes: "พูดคุยผ่านโทรศัพท์แล้ว ส่งแคตตาล็อกวัสดุและตัวอย่างลิ้นชัก Soft-close",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
  },
  {
    id: "lead-09",
    refCode: "#CS-2609-8C5N",
    customerName: "คุณพิมมาดา วัฒนโกวิท",
    phoneNumber: "0898887766",
    lineId: "pimmada_w",
    propertyType: "CONDO",
    areaSqm: 30,
    selectedZones: ["LIVING", "BEDROOM"],
    materialGrade: "STANDARD",
    estimatedMin: 180000,
    estimatedMax: 216000,
    status: "CONTACTED",
    notes: "คอนโดปล่อยเช่า Ashton Asoke ขอไอเดียเตียงพับและตู้เสื้อผ้าประหยัดพื้นที่",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
  },
  {
    id: "lead-10",
    refCode: "#CS-2609-1F4Y",
    customerName: "คุณเกรียงไกร ลิขิตพงษ์",
    phoneNumber: "0814443322",
    lineId: "kriangkrai_l",
    propertyType: "TOWNHOME",
    areaSqm: 110,
    selectedZones: ["LIVING", "BEDROOM", "KITCHEN"],
    materialGrade: "PREMIUM",
    estimatedMin: 371800,
    estimatedMax: 446160,
    status: "SITE_SURVEY_SCHEDULED",
    notes: "ยืนยันวันนัดหมายสำรวจหน้างาน วันอาทิตย์บ่าย 14:00 น. นำตัวอย่างหินควอทซ์ไปด้วย",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36), // 1.5 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 18),
  },
  {
    id: "lead-11",
    refCode: "#CS-2609-7P9K",
    customerName: "คุณศิริพร บุญญาภิรมย์",
    phoneNumber: "0867776655",
    lineId: "siriporn_b",
    propertyType: "HOUSE",
    areaSqm: 185,
    selectedZones: ["LIVING", "BEDROOM", "KITCHEN", "SYSTEM"],
    materialGrade: "LUXURY",
    estimatedMin: 504600,
    estimatedMax: 605520,
    status: "WON",
    notes: "อนุมัติ 3D Final Design เรียบร้อย กำหนดการเข้าติดตั้งหน้างานเดือนหน้า",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120), // 5 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
  },
  {
    id: "lead-12",
    refCode: "#CS-2609-3T6D",
    customerName: "คุณสุรเชษฐ์ พิทักษ์ไทย",
    phoneNumber: "0801112233",
    lineId: null,
    propertyType: "CONDO",
    areaSqm: 28,
    selectedZones: ["LIVING"],
    materialGrade: "STANDARD",
    estimatedMin: 120000,
    estimatedMax: 144000,
    status: "LOST",
    notes: "งบประมาณไม่พอ ลูกค้าตัดสินใจซื้อเฟอร์นิเจอร์ลอยตัวสำเร็จรูปแทน",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 140), // ~6 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
  },
];

// In-memory store fallback when DATABASE_URL is not set
const memoryLeads = new Map<string, LeadRecord>(
  INITIAL_SEED_LEADS.map((l) => [l.id, { ...l }]),
);

export const db = {
  lead: {
    async findMany(args?: {
      where?: {
        status?: LeadStatus;
        OR?: Array<{
          phoneNumber?: { contains: string };
          refCode?: { contains: string };
          customerName?: { contains: string };
        }>;
      };
      orderBy?: { createdAt: "asc" | "desc" };
    }): Promise<LeadRecord[]> {
      if (process.env.DATABASE_URL) {
        try {
          const leads = await prisma.lead.findMany({
            where: args?.where as any,
            orderBy: args?.orderBy as any,
          });
          return leads.map((l) => ({
            ...l,
            selectedZones: l.selectedZones as string[],
          }));
        } catch (e) {
          console.warn("[db] Postgres query fallback to memory store:", e);
        }
      }

      let results = Array.from(memoryLeads.values());

      if (args?.where?.status) {
        results = results.filter((l) => l.status === args.where?.status);
      }

      if (args?.where?.OR && args.where.OR.length > 0) {
        results = results.filter((l) => {
          return args.where!.OR!.some((condition) => {
            if (condition.phoneNumber?.contains) {
              return l.phoneNumber.includes(condition.phoneNumber.contains);
            }
            if (condition.refCode?.contains) {
              return l.refCode
                .toLowerCase()
                .includes(condition.refCode.contains.toLowerCase());
            }
            if (condition.customerName?.contains) {
              return l.customerName
                .toLowerCase()
                .includes(condition.customerName.contains.toLowerCase());
            }
            return false;
          });
        });
      }

      results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      return results;
    },

    async findUnique(args: {
      where: { id?: string; refCode?: string };
    }): Promise<LeadRecord | null> {
      if (process.env.DATABASE_URL) {
        try {
          const lead = await prisma.lead.findUnique({
            where: args.where as any,
          });
          if (lead) {
            return {
              ...lead,
              selectedZones: lead.selectedZones as string[],
            };
          }
          return null;
        } catch (e) {
          console.warn("[db] Postgres findUnique fallback to memory store:", e);
        }
      }

      if (args.where.id) {
        return memoryLeads.get(args.where.id) ?? null;
      }
      if (args.where.refCode) {
        const found = Array.from(memoryLeads.values()).find(
          (l) =>
            l.refCode.toLowerCase() === args.where.refCode?.toLowerCase() ||
            l.refCode.replace("#", "").toLowerCase() ===
              args.where.refCode?.replace("#", "").toLowerCase(),
        );
        return found ?? null;
      }
      return null;
    },

    async create(args: {
      data: Omit<
        LeadRecord,
        "id" | "createdAt" | "updatedAt" | "status" | "notes"
      > & {
        status?: LeadStatus;
        notes?: string | null;
      };
    }): Promise<LeadRecord> {
      const now = new Date();
      const id = `lead-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const newLead: LeadRecord = {
        id,
        refCode: args.data.refCode,
        customerName: args.data.customerName,
        phoneNumber: args.data.phoneNumber,
        lineId: args.data.lineId || null,
        propertyType: args.data.propertyType,
        areaSqm: args.data.areaSqm,
        selectedZones: args.data.selectedZones,
        materialGrade: args.data.materialGrade,
        estimatedMin: args.data.estimatedMin,
        estimatedMax: args.data.estimatedMax,
        status: args.data.status || "NEW_LEAD",
        notes: args.data.notes || null,
        createdAt: now,
        updatedAt: now,
      };

      if (process.env.DATABASE_URL) {
        try {
          const created = await prisma.lead.create({
            data: {
              refCode: newLead.refCode,
              customerName: newLead.customerName,
              phoneNumber: newLead.phoneNumber,
              lineId: newLead.lineId,
              propertyType: newLead.propertyType,
              areaSqm: newLead.areaSqm,
              selectedZones: newLead.selectedZones,
              materialGrade: newLead.materialGrade,
              estimatedMin: newLead.estimatedMin,
              estimatedMax: newLead.estimatedMax,
              status: newLead.status,
              notes: newLead.notes,
            },
          });
          return {
            ...created,
            selectedZones: created.selectedZones as string[],
          };
        } catch (e) {
          console.warn("[db] Postgres create fallback to memory store:", e);
        }
      }

      memoryLeads.set(id, newLead);
      return newLead;
    },

    async update(args: {
      where: { id: string };
      data: Partial<LeadRecord>;
    }): Promise<LeadRecord> {
      if (process.env.DATABASE_URL) {
        try {
          const updated = await prisma.lead.update({
            where: { id: args.where.id },
            data: args.data as any,
          });
          return {
            ...updated,
            selectedZones: updated.selectedZones as string[],
          };
        } catch (e) {
          console.warn("[db] Postgres update fallback to memory store:", e);
        }
      }

      const existing = memoryLeads.get(args.where.id);
      if (!existing) {
        throw new Error(`Lead ${args.where.id} not found`);
      }
      const updated: LeadRecord = {
        ...existing,
        ...args.data,
        updatedAt: new Date(),
      };
      memoryLeads.set(args.where.id, updated);
      return updated;
    },
  },
};
