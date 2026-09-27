import {
  Building2,
  LayoutGrid,
  Home,
  Phone,
  MessageCircle,
  ShoppingCart,
  Gamepad2,
  Map,
  PackageSearch,
  Trophy,
  Wallet,
  Utensils,
  type LucideIcon,
} from "lucide-react";

export type ServiceItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  /** رنگ پشت آیکن (کلاس Tailwind) */
  iconBg: string;
  iconColor: string;
  /** نشان دست‌ساز برای برخی خدمات */
  badge?: string;
};

export const services: ServiceItem[] = [
  {
    id: "shahrdari",
    label: "شهرداری",
    icon: Building2,
    iconBg: "bg-teal-50",
    iconColor: "text-teal-700",
  },
  {
    id: "niazmandiha",
    label: "نیازمندی‌ها",
    icon: LayoutGrid,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-700",
    badge: "۲۴۰",
  },
  {
    id: "amlak",
    label: "املاک",
    icon: Home,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-700",
  },
  {
    id: "sama-137",
    label: "سامانه ۱۳۷",
    icon: Phone,
    iconBg: "bg-rose-50",
    iconColor: "text-rose-700",
    badge: "۱۳۷",
  },
  {
    id: "payamresan",
    label: "پیامرسان",
    icon: MessageCircle,
    iconBg: "bg-sky-50",
    iconColor: "text-sky-700",
  },
  {
    id: "foroushgah",
    label: "فروشگاه",
    icon: ShoppingCart,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-700",
  },
  {
    id: "sargarmi",
    label: "سرگرمی",
    icon: Gamepad2,
    iconBg: "bg-pink-50",
    iconColor: "text-pink-700",
  },
  {
    id: "naghshe-shahr",
    label: "نقشه شهر",
    icon: Map,
    iconBg: "bg-cyan-50",
    iconColor: "text-cyan-700",
  },
  {
    id: "ashyae-gomshode",
    label: "اشیاء گمشده",
    icon: PackageSearch,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-700",
  },
  {
    id: "mosabeghe",
    label: "مسابقه",
    icon: Trophy,
    iconBg: "bg-yellow-50",
    iconColor: "text-yellow-700",
    badge: "نو",
  },
  {
    id: "kharid-geshti",
    label: "خرید قسطی",
    icon: Wallet,
    iconBg: "bg-lime-50",
    iconColor: "text-lime-700",
  },
  {
    id: "sefare-ghaza",
    label: "سفارش غذا",
    icon: Utensils,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-700",
    badge: "نو",
  },
];

export type CarouselSlide = {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  gradient: string;
  emoji: string;
};

export const carouselSlides: CarouselSlide[] = [
  {
    id: "s1",
    title: "پرداخت آنلاین عوارض شهرداری",
    subtitle: "بدون مراجعه حضوری، در کمتر از یک دقیقه",
    cta: "پرداخت",
    gradient: "from-teal-600 via-emerald-600 to-green-700",
    emoji: "🏛️",
  },
  {
    id: "s2",
    title: "مسابقه بزرگ شبکه قدس",
    subtitle: "تا سقف ۵۰ میلیون ریال جایزه، همین حالا شرکت کنید",
    cta: "شرکت در مسابقه",
    gradient: "from-amber-500 via-orange-500 to-rose-500",
    emoji: "🏆",
  },
  {
    id: "s3",
    title: "خرید قسطی لوازم خانگی",
    subtitle: "تا ۱۲ ماه بدون پیش‌پرداخت، فقط در فروشگاه قدس",
    cta: "خرید",
    gradient: "from-purple-600 via-fuchsia-600 to-pink-600",
    emoji: "🛍️",
  },
  {
    id: "s4",
    title: "سامانه ۱۳۷ — درخواست خدمات شهری",
    subtitle: "رفع معابر، روشنایی، فضای سبز و زباله، ۲۴ ساعته",
    cta: "ثبت درخواست",
    gradient: "from-sky-600 via-cyan-600 to-blue-700",
    emoji: "📞",
  },
];

export type ClassifiedItem = {
  id: string;
  title: string;
  category: string;
  price: string;
  location: string;
  timeAgo: string;
  emoji: string;
  badgeColor: string;
};

export const classifieds: ClassifiedItem[] = [
  {
    id: "c1",
    title: "کپسول گاز خانگی ۱۰ کیلویی",
    category: "لوازم خانگی",
    price: "۱٫۸۵۰٫۰۰۰ ت",
    location: "منطقه ۳، قدس",
    timeAgo: "۲ ساعت پیش",
    emoji: "🔥",
    badgeColor: "bg-rose-50 text-rose-700",
  },
  {
    id: "c2",
    title: "دوچرخه کوهستان ۲۱ سرعته",
    category: "ورزشی",
    price: "۶٫۲۰۰٫۰۰۰ ت",
    location: "بلوار امین، قدس",
    timeAgo: "۵ ساعت پیش",
    emoji: "🚲",
    badgeColor: "bg-emerald-50 text-emerald-700",
  },
  {
    id: "c3",
    title: "گوشی موبایل سامسونگ A55",
    category: "موبایل",
    price: "۱۸٫۹۰۰٫۰۰۰ ت",
    location: "خیابان امام، قدس",
    timeAgo: "دیروز",
    emoji: "📱",
    badgeColor: "bg-sky-50 text-sky-700",
  },
  {
    id: "c4",
    title: "یخچال فریزر دو درب ساید",
    category: "لوازم خانگی",
    price: "۴۲٫۰۰۰٫۰۰۰ ت",
    location: "شهرک قدس",
    timeAgo: "۳ روز پیش",
    emoji: "❄️",
    badgeColor: "bg-teal-50 text-teal-700",
  },
  {
    id: "c5",
    title: "موتور گازی هوندا",
    category: "وسایل نقلیه",
    price: "۳۲٫۵۰۰٫۰۰۰ ت",
    location: "میدان قدس",
    timeAgo: "۴ روز پیش",
    emoji: "🏍️",
    badgeColor: "bg-orange-50 text-orange-700",
  },
  {
    id: "c6",
    title: "کنسول بازی پلی‌استیشن ۵",
    category: "سرگرمی",
    price: "۵۸٫۰۰۰٫۰۰۰ ت",
    location: "منطقه ۱، قدس",
    timeAgo: "یک هفته پیش",
    emoji: "🎮",
    badgeColor: "bg-purple-50 text-purple-700",
  },
];

export type NewsItem = {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  timeAgo: string;
  readTime: string;
  emoji: string;
  accent: string;
};

export const news: NewsItem[] = [
  {
    id: "n1",
    title: "افتتاح فاز جدید مترو قدس در هفته آینده",
    excerpt:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون.",
    body: "",
    category: "شهری",
    timeAgo: "۲ ساعت پیش",
    readTime: "۳ دقیقه",
    emoji: "🚇",
    accent: "bg-teal-500",
  },
  {
    id: "n2",
    title: "آغاز پروژه بازآفرینی فضای سبز پارک ملت",
    excerpt:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است.",
    body: "",
    category: "محیط زیست",
    timeAgo: "۵ ساعت پیش",
    readTime: "۲ دقیقه",
    emoji: "🌳",
    accent: "bg-emerald-500",
  },
  {
    id: "n3",
    title: "جشنواره فرهنگی روز قدس برگزار می‌شود",
    excerpt:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله.",
    body: "",
    category: "فرهنگی",
    timeAgo: "دیروز",
    readTime: "۴ دقیقه",
    emoji: "🎭",
    accent: "bg-amber-500",
  },
  {
    id: "n4",
    title: "برنامه‌ریزی نوبت‌بندی خدمات شهری در سامانه ۱۳۷",
    excerpt:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان.",
    body: "",
    category: "خدمات شهری",
    timeAgo: "۲ روز پیش",
    readTime: "۳ دقیقه",
    emoji: "📞",
    accent: "bg-sky-500",
  },
];

