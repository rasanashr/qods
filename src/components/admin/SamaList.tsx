"use client";

import { useEffect, useState } from "react";
import { GenericList } from "@/components/admin/GenericList";
import type { GenericItem } from "@/components/admin/GenericList";

export function SamaList({ initialItems }: { initialItems: GenericItem[] }) {
  const [items, setItems] = useState(initialItems);
  // برای سادگی: حالا فقط items نمایش می‌دهیم. بعداً فیلتر هم اضافه می‌شود.

  useEffect(() => {
    // در صورت refresh سرور، items جدید بارگذاری نمی‌شود چون این client است.
    // اما چون صفحه از server رندر شده، initialItems از قبل درست است.
  }, []);

  return (
    <GenericList
      items={items}
      title="درخواست‌های سامانه ۱۳۷"
      description={`${items.length.toLocaleString("fa-IR")} درخواست`}
      emptyEmoji="📞"
      emptyTitle="درخواستی وجود ندارد"
      searchFields={["title", "subtitle"]}
      showViewAll
    />
  );
}
