import { db } from "@/lib/db";

// تابع‌های خواندن داده از دیتابیس برای صفحه عمومی سوپر اپ

export async function getBanners(position?: string) {
  const where: Record<string, unknown> = { isActive: true };
  if (position) where.position = position;
  const banners = await db.banner.findMany({
    where,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return banners;
}

export async function getNews() {
  return await db.newsItem.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
  });
}

export type PublicProduct = {
  id: string;
  name: string;
  brand: string;
  price: string;
  originalPrice?: string;
  discount?: number;
  emoji: string;
  rating: number;
  reviewCount?: string;
  soldCount: string;
  installment: string;
  bg: string;
  category: string;
  categoryLabel: string;
  description?: string;
  features: string[];
  specs: { label: string; value: string }[];
  inStock?: boolean;
  freeShipping?: boolean;
};

export async function getProducts(): Promise<PublicProduct[]> {
  const products = await db.product.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
  });
  return products.map((p) => ({
    id: p.id,
    name: p.name,
    brand: p.brand,
    price: p.price.toLocaleString("fa-IR") + " ت",
    originalPrice: p.originalPrice
      ? p.originalPrice.toLocaleString("fa-IR") + " ت"
      : undefined,
    discount: p.discount ?? undefined,
    emoji: p.emoji,
    rating: p.rating,
    reviewCount: p.reviewCount ? p.reviewCount.toLocaleString("fa-IR") : undefined,
    soldCount: p.soldCount.toLocaleString("fa-IR"),
    installment: p.installment,
    bg: p.bg,
    category: p.category,
    categoryLabel: p.categoryLabel,
    description: p.description ?? undefined,
    features: p.features ? JSON.parse(p.features) : [],
    specs: p.specs ? JSON.parse(p.specs) : [],
    inStock: p.inStock,
    freeShipping: p.freeShipping,
  }));
}

export async function getProductById(id: string): Promise<PublicProduct | null> {
  const p = await db.product.findUnique({ where: { id } });
  if (!p) return null;
  return {
    id: p.id,
    name: p.name,
    brand: p.brand,
    price: p.price.toLocaleString("fa-IR") + " ت",
    originalPrice: p.originalPrice
      ? p.originalPrice.toLocaleString("fa-IR") + " ت"
      : undefined,
    discount: p.discount ?? undefined,
    emoji: p.emoji,
    rating: p.rating,
    reviewCount: p.reviewCount ? p.reviewCount.toLocaleString("fa-IR") : undefined,
    soldCount: p.soldCount.toLocaleString("fa-IR"),
    installment: p.installment,
    bg: p.bg,
    category: p.category,
    categoryLabel: p.categoryLabel,
    description: p.description ?? undefined,
    features: p.features ? JSON.parse(p.features) : [],
    specs: p.specs ? JSON.parse(p.specs) : [],
    inStock: p.inStock,
    freeShipping: p.freeShipping,
  };
}

// --- Properties ---
export async function getProperties() {
  const items = await db.property.findMany({
    where: { isPublished: true, status: "approved" },
    orderBy: { createdAt: "desc" },
  });
  return items.map((p) => ({
    id: p.id,
    title: p.title,
    type: p.type as "apartment" | "villa" | "land" | "shop" | "suite",
    typeLabel: p.typeLabel,
    deal: p.deal as "sale" | "rent",
    dealLabel: p.dealLabel,
    area: p.area,
    rooms: p.rooms,
    floor: p.floor ?? undefined,
    totalFloors: p.totalFloors ?? undefined,
    age: p.age,
    price: p.price,
    rent: p.rent ?? undefined,
    location: p.location,
    district: p.district,
    timeAgo: p.timeAgo,
    emoji: p.emoji,
    badgeColor: getPropertyBadgeColor(p.type, p.deal),
    features: p.features ? JSON.parse(p.features) : [],
    hasParking: p.hasParking,
    hasElevator: p.hasElevator,
    hasBalcony: p.hasBalcony,
  }));
}