export type ProductItem = {
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
  category: StoreCategory;
  categoryLabel: string;
  description?: string;
  features?: string[];
  specs?: { label: string; value: string }[];
  inStock?: boolean;
  freeShipping?: boolean;
};

export type StoreCategory =
  | "appliances"
  | "kitchen"
  | "electronics"
  | "home-decor"
  | "cleaning";

export const storeCategories: {
  id: StoreCategory | "all";
  label: string;
  emoji: string;
}[] = [
  { id: "all", label: "همه", emoji: "📦" },
  { id: "appliances", label: "لوازم خانگی", emoji: "🏠" },
  { id: "kitchen", label: "آشپزخانه", emoji: "🍳" },
  { id: "electronics", label: "الکترونیک", emoji: "📱" },
  { id: "home-decor", label: "دکوراسیون", emoji: "🪑" },
  { id: "cleaning", label: "نظافت", emoji: "🧹" },
];

export const products: ProductItem[] = [
  {
    id: "p1",
    name: "ماشین لباسشویی ۸ کیلویی اینورتر",
    brand: "اسنوا",
    price: "۲۴٫۵۰۰٫۰۰۰ ت",
    originalPrice: "۲۸٫۰۰۰٫۰۰۰ ت",
    discount: 12,
    emoji: "🌀",
    rating: 4.7,
    reviewCount: "۲۴۰",
    soldCount: "۱٫۲k",
    installment: "۱۲ ماه قسطی",
    bg: "bg-teal-50",
    category: "appliances",
    categoryLabel: "لوازم خانگی",
    description:
      "ماشین لباسشویی ۸ کیلویی با موتور اینورتر کم‌مصرف و کم‌صدا، مجهز به ۱۲ برنامه شستشوی هوشمند. دارای کلاس انرژی A+++ و سیستم ضد چروکیدگی. مناسب خانواده‌های ۴ نفره.",
    features: [
      "موتور اینورتر کم‌صدا",
      "۱۲ برنامه شستشو",
      "کلاس انرژی A+++",
      "سیستم ضد چروک",
      "صفحه نمایش LED",
      "قفل کودک",
    ],
    specs: [
      { label: "ظرفیت", value: "۸ کیلوگرم" },
      { label: "سرعت چرخش", value: "۱۴۰۰ دور در دقیقه" },
      { label: "کلاس انرژی", value: "A+++" },
      { label: "برنامه‌ها", value: "۱۲ برنامه" },
      { label: "ابعاد", value: "۶۰×۶۰×۸۵ سانتی‌متر" },
      { label: "گارانتی", value: "۲۴ ماه" },
    ],
    inStock: true,
    freeShipping: true,
  },
  {
    id: "p2",
    name: "یخچال فریزر ساید‌بای‌ساید",
    brand: "پاکشوما",
    price: "۶۸٫۰۰۰٫۰۰۰ ت",
    originalPrice: "۷۵٫۰۰۰٫۰۰۰ ت",
    discount: 9,
    emoji: "❄️",
    rating: 4.8,
    reviewCount: "۱۸۰",
    soldCount: "۸۹۰",
    installment: "۲۴ ماه قسطی",
    bg: "bg-sky-50",
    category: "appliances",
    categoryLabel: "لوازم خانگی",
    description:
      "یخچال فریزر ساید‌بای‌ساید با ظرفیت ۶۰۰ لیتر، سیستم تبرید بدون برفک و تکنولوژی Plasma Cluster برای هوای تازه. دارای آبسردکن و یخ‌ساز اتوماتیک.",
    features: [
      "ظرفیت ۶۰۰ لیتر",
      "سیستم بدون برفک",
      "آبسردکن و یخ‌ساز",
      "Plasma Cluster",
      "ترموستات دیجیتال",
      "هشدار درِ باز",
    ],
    specs: [
      { label: "ظرفیت", value: "۶۰۰ لیتر" },
      { label: "نوع سیستم", value: "بدون برفک" },
      { label: "کلاس انرژی", value: "A++" },
      { label: "ابعاد", value: "۹۰×۷۵×۱۸۰ سانتی‌متر" },
      { label: "گارانتی", value: "۳۶ ماه" },
    ],
    inStock: true,
    freeShipping: true,
  },
  {
    id: "p3",
    name: "ماشین ظرفشویی ۱۲ نفره",
    brand: "ال‌جی",
    price: "۴۲٫۳۰۰٫۰۰۰ ت",
    emoji: "🍽️",
    rating: 4.6,
    reviewCount: "۹۸",
    soldCount: "۴۵۰",
    installment: "۱۸ ماه قسطی",
    bg: "bg-purple-50",
    category: "kitchen",
    categoryLabel: "آشپزخانه",
    description:
      "ماشین ظرفشویی ۱۲ نفره با تکنولوژی QuadWash شستشوی چهارگانه. دارای ۸ برنامه شستشو و حالت نیمه‌بار برای صرفه‌جویی در مصرف آب و برق.",
    features: [
      "ظرفیت ۱۲ نفره",
      "تکنولوژی QuadWash",
      "۸ برنامه شستشو",
      "حالت نیمه‌بار",
      "سیستم خشک‌کن",
      "کلاس انرژی A+",
    ],
    specs: [
      { label: "ظرفیت", value: "۱۲ نفر" },
      { label: "تعداد برنامه‌ها", value: "۸ برنامه" },
      { label: "کلاس انرژی", value: "A+" },
      { label: "مصرف آب", value: "۹ لیتر در هر شستشو" },
      { label: "ابعاد", value: "۶۰×۶۰×۸۵ سانتی‌متر" },
      { label: "گارانتی", value: "۲۴ ماه" },
    ],
    inStock: true,
    freeShipping: false,
  },
  {
    id: "p4",
    name: "جاروبرقی بی‌سیم ۲۰۰۰ وات",
    brand: "فیلیپس",
    price: "۱۵٫۸۰۰٫۰۰۰ ت",
    originalPrice: "۱۸٫۵۰۰٫۰۰۰ ت",
    discount: 14,
    emoji: "🧹",
    rating: 4.5,
    reviewCount: "۳۲۰",
    soldCount: "۲٫۸k",
    installment: "۶ ماه قسطی",
    bg: "bg-amber-50",
    category: "cleaning",
    categoryLabel: "نظافت",
    description:
      "جاروبرقی بی‌سیم با قدرت مکش ۲۰۰۰ وات، فیلتر HEPA قابل شستشو و باتری لیتیومی قابل تعویض. مناسب برای خانه‌های چندطبقه و اتومبیل.",
    features: [
      "قدرت مکش ۲۰۰۰ وات",
      "فیلتر HEPA قابل شستشو",
      "باتری لیتیومی",
      "وزن سبک ۲٫۵ کیلوگرم",
      "نور LED برای نقاط تاریک",
      "ضمانت ۲ ساله",
    ],
    specs: [
      { label: "قدرت مکش", value: "۲۰۰۰ وات" },
      { label: "زمان کار با باتری", value: "۴۵ دقیقه" },
      { label: "وزن", value: "۲٫۵ کیلوگرم" },
      { label: "فیلتر", value: "HEPA H13" },
      { label: "گارانتی", value: "۲۴ ماه" },
    ],
    inStock: true,
    freeShipping: true,
  },
  {
    id: "p5",
    name: "اجاق گاز صفحه‌ای ۵ شعله",
    brand: "پارس",
    price: "۱۹٫۲۰۰٫۰۰۰ ت",
    emoji: "🔥",
    rating: 4.4,
    reviewCount: "۱۵۰",
    soldCount: "۶۷۰",
    installment: "۱۲ ماه قسطی",
    bg: "bg-rose-50",
    category: "kitchen",
    categoryLabel: "آشپزخانه",
    description:
      "اجاق گاز صفحه‌ای ۵ شعله با طراحی شیشه‌ای، سیستم ایمنی ترموکوپل و شعله‌های با دیافراگم. دارای چراغ روشنایی و قابلمه‌چراغ.",
    features: [
      "۵ شعله با دیافراگم",
      "طراحی شیشه‌ای",
      "ترموکوپل ایمنی",
      "سیستم خودکار روشن‌کن",
      "صفحه شیشه‌ای مقاوم",
      "صفحه نمایش لمسی",
    ],
    specs: [
      { label: "تعداد شعله", value: "۵ عدد" },
      { label: "نوع صفحه", value: "شیشه temper" },
      { label: "سیستم ایمنی", value: "ترموکوپل" },
      { label: "ابعاد", value: "۹۰×۶۰ سانتی‌متر" },
      { label: "گارانتی", value: "۳۶ ماه" },
    ],
    inStock: true,
    freeShipping: false,
  },
  {
    id: "p6",
    name: "مایکروویو ۳۰ لیتری گریل",
    brand: "سامسونگ",
    price: "۱۳٫۶۰۰٫۰۰۰ ت",
    emoji: "🍲",
    rating: 4.6,
    reviewCount: "۲۱۰",
    soldCount: "۱٫۵k",
    installment: "۶ ماه قسطی",
    bg: "bg-emerald-50",
    category: "kitchen",
    categoryLabel: "آشپزخانه",
    description:
      "مایکروویو ۳۰ لیتری با قابلیت گریل و کانوکشن، ۱۰ سطح قدرت و ۱۵ برنامه پخت از پیش تنظیم‌شده. دارای سیستم ضدجرم و صفحه نمایش لمسی.",
    features: [
      "ظرفیت ۳۰ لیتر",
      "قابلیت گریل و کانوکشن",
      "۱۵ برنامه پخت",
      "سیستم ضدجرم",
      "صفحه لمسی",
      "قفل کودک",
    ],
    specs: [
      { label: "ظرفیت", value: "۳۰ لیتر" },
      { label: "توان", value: "۹۰۰ وات" },
      { label: "قابلیت‌ها", value: "گریل + کانوکشن" },
      { label: "تعداد برنامه‌ها", value: "۱۵ برنامه" },
      { label: "ابعاد", value: "۵۲×۴۸×۳۲ سانتی‌متر" },
      { label: "گارانتی", value: "۲۴ ماه" },
    ],
    inStock: true,
    freeShipping: true,
  },
];

