import { ObituaryStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function getCurrentFuneralHome(funeralHomeId: string) {
  return prisma.funeralHome.findUnique({
    where: { id: funeralHomeId },
    include: {
      locations: true,
      subscriptions: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      staff: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

export async function getDashboardData(funeralHomeId: string, status?: ObituaryStatus) {
  const where = { funeralHomeId, ...(status ? { status } : {}) };
  const [obituaries, submitted, awaiting, approved, published] = await Promise.all([
    prisma.obituary.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      take: 12,
      include: {
        funeralHome: true,
        location: true,
        approvals: {
          orderBy: { requestedAt: "desc" },
          take: 1,
        },
        assets: {
          take: 1,
        },
      },
    }),
    prisma.obituary.count({
      where: { funeralHomeId, status: ObituaryStatus.SUBMITTED },
    }),
    prisma.obituary.count({
      where: { funeralHomeId, status: ObituaryStatus.AWAITING_APPROVAL },
    }),
    prisma.obituary.count({
      where: { funeralHomeId, status: ObituaryStatus.APPROVED },
    }),
    prisma.obituary.count({
      where: { funeralHomeId, status: ObituaryStatus.PUBLISHED },
    }),
  ]);

  return {
    obituaries,
    metrics: { submitted, awaiting, approved, published },
  };
}

export async function getObituaryRecord(id: string) {
  return prisma.obituary.findUnique({
    where: { id },
    include: {
      funeralHome: true,
      location: true,
      submission: true,
      assets: true,
      approvals: {
        include: {
          comments: {
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { requestedAt: "desc" },
      },
      auditLogs: {
        include: {
          actor: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function getFuneralHomeBySlug(slug: string) {
  return prisma.funeralHome.findUnique({
    where: { slug },
    include: { locations: true },
  });
}

export async function getApprovalByToken(token: string) {
  return prisma.approvalRequest.findUnique({
    where: { token },
    include: {
      obituary: {
        include: {
          funeralHome: true,
          location: true,
          assets: true,
        },
      },
      comments: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

export async function getPublishedObituary(funeralHomeSlug: string, obituarySlug: string) {
  return prisma.obituary.findFirst({
    where: {
      slug: obituarySlug,
      funeralHome: { slug: funeralHomeSlug },
      status: ObituaryStatus.PUBLISHED,
    },
    include: {
      funeralHome: true,
      location: true,
      assets: true,
    },
  });
}
