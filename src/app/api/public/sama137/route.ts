import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/public/sama137
export async function GET() {
  const requests = await db.sama137Request.findMany({
    where: { isPublished: true },
    orderBy: { created_at: "desc" },
    select: {
      id: true,
      trackingCode: true,
      title: true,
      category: true,
      categoryLabel: true,
      emoji: true,
      description: true,
      address: true,
      district: true,
      status: true,
      statusLabel: true,
      priority: true,
      priorityLabel: true,
      createdAt: true,
      timeAgo: true,
      updatedAt: true,
      attachments: true,
      timeline: true,
      referenceUnit: true,
      assignedTo: true,
    },
  });

  const formatted = requests.map((r) => ({
    ...r,
    attachments: r.attachments ? JSON.parse(r.attachments) : [],
    timeline: r.timeline ? JSON.parse(r.timeline) : [],
    badgeColor: getStatusColor(r.status),
  }));

  return NextResponse.json({ requests: formatted });
}

function getStatusColor(status: string): string {
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