/** داده‌های نمونه بخش املاک */

export type PropertyListing = {
  id: string;
  title: string;
  type: "apartment" | "villa" | "land" | "shop" | "suite";
  typeLabel: string;
  deal: "sale" | "rent";
  dealLabel: string;
  area: number; // متراژ
  rooms: number; // تعداد خواب (برای زمین/مغازه ۰)
  floor?: number;
  totalFloors?: number;
  age: number; // سال ساخت
  price: string; // قیمت کل (فروش) یا رهن
  rent?: string; // اجاره ماهانه (در حالت رهن‌واجاره)
  location: string;
  district: string;
  timeAgo: string;
  emoji: string;
  badgeColor: string;
  features: string[];
  hasParking: boolean;
  hasElevator: boolean;
  hasBalcony: boolean;
};

export const properties: PropertyListing[] = [
  // === فروش ===
  {
    id: "pr1",
    title: "آپارتمان نوساز ۸۵ متری با امکانات کامل",
    type: "apartment",
    typeLabel: "آپارتمان",
    deal: "sale",
    dealLabel: "فروش",
    area: 85,
    rooms: 2,
    floor: 3,
    totalFloors: 6,
    age: 1,
    price: "۸٫۵ میلیارد ت",
    location: "منطقه ۳، قدس",
    district: "شهرک قدس",
    timeAgo: "۲ ساعت پیش",
    emoji: "🏢",
    badgeColor: "bg-teal-50 text-teal-700",
    features: ["انباری", "پارکینگ", "آسانسور", "بالکن"],
    hasParking: true,
    hasElevator: true,
    hasBalcony: true,
  },
  {
    id: "pr2",
    title: "ویلای زیبا ۲۲۰ متری با حیاط بزرگ",
    type: "villa",
    typeLabel: "ویلا",
    deal: "sale",
    dealLabel: "فروش",
    area: 220,
    rooms: 4,
    totalFloors: 2,
    age: 3,
    price: "۲۸ میلیارد ت",
    location: "شهرک قدس، بلوار امین",
    district: "شهرک قدس",
    timeAgo: "۵ ساعت پیش",
    emoji: "🏡",
    badgeColor: "bg-emerald-50 text-emerald-700",
    features: ["حیاط بزرگ", "پارکینگ دوگانه", "سیستم امنیتی", "کابینت چوب"],
    hasParking: true,
    hasElevator: false,
    hasBalcony: true,
  },
  {
    id: "pr3",
    title: "زمین ۳۰۰ متری تجاری-ساختمانی",
    type: "land",
    typeLabel: "زمین",
    deal: "sale",
    dealLabel: "فروش",
    area: 300,
    rooms: 0,
    age: 0,
    price: "۱۵ میلیارد ت",
    location: "بلوار امین، قدس",
    district: "بلوار امین",
    timeAgo: "دیروز",
    emoji: "🌳",
    badgeColor: "bg-lime-50 text-lime-700",
    features: ["سند تک‌برگ", "عرض مناسب", "کاربری تجاری", "آب و برق"],
    hasParking: false,
    hasElevator: false,
    hasBalcony: false,
  },
  {
    id: "pr4",
    title: "مغازه ۴۵ متری در بهترین نقطه تجاری",
    type: "shop",
    typeLabel: "مغازه",
    deal: "sale",
    dealLabel: "فروش",
    area: 45,
    rooms: 0,
    floor: 1,
    age: 5,
    price: "۶ میلیارد ت",
    location: "میدان قدس، خیابان امام",
    district: "مرکز شهر",
    timeAgo: "۲ روز پیش",
    emoji: "🏪",
    badgeColor: "bg-amber-50 text-amber-700",
    features: ["لوکیشن عالی", "سند دار", "پاساژ پرتردد", "ویترین بزرگ"],
    hasParking: false,
    hasElevator: false,
    hasBalcony: false,
  },
  {
    id: "pr5",
    title: "آپارتمان ۱۱۰ متری ۳ خواب با نوسازی",
    type: "apartment",
    typeLabel: "آپارتمان",
    deal: "sale",
    dealLabel: "فروش",
    area: 110,
    rooms: 3,
    floor: 2,
    totalFloors: 8,
    age: 2,
    price: "۱۱ میلیارد ت",
    location: "بلوار مطهری، قدس",
    district: "بلوار مطهری",
    timeAgo: "۳ روز پیش",
    emoji: "🏢",
    badgeColor: "bg-teal-50 text-teal-700",
    features: ["پارکینگ", "آسانسور", "انباری", "لابی"],
    hasParking: true,
    hasElevator: true,
    hasBalcony: true,
  },

  // === رهن و اجاره ===
  {
    id: "pr6",
    title: "آپارتمان ۷۵ متری ۲ خواب، نورگیر",
    type: "apartment",
    typeLabel: "آپارتمان",
    deal: "rent",
    dealLabel: "رهن و اجاره",
    area: 75,
    rooms: 2,
    floor: 4,
    totalFloors: 6,
    age: 4,
    price: "۳۰۰ میلیون ت",
    rent: "۱۵ میلیون ت ماهانه",
    location: "منطقه ۱، قدس",
    district: "منطقه ۱",
    timeAgo: "۱ ساعت پیش",
    emoji: "🏢",
    badgeColor: "bg-sky-50 text-sky-700",
    features: ["آسانسور", "پارکینگ", "انباری", "بالکن"],
    hasParking: true,
    hasElevator: true,
    hasBalcony: true,
  },
  {
    id: "pr7",
    title: "سوئیت مبله ۵۰ متری نوساز",
    type: "suite",
    typeLabel: "سوئیت",
    deal: "rent",
    dealLabel: "رهن و اجاره",
    area: 50,
    rooms: 1,
    floor: 5,
    totalFloors: 8,
    age: 1,
    price: "۲۵۰ میلیون ت",
    rent: "۱۲ میلیون ت ماهانه",
    location: "شهرک قدس",
    district: "شهرک قدس",
    timeAgo: "۴ ساعت پیش",
    emoji: "🛏️",
    badgeColor: "bg-purple-50 text-purple-700",
    features: ["مبله", "آسانسور", "اینترنت", "پارکینگ"],
    hasParking: true,
    hasElevator: true,
    hasBalcony: false,
  },
  {
    id: "pr8",
    title: "ویلای ۱۸۰ متری با حیاط و پارکینگ",
    type: "villa",
    typeLabel: "ویلا",
    deal: "rent",
    dealLabel: "رهن و اجاره",
    area: 180,
    rooms: 3,
    totalFloors: 2,
    age: 6,
    price: "۸۰۰ میلیون ت",
    rent: "۳۵ میلیون ت ماهانه",
    location: "بلوار امین، قدس",
    district: "بلوار امین",
    timeAgo: "دیروز",
    emoji: "🏡",
    badgeColor: "bg-emerald-50 text-emerald-700",
    features: ["حیاط بزرگ", "پارکینگ دوگانه", "انباری", "سیستم گرمایش مرکزی"],
    hasParking: true,
    hasElevator: false,
    hasBalcony: true,
  },
  {
    id: "pr9",
    title: "آپارتمان ۹۵ متری ۳ خواب با امکانات",
    type: "apartment",
    typeLabel: "آپارتمان",
    deal: "rent",
    dealLabel: "رهن و اجاره",
    area: 95,
    rooms: 3,
    floor: 1,
    totalFloors: 5,
    age: 3,
    price: "۴۵۰ میلیون ت",
    rent: "۲۰ میلیون ت ماهانه",
    location: "منطقه ۲، قدس",
    district: "منطقه ۲",
    timeAgo: "۲ روز پیش",
    emoji: "🏢",
    badgeColor: "bg-sky-50 text-sky-700",
    features: ["آسانسور", "پارکینگ", "بالکن", "انباری"],
    hasParking: true,
    hasElevator: true,
    hasBalcony: true,
  },
];