function getPropertyBadgeColor(type: string, deal: string): string {
  if (deal === "rent") {
    if (type === "apartment") return "bg-sky-50 text-sky-700";
    if (type === "villa") return "bg-emerald-50 text-emerald-700";
    if (type === "suite") return "bg-purple-50 text-purple-700";
    return "bg-sky-50 text-sky-700";
  }
  if (type === "apartment") return "bg-teal-50 text-teal-700";
  if (type === "villa") return "bg-emerald-50 text-emerald-700";
  if (type === "land") return "bg-lime-50 text-lime-700";
  if (type === "shop") return "bg-amber-50 text-amber-700";
  return "bg-teal-50 text-teal-700";
}

// --- Lost & Found ---
export async function getLostFound() {
  const items = await db.lostFoundItem.findMany({
    where: { isPublished: true, status_admin: "approved" },
    orderBy: { createdAt: "desc" },
  });
  return items.map((it) => ({
    id: it.id,
    title: it.title,
    status: it.status as "lost" | "found",
    category: it.category,
    categoryLabel: it.categoryLabel,
    emoji: it.emoji,
    description: it.description,
    location: it.location,
    district: it.district,
    date: it.date,
    timeAgo: it.timeAgo,
    reward: it.reward ?? undefined,
    contactName: it.contactName,
    contactType: it.contactType as "owner" | "finder",
    tags: it.tags ? JSON.parse(it.tags) : [],
    badgeColor:
      it.status === "lost"
        ? "bg-rose-50 text-rose-700"
        : "bg-emerald-50 text-emerald-700",
  }));
}

// --- Restaurants ---
export async function getRestaurants() {
  const items = await db.restaurant.findMany({
    where: { isPublished: true },
    orderBy: [{ featured: "desc" }, { rating: "desc" }],
  });
  return items.map((r) => ({
    id: r.id,
    name: r.name,
    category: r.category,
    categoryEmoji: r.categoryEmoji,
    coverGradient: r.coverGradient,
    description: r.description,
    rating: r.rating,
    reviewCount: r.reviewCount,
    deliveryTime: r.deliveryTime,
    deliveryFee: r.deliveryFee,
    minOrder: r.minOrder,
    tags: r.tags ? JSON.parse(r.tags) : [],
    isOpen: r.isOpen,
    featured: r.featured,
    discount: r.discount ?? undefined,
  }));
}

// --- Sama 137 ---
export async function getSama137Requests() {
  const items = await db.sama137Request.findMany({
    where: { isPublished: true },
    orderBy: { created_at: "desc" },
  });
  return items.map((r) => ({
    id: r.id,
    trackingCode: r.trackingCode,
    title: r.title,
    category: r.category,
    categoryLabel: r.categoryLabel,
    emoji: r.emoji,
    description: r.description,
    address: r.address,
    district: r.district,
    status: r.status,
    statusLabel: r.statusLabel,
    priority: r.priority,
    priorityLabel: r.priorityLabel,
    createdAt: r.createdAt,
    timeAgo: r.timeAgo,
    updatedAt: r.updatedAt,
    attachments: r.attachments ? JSON.parse(r.attachments) : [],
    timeline: r.timeline ? JSON.parse(r.timeline) : [],
    referenceUnit: r.referenceUnit ?? undefined,
    assignedTo: r.assignedTo ?? undefined,
    badgeColor: getSamaStatusColor(r.status),
  }));
}

function getSamaStatusColor(status: string): string {
  switch (status) {
    case "pending":
      return "bg-slate-100 text-slate-700";
    case "in-progress":
      return "bg-amber-50 text-amber-700";
    case "dispatched":
      return "bg-sky-50 text-sky-700";
    case "resolved":
      return "bg-emerald-50 text-emerald-700";
    case "rejected":
      return "bg-rose-50 text-rose-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}
