import bcrypt from "bcryptjs";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import {
  ApprovalStatus,
  ObituaryStatus,
  PrismaClient,
  SubscriptionStatus,
  UserRole,
} from "@prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL || "file:./dev.db",
  }),
});

async function main() {
  await prisma.approvalComment.deleteMany();
  await prisma.approvalRequest.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.asset.deleteMany();
  await prisma.obituary.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.location.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  await prisma.funeralHome.deleteMany();

  const passwordHash = await bcrypt.hash("password123", 10);

  const funeralHome = await prisma.funeralHome.create({
    data: {
      name: "Harbor House Funeral Home",
      slug: "harbor-house-funeral-home",
      supportEmail: "owner@harbormemorial.test",
      phone: "(555) 240-1180",
      primaryColor: "#0F4C5C",
      introText:
        "Please complete the obituary intake below. Our staff will prepare a memorial draft for your review as quickly as possible.",
      customApprovalMessage:
        "Please review the obituary carefully and let us know if any details should be updated before publication.",
      onboardingComplete: true,
      planName: "Starter",
      trialEndsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
      subscriptions: {
        create: {
          status: SubscriptionStatus.TRIALING,
        },
      },
      locations: {
        create: [
          {
            name: "Main Chapel",
            slug: "main-chapel",
            city: "Providence",
            state: "RI",
            addressLine: "100 Memorial Avenue",
            phone: "(555) 240-1180",
          },
        ],
      },
    },
    include: { locations: true },
  });

  const mainLocation = funeralHome.locations[0];

  const owner = await prisma.user.create({
    data: {
      name: "Avery Morgan",
      email: "owner@harbormemorial.test",
      passwordHash,
      role: UserRole.OWNER,
      funeralHomeId: funeralHome.id,
      locationId: mainLocation.id,
    },
  });

  await prisma.user.create({
    data: {
      name: "Jordan Lee",
      email: "staff@harbormemorial.test",
      passwordHash,
      role: UserRole.STAFF,
      funeralHomeId: funeralHome.id,
      locationId: mainLocation.id,
    },
  });

  const firstSubmission = await prisma.submission.create({
    data: {
      funeralHomeId: funeralHome.id,
      locationId: mainLocation.id,
      contactName: "Eleanor Morrison",
      contactEmail: "family@example.com",
      contactPhone: "(555) 818-2201",
      deceasedName: "Edith Elaine Morrison",
      title: "Celebrating the life of Edith Elaine Morrison",
      dateOfBirth: new Date("1940-02-14"),
      dateOfDeath: new Date("2026-04-28"),
      serviceInfoJson: JSON.stringify({
        serviceDate: "2026-05-12",
        serviceTime: "11:00 AM",
        serviceLocation: "Harbor House Funeral Home",
      }),
      survivorInfoJson: JSON.stringify({
        details: "She is survived by her daughter, Claire Morrison, and three grandchildren.",
      }),
      charityInfo: "Memorial gifts may be directed to the Providence Public Garden Fund.",
      biographyRaw:
        "Edith Elaine Morrison was known for her kindness, her devotion to family, and her years of volunteer work across the Providence community. She spent more than four decades building friendships through her church and neighborhood groups.",
      status: ObituaryStatus.AWAITING_APPROVAL,
      obituary: {
        create: {
          funeralHomeId: funeralHome.id,
          locationId: mainLocation.id,
          slug: "edith-elaine-morrison",
          title: "Celebrating the life of Edith Elaine Morrison",
          summary:
            "Beloved mother, grandmother, volunteer, and friend whose warmth touched every room she entered.",
          biographyHtml:
            "<p>Edith Elaine Morrison was known for her kindness, her devotion to family, and her years of volunteer work across the Providence community.</p><p>She spent more than four decades building friendships through her church and neighborhood groups.</p>",
          serviceDetailsHtml:
            "<p>Visitation will be held on Tuesday, May 12 at 10:00 AM, followed by a memorial service at 11:00 AM at Harbor House Funeral Home.</p>",
          charityDetailsHtml:
            "<p>Memorial gifts may be directed to the Providence Public Garden Fund.</p>",
          survivorDetails:
            "She is survived by her daughter, Claire Morrison, and three grandchildren.",
          approvalContact: "Eleanor Morrison",
          approvalEmail: "family@example.com",
          familyMessage:
            "Please review the memorial carefully and let us know if there are any changes before we publish it.",
          status: ObituaryStatus.AWAITING_APPROVAL,
        },
      },
    },
    include: { obituary: true },
  });

  const secondSubmission = await prisma.submission.create({
    data: {
      funeralHomeId: funeralHome.id,
      locationId: mainLocation.id,
      contactName: "Marcus Carter",
      contactEmail: "marcus@example.com",
      contactPhone: "(555) 777-1234",
      deceasedName: "Margaret Louise Carter",
      title: "Margaret Louise Carter",
      dateOfBirth: new Date("1934-09-05"),
      dateOfDeath: new Date("2026-04-20"),
      serviceInfoJson: JSON.stringify({
        serviceDate: "2026-05-05",
        serviceLocation: "St. Anne Parish",
      }),
      survivorInfoJson: JSON.stringify({
        details: "She is survived by two sons, six grandchildren, and a wide extended family.",
      }),
      biographyRaw:
        "Margaret Louise Carter leaves behind a legacy of service, music, and relentless care for her family and neighbors. Her memorial page has already been approved and published.",
      status: ObituaryStatus.PUBLISHED,
      obituary: {
        create: {
          funeralHomeId: funeralHome.id,
          locationId: mainLocation.id,
          slug: "margaret-louise-carter",
          title: "Margaret Louise Carter",
          summary:
            "A gracious matriarch remembered for her music, faith, and lifelong service to others.",
          biographyHtml:
            "<p>Margaret Louise Carter leaves behind a legacy of service, music, and relentless care for her family and neighbors.</p>",
          serviceDetailsHtml:
            "<p>A funeral mass was held at St. Anne Parish, followed by interment at Harbor View Cemetery.</p>",
          survivorDetails:
            "She is survived by two sons, six grandchildren, and a wide extended family.",
          approvalContact: "Marcus Carter",
          approvalEmail: "marcus@example.com",
          status: ObituaryStatus.PUBLISHED,
          publishedAt: new Date("2026-04-23"),
        },
      },
    },
    include: { obituary: true },
  });

  await prisma.approvalRequest.create({
    data: {
      obituaryId: firstSubmission.obituary!.id,
      token: "demo-approval-token",
      recipientName: "Eleanor Morrison",
      recipientEmail: "family@example.com",
      message: "Please review the memorial draft and let us know if anything should change.",
      status: ApprovalStatus.PENDING,
      comments: {
        create: {
          authorName: "Harbor House Staff",
          authorEmail: "owner@harbormemorial.test",
          body: "We prepared the first memorial draft from the obituary intake and service details you provided.",
        },
      },
    },
  });

  await prisma.auditLog.createMany({
    data: [
      {
        obituaryId: firstSubmission.obituary!.id,
        actorUserId: owner.id,
        action: "intake_submitted",
        metadataJson: JSON.stringify({ source: "family portal" }),
      },
      {
        obituaryId: firstSubmission.obituary!.id,
        actorUserId: owner.id,
        action: "approval_requested",
        metadataJson: JSON.stringify({ token: "demo-approval-token" }),
      },
      {
        obituaryId: secondSubmission.obituary!.id,
        actorUserId: owner.id,
        action: "obituary_published",
        metadataJson: JSON.stringify({ publishedAt: "2026-04-23" }),
      },
    ],
  });

  console.info("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