export type PropertyTypeFilter = {
  id: string;
  label: string;
  emoji: string;
};

export const propertyTypeFilters: PropertyTypeFilter[] = [
  { id: "all", label: "همه", emoji: "🏘️" },
  { id: "apartment", label: "آپارتمان", emoji: "🏢" },
  { id: "villa", label: "ویلا", emoji: "🏡" },
  { id: "suite", label: "سوئیت", emoji: "🛏️" },
  { id: "shop", label: "مغازه", emoji: "🏪" },
  { id: "land", label: "زمین", emoji: "🌳" },
];

/** داده‌های نمونه بخش اشیاء گمشده */

export type LostFoundStatus = "lost" | "found";
export type LostFoundCategory =
  | "documents"
  | "electronics"
  | "keys"
  | "bags"
  | "pets"
  | "jewelry"
  | "vehicles"
  | "other";

export type LostFoundItem = {
  id: string;
  title: string;
  status: LostFoundStatus;
  category: LostFoundCategory;
  categoryLabel: string;
  emoji: string;
  description: string;
  location: string;
  district: string;
  date: string; // تاریخ پیدا شدن/گم شدن
  timeAgo: string;
  reward?: string; // پاداش
  contactName: string;
  contactType: "owner" | "finder";
  badgeColor: string;
  tags: string[];
};

