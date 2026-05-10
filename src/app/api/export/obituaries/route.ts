import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.funeralHomeId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const obituaries = await prisma.obituary.findMany({
    where: { funeralHomeId: session.user.funeralHomeId },
    orderBy: { updatedAt: "desc" },
  });

  const rows = [
    ["title", "status", "slug", "publishedAt"].join(","),
    ...obituaries.map((obituary) =>
      [
        JSON.stringify(obituary.title),
        obituary.status,
        obituary.slug,
        obituary.publishedAt?.toISOString() || "",
      ].join(","),
    ),
  ];

  return new NextResponse(rows.join("\n"), {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="obituaries.csv"',
    },
  });
}
