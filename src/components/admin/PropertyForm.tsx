"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BackLink, AdminButton, AdminError } from "./ui";
import { Loader2, Save } from "lucide-react";
import type { Property } from "@prisma/client";

const TYPES = [
  { value: "apartment", label: "آپارتمان", emoji: "🏢" },
  { value: "villa", label: "ویلا", emoji: "🏡" },
  { value: "suite", label: "سوئیت", emoji: "🛏️" },
  { value: "shop", label: "مغازه", emoji: "🏪" },
  { value: "land", label: "زمین", emoji: "🌳" },
];

const DEALS = [
  { value: "sale", label: "فروش" },
  { value: "rent", label: "رهن و اجاره" },
];

const EMOJIS = ["🏢", "🏡", "🛏️", "🏪", "🌳", "🏠", "🏘️"];

export function PropertyForm({ mode, property }: { mode: "create" | "edit"; property?: Property }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState(property?.title || "");
  const [type, setType] = useState(property?.type || "apartment");
  const [typeLabel, setTypeLabel] = useState(property?.typeLabel || "آپارتمان");
  const [deal, setDeal] = useState(property?.deal || "sale");
  const [dealLabel, setDealLabel] = useState(property?.dealLabel || "فروش");
  const [area, setArea] = useState(property ? String(property.area) : "");
  const [rooms, setRooms] = useState(property ? String(property.rooms) : "0");
  const [floor, setFloor] = useState(property?.floor ? String(property.floor) : "");
  const [totalFloors, setTotalFloors] = useState(property?.totalFloors ? String(property.totalFloors) : "");
  const [age, setAge] = useState(property ? String(property.age) : "0");
  const [price, setPrice] = useState(property?.price || "");
  const [rent, setRent] = useState(property?.rent || "");
  const [location, setLocation] = useState(property?.location || "");
  const [district, setDistrict] = useState(property?.district || "");
  const [timeAgo, setTimeAgo] = useState(property?.timeAgo || "همین الان");
  const [emoji, setEmoji] = useState(property?.emoji || "🏠");
  const [featuresText, setFeaturesText] = useState(
    property?.features ? (JSON.parse(property.features) as string[]).join("\n") : ""
  );
  const [hasParking, setHasParking] = useState(property?.hasParking ?? false);
  const [hasElevator, setHasElevator] = useState(property?.hasElevator ?? false);
  const [hasBalcony, setHasBalcony] = useState(property?.hasBalcony ?? false);
  const [status, setStatus] = useState(property?.status || "approved");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      const features = featuresText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const body = {
        title,
        type,
        typeLabel,
        deal,
        dealLabel,
        area: Number(area) || 0,
        rooms: Number(rooms) || 0,
        floor: floor ? Number(floor) : null,
        totalFloors: totalFloors ? Number(totalFloors) : null,
        age: Number(age) || 0,
        price,
        rent: rent || null,
        location,
        district,
        timeAgo,
        emoji,
        features,
        hasParking,
        hasElevator,
        hasBalcony,
        status,
      };

      const url = mode === "create" ? "/api/admin/properties" : `/api/admin/properties/${property!.id}`;
      const method = mode === "create" ? "POST" : "PATCH";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "خطا");
      }
      router.push("/admin/properties");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطا");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <BackLink href="/admin/properties" label="بازگشت به آگهی‌ها" />
      <h1 className="text-xl font-bold mb-4">
        {mode === "create" ? "افزودن آگهی املاک جدید" : "ویرایش آگهی"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="عنوان آگهی *">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="form-input" placeholder="مثلاً: آپارتمان نوساز ۸۵ متری" />
        </Field>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Field label="نوع ملک *">
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                const t = TYPES.find((x) => x.value === e.target.value);
                if (t) setTypeLabel(t.label);
              }}
              className="form-input"
            >
              {TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.emoji} {t.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="نوع معامله *">
            <select
              value={deal}
              onChange={(e) => {
                setDeal(e.target.value);
                const d = DEALS.find((x) => x.value === e.target.value);
                if (d) setDealLabel(d.label);
              }}
              className="form-input"
            >
              {DEALS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="اموجی">
            <select value={emoji} onChange={(e) => setEmoji(e.target.value)} className="form-input">
              {EMOJIS.map((em) => (
                <option key={em} value={em}>
                  {em}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <Field label="متراژ (م²) *">
            <input type="number" value={area} onChange={(e) => setArea(e.target.value)} required className="form-input" />
          </Field>
          <Field label="تعداد خواب">
            <input type="number" value={rooms} onChange={(e) => setRooms(e.target.value)} className="form-input" />
          </Field>
          <Field label="طبقه">
            <input type="number" value={floor} onChange={(e) => setFloor(e.target.value)} className="form-input" />
          </Field>
          <Field label="کل طبقات">
            <input type="number" value={totalFloors} onChange={(e) => setTotalFloors(e.target.value)} className="form-input" />
          </Field>
          <Field label="سن ساختمان">
            <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="form-input" />
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label={deal === "rent" ? "رهن *" : "قیمت کل *"}>
            <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} required className="form-input" placeholder="۸٫۵ میلیارد ت" />
          </Field>
          {deal === "rent" && (
            <Field label="اجاره ماهانه">
              <input type="text" value={rent} onChange={(e) => setRent(e.target.value)} className="form-input" placeholder="۱۵ میلیون ت ماهانه" />
            </Field>
          )}
        </div>

        <Field label="آدرس کامل *">
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required className="form-input" placeholder="منطقه ۳، قدس، خیابان..." />
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="منطقه/محله">
            <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)} className="form-input" placeholder="شهرک قدس" />
          </Field>
          <Field label="زمان انتشار">
            <input type="text" value={timeAgo} onChange={(e) => setTimeAgo(e.target.value)} className="form-input" placeholder="۲ ساعت پیش" />
          </Field>
        </div>

        <Field label="امکانات (هر خط یک مورد)">
          <textarea value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} rows={4} className="form-input" placeholder={"انباری\nپارکینگ\nآسانسور\nبالکن"} />
        </Field>

        <div className="flex flex-wrap gap-4">
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={hasParking} onChange={(e) => setHasParking(e.target.checked)} className="size-4" />
            پارکینگ
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={hasElevator} onChange={(e) => setHasElevator(e.target.checked)} className="size-4" />
            آسانسور
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={hasBalcony} onChange={(e) => setHasBalcony(e.target.checked)} className="size-4" />
            بالکن
          </label>
        </div>

        <Field label="وضعیت تأیید">
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="form-input">
            <option value="pending">در انتظار بررسی</option>
            <option value="approved">تأیید شده</option>
            <option value="rejected">رد شده</option>
          </select>
        </Field>

        {error && <AdminError message={error} />}

        <div className="flex gap-2">
          <AdminButton type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                در حال ذخیره…
              </>
            ) : (
              <>
                <Save className="size-4" />
                {mode === "create" ? "افزودن آگهی" : "ذخیره تغییرات"}
              </>
            )}
          </AdminButton>
          <AdminButton href="/admin/properties" variant="outline">
            انصراف
          </AdminButton>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-bold mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}