export const lostFoundItems: LostFoundItem[] = [
  // === گم‌شده‌ها ===
  {
    id: "lf1",
    title: "گواهینامه راننده به نام محمد رضایی",
    status: "lost",
    category: "documents",
    categoryLabel: "مدارک",
    emoji: "📄",
    description:
      "گواهینامه راننده کلاس B به نام محمد رضایی، کد ملی ۱۲۳۴۵۶۷۸۹۰. در محدوده میدان قدس گم شده است. در صورت یافتن با شماره زیر تماس بگیرید.",
    location: "میدان قدس، حد فاصل خیابان امام و مطهری",
    district: "مرکز شهر",
    date: "۱۴۰۴/۰۶/۲۲",
    timeAgo: "دیروز",
    reward: "۵۰۰٬۰۰۰ تومان پاداش",
    contactName: "محمد رضایی",
    contactType: "owner",
    badgeColor: "bg-rose-50 text-rose-700",
    tags: ["گواهینامه", "مدارک هویتی", "مهم"],
  },
  {
    id: "lf2",
    title: "گوشی موبایل آیفون ۱۳ پرو رنگ آبی",
    status: "lost",
    category: "electronics",
    categoryLabel: "الکترونیک",
    emoji: "📱",
    description:
      "گوشی آیفون ۱۳ پرو رنگ آبی sierra، ۲۵۶ گیگابایت، با قاب سیاه چرمی. در اتوبوس خط ۳ شهر قدس جا مانده است. شماره سریال: F2LW۳۳۴۵XYZ.",
    location: "اتوبوس خط ۳، مسیر میدان قدس به پایانه",
    district: "حمل و نقل عمومی",
    date: "۱۴۰۴/۰۶/۲۴",
    timeAgo: "امروز صبح",
    reward: "۲٬۰۰۰٬۰۰۰ تومان پاداش",
    contactName: "زهرا کریمی",
    contactType: "owner",
    badgeColor: "bg-rose-50 text-rose-700",
    tags: ["موبایل", "آیفون", "قاب چرمی"],
  },
  {
    id: "lf3",
    title: "گردنبند طلا با Pendant قلب",
    status: "lost",
    category: "jewelry",
    categoryLabel: "جواهرات",
    emoji: "📿",
    description:
      "گردنبند طلا ۱۸ عیار با Pendant قلبی شکل و یک الماس کوچک. ارزش عاطفی بالا دارد. در پارک ملت شهر قدس گم شده.",
    location: "پارک ملت، نزدیک آبنما",
    district: "پارک ملت",
    date: "۱۴۰۴/۰۶/۲۰",
    timeAgo: "۴ روز پیش",
    reward: "۵٬۰۰۰٬۰۰۰ تومان پاداش",
    contactName: "فاطمه احمدی",
    contactType: "owner",
    badgeColor: "bg-rose-50 text-rose-700",
    tags: ["طلا", "گردنبند", "الماس", "مهم"],
  },
  {
    id: "lf4",
    title: "سگ خانگی نژاد پومرانیا رنگ کرم",
    status: "lost",
    category: "pets",
    categoryLabel: "حیوانات",
    emoji: "🐕",
    description:
      "سگ خانگی نژاد پومرانیا، رنگ کرم، ۳ ساله، به نام «پشمک». یقه قرمز با قاب نام و شماره تماس دارد. از شهرک قدس فرار کرده.",
    location: "شهرک قدس، بلوار امین",
    district: "شهرک قدس",
    date: "۱۴۰۴/۰۶/۲۳",
    timeAgo: "دیروز عصر",
    reward: "۳٬۰۰۰٬۰۰۰ تومان پاداش",
    contactName: "علی محمدی",
    contactType: "owner",
    badgeColor: "bg-rose-50 text-rose-700",
    tags: ["حیوان خانگی", "سگ", "پومرانیا", "فوری"],
  },
  {
    id: "lf5",
    title: "کلید سواری پژو ۲۰۶ با دسته قرمز",
    status: "lost",
    category: "keys",
    categoryLabel: "کلید و قفل",
    emoji: "🔑",
    description:
      "کلید سواری پژو ۲۰۶، دسته قرمز رنگ با چند کلید دیگر و یک کارت بانکی. در محدوده بازار قدس گم شده.",
    location: "بازار قدس، راسته شماره ۲",
    district: "بازار قدس",
    date: "۱۴۰۴/۰۶/۲۵",
    timeAgo: "امروز",
    contactName: "حسین موسوی",
    contactType: "owner",
    badgeColor: "bg-rose-50 text-rose-700",
    tags: ["کلید ماشین", "پژو", "دسته قرمز"],
  },
  {
    id: "lf6",
    title: "کیف لپ‌تاپ مشکی برند ایسوس",
    status: "lost",
    category: "bags",
    categoryLabel: "کیف و کوله",
    emoji: "💼",
    description:
      "کیف لپ‌تاپ مشکی برند ایسوس، حاوی لپ‌تاپ ۱۵ اینچی و چند مدرک کاری. در مسیر مترو ایستگاه قدس جا مانده.",
    location: "مترو قدس، خط ۲",
    district: "مترو",
    date: "۱۴۰۴/۰۶/۲۱",
    timeAgo: "۳ روز پیش",
    reward: "۱٬۵۰۰٬۰۰۰ تومان پاداش",
    contactName: "رضا نوری",
    contactType: "owner",
    badgeColor: "bg-rose-50 text-rose-700",
    tags: ["لپ‌تاپ", "کیف", "ایسوس", "مدارک کاری"],
  },

  // === پیدا‌شده‌ها ===
  {
    id: "lf7",
    title: "کارت ملی به نام مریم عباسی",
    status: "found",
    category: "documents",
    categoryLabel: "مدارک",
    emoji: "📄",
    description:
      "کارت ملی به نام مریم عباسی در شعبه بانک ملت واقع در خیابان امام پیدا شده. دارنده می‌تواند با مراجعه حضوری یا تماس آن را دریافت کند.",
    location: "بانک ملت، شعبه خیابان امام",
    district: "خیابان امام",
    date: "۱۴۰۴/۰۶/۲۵",
    timeAgo: "امروز",
    contactName: "بانک ملت شعبه خیابان امام",
    contactType: "finder",
    badgeColor: "bg-emerald-50 text-emerald-700",
    tags: ["کارت ملی", "مدرک هویتی"],
  },
  {
    id: "lf8",
    title: "دستگاه تبلت سامسونگ Galaxy Tab",
    status: "found",
    category: "electronics",
    categoryLabel: "الکترونیک",
    emoji: "📱",
    description:
      "دستگاه تبلت سامسونگ Galaxy Tab رنگ نقره‌ای با قاب مشکی، در تاکسی اینترنتی جا مانده. در صفحه قفل عکس کودک دیده می‌شود.",
    location: "تاکسی اینترنتی، منطقه ۲ قدس",
    district: "منطقه ۲",
    date: "۱۴۰۴/۰۶/۲۴",
    timeAgo: "دیروز",
    contactName: "محمد طاهری (راننده)",
    contactType: "finder",
    badgeColor: "bg-emerald-50 text-emerald-700",
    tags: ["تبلت", "سامسونگ", "قاب مشکی"],
  },
  {
    id: "lf9",
    title: "کیف دستی زنانه برند چرمی",
    status: "found",
    category: "bags",
    categoryLabel: "کیف و کوله",
    emoji: "👜",
    description:
      "کیف دستی زنانه، چرم طبیعی رنگ قهوه‌ای، حاوی آرایش و چند کارت بازرگانی. در کافه رستوران سنتی «باغ شهر» پیدا شده.",
    location: "رستوران باغ شهر، بلوار امین",
    district: "بلوار امین",
    date: "۱۴۰۴/۰۶/۲۳",
    timeAgo: "دیروز",
    contactName: "مدیریت رستوران باغ شهر",
    contactType: "finder",
    badgeColor: "bg-emerald-50 text-emerald-700",
    tags: ["کیف دستی", "چرم", "زنانه"],
  },
  {
    id: "lf10",
    title: "بچگانه دوچرخه کوهستان کوچک",
    status: "found",
    category: "vehicles",
    categoryLabel: "وسایل نقلیه",
    emoji: "🚲",
    description:
      "دوچرخه کوهستان کودکانه رنگ سبز و زرد، در پارک شهر رها شده. صاحب آن احتمالاً کودکی است که در پارک بازی می‌کرده.",
    location: "پارک شهر، محوطه بازی کودکان",
    district: "پارک شهر",
    date: "۱۴۰۴/۰۶/۲۲",
    timeAgo: "۳ روز پیش",
    contactName: "نگهبان پارک شهر",
    contactType: "finder",
    badgeColor: "bg-emerald-50 text-emerald-700",
    tags: ["دوچرخه", "کودکانه", "سبز"],
  },
  {
    id: "lf11",
    title: "جواهرات گوش (گوشواره الماس)",
    status: "found",
    category: "jewelry",
    categoryLabel: "جواهرات",
    emoji: "💎",
    description:
      "یک گوشواره الماس کوچک طلا سفید، در مسجد جامع شهر قدس پیدا شده. احتمالاً متعلق به یکی از مراجعین است.",
    location: "مسجد جامع شهر قدس",
    district: "مرکز شهر",
    date: "۱۴۰۴/۰۶/۲۰",
    timeAgo: "۵ روز پیش",
    contactName: "بخش امور مسجد جامع",
    contactType: "finder",
    badgeColor: "bg-emerald-50 text-emerald-700",
    tags: ["گوشواره", "الماس", "طلا سفید"],
  },
  {
    id: "lf12",
    title: "ساعت مچی هوشمند اپل واچ",
    status: "found",
    category: "electronics",
    categoryLabel: "الکترونیک",
    emoji: "⌚",
    description:
      "ساعت هوشمند اپل واچ سری ۷، رنگ مشکی، در باشگاه ورزشی «قدس فیتنس» پیدا شده. بند سیلیکونی مشکی دارد.",
    location: "باشگاه قدس فیتنس، خیابان مطهری",
    district: "خیابان مطهری",
    date: "۱۴۰۴/۰۶/۲۵",
    timeAgo: "امروز",
    contactName: "پذیرش باشگاه قدس فیتنس",
    contactType: "finder",
    badgeColor: "bg-emerald-50 text-emerald-700",
    tags: ["اپل واچ", "ساعت هوشمند", "مشکی"],
  },
];

export type LostFoundCategoryFilter = {
  id: string;
  label: string;
  emoji: string;
};

export const lostFoundCategories: LostFoundCategoryFilter[] = [
  { id: "all", label: "همه", emoji: "📦" },
  { id: "documents", label: "مدارک", emoji: "📄" },
  { id: "electronics", label: "الکترونیک", emoji: "📱" },
  { id: "keys", label: "کلید و قفل", emoji: "🔑" },
  { id: "bags", label: "کیف و کوله", emoji: "💼" },
  { id: "pets", label: "حیوانات", emoji: "🐾" },
  { id: "jewelry", label: "جواهرات", emoji: "💎" },
  { id: "vehicles", label: "وسایل نقلیه", emoji: "🚲" },
  { id: "other", label: "سایر", emoji: "❓" },
];

/** داده‌های نمونه بخش سامانه ۱۳۷ */

export type RequestStatus =
  | "pending" // در انتظار بررسی
  | "in-progress" // در حال پیگیری
  | "dispatched" // اعزام کارشناس
  | "resolved" // حل‌شده
  | "rejected"; // رد شده

export type RequestCategory =
  | "cleaning"
  | "asphalt"
  | "lighting"
  | "green-space"
  | "trash"
  | "water"
  | "electricity"
  | "traffic"
  | "construction"
  | "other";

export type RequestPriority = "low" | "medium" | "high" | "urgent";

export type Attachment = {
  id: string;
  type: "image" | "video";
  name: string;
  size: string;
};

export type Sama137Request = {
  id: string;
  trackingCode: string; // کد رهگیری
  title: string;
  category: RequestCategory;
  categoryLabel: string;
  emoji: string;
  description: string;
  address: string;
  district: string;
  status: RequestStatus;
  statusLabel: string;
  priority: RequestPriority;
  priorityLabel: string;
  createdAt: string; // تاریخ شمسی
  timeAgo: string;
  updatedAt: string;
  attachments: Attachment[];
  timeline: {
    label: string;
    date: string;
    done: boolean;
  }[];
  referenceUnit?: string;
  assignedTo?: string;
};

export const sama137Categories: {
  id: RequestCategory;
  label: string;
  emoji: string;
  description: string;
}[] = [
  {
    id: "cleaning",
    label: "نظافت و روشنایی معابر",
    emoji: "🧹",
    description: "تمیزکاری خیابان، جمع‌آوری زباله، شستشوی معابر",
  },
  {
    id: "asphalt",
    label: "آسفالت و معابر",
    emoji: "🛣️",
    description: "چاله جاده، ترمیم آسفالت، جدول‌گذاری",
  },
  {
    id: "lighting",
    label: "روشنایی شهری",
    emoji: "💡",
    description: "خرابی چراغ، تعویض لامپ، قطع برق پارک",
  },
  {
    id: "green-space",
    label: "فضای سبز",
    emoji: "🌳",
    description: "هرس درخت، آبیاری، کاشت فضای سبز",
  },
  {
    id: "trash",
    label: "زباله و پسماند",
    emoji: "🗑️",
    description: "سرریز سطل، جمع‌آوری پسماند بزرگ",
  },
  {
    id: "water",
    label: "آب و فاضلاب",
    emoji: "💧",
    description: "نشتی لوله، قطع آب، خرابی شیر",
  },
  {
    id: "electricity",
    label: "برق شهری",
    emoji: "⚡",
    description: "قطع برق، خرابی تابلو، اتصالی",
  },
  {
    id: "traffic",
    label: "ترافیک و علائم",
    emoji: "🚦",
    description: "خرابی چراغ، علائم جاده‌ای، چراغ راهنمایی",
  },
  {
    id: "construction",
    label: "ساختمان و محوطه",
    emoji: "🏗️",
    description: "خرابی پیاده‌رو، دیوار، پل عابر",
  },
  {
    id: "other",
    label: "سایر موارد",
    emoji: "❓",
    description: "مواردی که در دسته‌بندی بالا قرار نمی‌گیرند",
  },
];

export const sama137Priorities: {
  id: RequestPriority;
  label: string;
  color: string;
}[] = [
  { id: "low", label: "کم", color: "bg-slate-100 text-slate-700" },
  { id: "medium", label: "متوسط", color: "bg-sky-50 text-sky-700" },
  { id: "high", label: "زیاد", color: "bg-amber-50 text-amber-700" },
  { id: "urgent", label: "فوری", color: "bg-rose-50 text-rose-700" },
];

export const sama137Requests: Sama137Request[] = [
  {
    id: "r1",
    trackingCode: "۱۳۷-۸۹۰۱۲",
    title: "نظافت خیابان شهید عالمی",
    category: "cleaning",
    categoryLabel: "نظافت معابر",
    emoji: "🧹",
    description:
      "بدلیل عدم نظافت دوره‌ای، تجمع زباله و پسماند در حد فاصل خیابان شهید عالمی و کوچه ۱۲ ایجاد شده که بوی نامطبوع و آلودگی بصری به همراه دارد. خواهشمند است جهت نظافت سریع اقدام گردد.",
    address: "خیابان شهید عالمی، حد فاصل کوچه ۱۲ تا ۱۴، قدس",
    district: "منطقه ۳",
    status: "in-progress",
    statusLabel: "در حال پیگیری",
    priority: "high",
    priorityLabel: "زیاد",
    createdAt: "۱۴۰۴/۰۶/۲۲",
    timeAgo: "۳ روز پیش",
    updatedAt: "۱۴۰۴/۰۶/۲۴",
    attachments: [
      {
        id: "a1",
        type: "image",
        name: "تصویر محل تجمع زباله.jpg",
        size: "۲٫۳ MB",
      },
      {
        id: "a2",
        type: "image",
        name: "نمای خیابان از زاویه دیگر.jpg",
        size: "۱٫۸ MB",
      },
      {
        id: "a3",
        type: "video",
        name: "ویدیوی کوتاه از وضعیت.mp4",
        size: "۱۴ MB",
      },
    ],
    timeline: [
      { label: "ثبت درخواست", date: "۱۴۰۴/۰۶/۲۲", done: true },
      { label: "بررسی اولیه توسط کارشناس", date: "۱۴۰۴/۰۶/۲۳", done: true },
      { label: "ارجاع به واحد نظافت", date: "۱۴۰۴/۰۶/۲۴", done: true },
      { label: "اعزام تیم نظافتی", date: "—", done: false },
      { label: "تکمیل و تأیید", date: "—", done: false },
    ],
    referenceUnit: "واحد نظافت و خدمات شهری",
    assignedTo: "مهندس رضایی",
  },
  {
    id: "r2",
    trackingCode: "۱۳۷-۸۸۹۲۳",
    title: "خرابی آسفالت خیابان قدس",
    category: "asphalt",
    categoryLabel: "آسفالت و معابر",
    emoji: "🛣️",
    description:
      "وجود چاله‌های عمیق در آسفالت خیابان قدس حد فاصل میدان امام حسن تا تقاطع بلوار امین که موجب تصادف و آسیب به خودروها شده. ترمیم فوری آسفالت ضروری است.",
    address: "خیابان قدس، حد فاصل میدان امام حسن تا بلوار امین",
    district: "منطقه ۱",
    status: "in-progress",
    statusLabel: "در حال پیگیری",
    priority: "urgent",
    priorityLabel: "فوری",
    createdAt: "۱۴۰۴/۰۶/۲۰",
    timeAgo: "۵ روز پیش",
    updatedAt: "۱۴۰۴/۰۶/۲۴",
    attachments: [
      {
        id: "a4",
        type: "image",
        name: "چاله آسفالت خیابان قدس.jpg",
        size: "۳٫۱ MB",
      },
      {
        id: "a5",
        type: "image",
        name: "نمای از چاله دوم.jpg",
        size: "۲٫۶ MB",
      },
    ],
    timeline: [
      { label: "ثبت درخواست", date: "۱۴۰۴/۰۶/۲۰", done: true },
      { label: "بررسی فنی توسط کارشناس", date: "۱۴۰۴/۰۶/۲۱", done: true },
      { label: "اولویت‌بندی فوری", date: "۱۴۰۴/۰۶/۲۱", done: true },
      { label: "ارجاع به واحد معابر", date: "۱۴۰۴/۰۶/۲۲", done: true },
      { label: "برنامه‌ریزی ترمیم", date: "۱۴۰۴/۰۶/۲۴", done: true },
      { label: "اعزام تیم آسفالت‌ریزی", date: "—", done: false },
      { label: "تکمیل ترمیم و تأیید", date: "—", done: false },
    ],
    referenceUnit: "واحد معابر و آسفالت",
    assignedTo: "مهندس کاظمی",
  },
  {
    id: "r3",
    trackingCode: "۱۳۷-۸۸۱۰۴",
    title: "خرابی چراغ روشنایی پارک ملت",
    category: "lighting",
    categoryLabel: "روشنایی شهری",
    emoji: "💡",
    description:
      "چراغ‌های روشنایی در بخش شمالی پارک ملت خراب شده و در ساعات شب تاریکی مطلق ایجاد می‌کند که نگرانی امنیتی برای شهروندان به همراه دارد.",
    address: "پارک ملت، بخش شمالی، نزدیک آبنما",
    district: "پارک ملت",
    status: "resolved",
    statusLabel: "حل‌شده",
    priority: "medium",
    priorityLabel: "متوسط",
    createdAt: "۱۴۰۴/۰۶/۱۰",
    timeAgo: "۱۵ روز پیش",
    updatedAt: "۱۴۰۴/۰۶/۱۴",
    attachments: [
      {
        id: "a6",
        type: "image",
        name: "چراغ خراب پارک.jpg",
        size: "۱٫۹ MB",
      },
    ],
    timeline: [
      { label: "ثبت درخواست", date: "۱۴۰۴/۰۶/۱۰", done: true },
      { label: "بررسی اولیه", date: "۱۴۰۴/۰۶/۱۱", done: true },
      { label: "اعزام تیم برق", date: "۱۴۰۴/۰۶/۱۳", done: true },
      { label: "تعویض لامپ و تعمیر", date: "۱۴۰۴/۰۶/۱۴", done: true },
      { label: "تأیید تکمیل کار", date: "۱۴۰۴/۰۶/۱۴", done: true },
    ],
    referenceUnit: "واحد روشنایی شهری",
    assignedTo: "مهندس محمدی",
  },
  {
    id: "r4",
    trackingCode: "۱۳۷-۸۷۹۸۰",
    title: "تجمع پسماند بزرگ در خیابان مطهری",
    category: "trash",
    categoryLabel: "زباله و پسماند",
    emoji: "🗑️",
    description:
      "تجمع پسماند بزرگ و ضایعات ساختمانی در کنار خیابان مطهری که مانع تردد عابران و خودروها می‌شود.",
    address: "خیابان مطهری، حد فاصل کوچه ۸ تا میدان",
    district: "خیابان مطهری",
    status: "pending",
    statusLabel: "در انتظار بررسی",
    priority: "medium",
    priorityLabel: "متوسط",
    createdAt: "۱۴۰۴/۰۶/۲۵",
    timeAgo: "امروز",
    updatedAt: "۱۴۰۴/۰۶/۲۵",
    attachments: [
      {
        id: "a7",
        type: "image",
        name: "پسماند ساختمانی.jpg",
        size: "۲٫۲ MB",
      },
    ],
    timeline: [
      { label: "ثبت درخواست", date: "۱۴۰۴/۰۶/۲۵", done: true },
      { label: "در انتظار بررسی اولیه", date: "—", done: false },
      { label: "ارجاع به واحد مربوطه", date: "—", done: false },
      { label: "اعزام تیم", date: "—", done: false },
      { label: "تأیید تکمیل", date: "—", done: false },
    ],
    referenceUnit: "واحد پسماند",
  },
];

export const statusColors: Record<RequestStatus, string> = {
  pending: "bg-slate-100 text-slate-700 border-slate-200",
  "in-progress": "bg-amber-50 text-amber-700 border-amber-200",
  dispatched: "bg-sky-50 text-sky-700 border-sky-200",
  resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-rose-50 text-rose-700 border-rose-200",
};

export const statusEmojis: Record<RequestStatus, string> = {
  pending: "⏳",
  "in-progress": "🔄",
  dispatched: "🚐",
  resolved: "✅",
  rejected: "❌",
};

/** داده‌های نمونه بخش سفارش غذا */

export type FoodCategory = {
  id: string;
  label: string;
  emoji: string;
  gradient: string;
  count: number;
};

export const foodCategories: FoodCategory[] = [
  {
    id: "iranian",
    label: "غذاهای ایرانی",
    emoji: "🟢",
    gradient: "from-emerald-400 to-green-600",
    count: 48,
  },
  {
    id: "kebab",
    label: "کبابی",
    emoji: "🍢",
    gradient: "from-rose-400 to-red-600",
    count: 32,
  },
  {
    id: "pizza",
    label: "پیتزا",
    emoji: "🍕",
    gradient: "from-orange-400 to-amber-600",
    count: 24,
  },
  {
    id: "fastfood",
    label: "فست فود",
    emoji: "🍔",
    gradient: "from-yellow-400 to-orange-600",
    count: 56,
  },
  {
    id: "sandwich",
    label: "ساندویچ",
    emoji: "🥪",
    gradient: "from-amber-400 to-yellow-600",
    count: 18,
  },
  {
    id: "bakery",
    label: "شیرینی و نان",
    emoji: "🥐",
    gradient: "from-amber-300 to-orange-500",
    count: 14,
  },
  {
    id: "dessert",
    label: "دسر و بستنی",
    emoji: "🍰",
    gradient: "from-pink-400 to-rose-600",
    count: 22,
  },
  {
    id: "drinks",
    label: "نوشیدنی",
    emoji: "🥤",
    gradient: "from-sky-400 to-blue-600",
    count: 19,
  },
];

export type Restaurant = {
  id: string;
  name: string;
  category: string;
  categoryEmoji: string;
  coverGradient: string;
  description: string;
  rating: number;
  reviewCount: string;
  deliveryTime: string; // مثلا ۳۰-۴۵ دقیقه
  deliveryFee: string;
  minOrder: string;
  tags: string[];
  isOpen: boolean;
  featured?: boolean;
  discount?: number;
};

export const restaurants: Restaurant[] = [
  {
    id: "rs1",
    name: "رستوران سنتی اصغر قدس",
    category: "غذاهای ایرانی",
    categoryEmoji: "🟢",
    coverGradient: "from-emerald-500 via-teal-500 to-green-600",
    description:
      "بهترین چلوکباب و خورشت‌های اصیل ایرانی در فضایی سنتی و دلنشین",
    rating: 4.8,
    reviewCount: "۱٫۲k",
    deliveryTime: "۳۰-۴۵ دقیقه",
    deliveryFee: "رایگان",
    minOrder: "۱۵۰٬۰۰۰ ت",
    tags: ["چلوکباب", "خورشت", "سنتی", "پلو"],
    isOpen: true,
    featured: true,
    discount: 15,
  },
  {
    id: "rs2",
    name: "کبابی حاج محسن",
    category: "کبابی",
    categoryEmoji: "🍢",
    coverGradient: "from-rose-500 via-red-500 to-rose-700",
    description: "کباب‌های کبابی و جگر روی آتش زغال، با طعم اصیل ایرانی",
    rating: 4.7,
    reviewCount: "۸۹۰",
    deliveryTime: "۲۵-۴۰ دقیقه",
    deliveryFee: "۲۵٬۰۰۰ ت",
    minOrder: "۲۰۰٬۰۰۰ ت",
    tags: ["کباب کوبیده", "جگر", "مرغ", "برگه"],
    isOpen: true,
    featured: true,
  },
  {
    id: "rs3",
    name: "پیتزا رنا",
    category: "پیتزا",
    categoryEmoji: "🍕",
    coverGradient: "from-orange-500 via-amber-500 to-yellow-600",
    description: "پیتزاهای ایتالیایی و مکزیکی با پنیر فراوان و خمیر تازه",
    rating: 4.6,
    reviewCount: "۱٫۵k",
    deliveryTime: "۳۵-۵۰ دقیقه",
    deliveryFee: "رایگان",
    minOrder: "۲۵۰٬۰۰۰ ت",
    tags: ["پپرونی", "چهار پنیر", "مخلوط", "مکزیکی"],
    isOpen: true,
    discount: 20,
  },
  {
    id: "rs4",
    name: "برگر هاوس قدس",
    category: "فست فود",
    categoryEmoji: "🍔",
    coverGradient: "from-yellow-500 via-amber-500 to-orange-600",
    description: "برگرهای گوشت تازه و سیب‌زمینی سرخ‌کرده خانگی",
    rating: 4.5,
    reviewCount: "۲٫۳k",
    deliveryTime: "۲۰-۳۵ دقیقه",
    deliveryFee: "۳۰٬۰۰۰ ت",
    minOrder: "۱۸۰٬۰۰۰ ت",
    tags: ["برگر", "سیب‌زمینی", "نشان", "هات‌داگ"],
    isOpen: true,
  },
  {
    id: "rs5",
    name: "ساندویچ‌خانه دلتا",
    category: "ساندویچ",
    categoryEmoji: "🥪",
    coverGradient: "from-amber-400 via-yellow-500 to-orange-500",
    description: "ساندویچ‌های سرد و گرم با نان تازه و سس مخصوص",
    rating: 4.4,
    reviewCount: "۶۷۰",
    deliveryTime: "۱۵-۲۵ دقیقه",
    deliveryFee: "۲۰٬۰۰۰ ت",
    minOrder: "۱۰۰٬۰۰۰ ت",
    tags: ["استیک", "سوسیس", "تک", "مخصوص"],
    isOpen: true,
  },
  {
    id: "rs6",
    name: "نان و شیرینی گلستان",
    category: "شیرینی و نان",
    categoryEmoji: "🥐",
    coverGradient: "from-amber-300 via-yellow-400 to-orange-400",
    description: "نان‌های تازه و شیرینی‌های سنتی و مجلسی",
    rating: 4.9,
    reviewCount: "۹۸۰",
    deliveryTime: "۲۰-۳۰ دقیقه",
    deliveryFee: "رایگان",
    minOrder: "۸۰٬۰۰۰ ت",
    tags: ["نان بربری", "شیرینی خشک", "کلوچه", "سوخاری"],
    isOpen: true,
    featured: true,
  },
  {
    id: "rs7",
    name: "قنادی شکر",
    category: "دسر و بستنی",
    categoryEmoji: "🍰",
    coverGradient: "from-pink-400 via-rose-400 to-pink-600",
    description: "کیک‌های مجلسی، بستنی‌های سنتی و دسرهای سرد",
    rating: 4.7,
    reviewCount: "۵۶۰",
    deliveryTime: "۳۰-۴۰ دقیقه",
    deliveryFee: "۲۵٬۰۰۰ ت",
    minOrder: "۱۲۰٬۰۰۰ ت",
    tags: ["کیک", "بستنی سنتی", "فالوده", "پاناکوتا"],
    isOpen: true,
    discount: 10,
  },
  {
    id: "rs8",
    name: "کافه نوشیدنی برشته",
    category: "نوشیدنی",
    categoryEmoji: "🥤",
    coverGradient: "from-sky-400 via-blue-500 to-indigo-600",
    description: "قهوه تخصصی، شیک‌های خامه‌ای و آب‌میوه‌های طبیعی",
    rating: 4.6,
    reviewCount: "۴۵۰",
    deliveryTime: "۱۵-۲۰ دقیقه",
    deliveryFee: "رایگان",
    minOrder: "۶۰٬۰۰۰ ت",
    tags: ["قهوه", "شیک", "اسموتی", "آب‌میوه"],
    isOpen: false,
  },
];




