"use server";

import { ApprovalStatus, ObituaryStatus, SubscriptionStatus, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/auth";
import { trackEvent } from "@/lib/analytics";
import { createCheckoutSession } from "@/lib/billing";
import { toParagraphHtml } from "@/lib/content";
import { sendTransactionalEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { requireFuneralHome, requireSession } from "@/lib/session";
import { saveImageFile } from "@/lib/storage";
import {
  approvalRequestSchema,
  approvalResponseSchema,
  intakeSchema,
  obituaryUpdateSchema,
  onboardingSchema,
  signInSchema,
  signUpSchema,
} from "@/lib/validators";
import { absoluteUrl, slugify } from "@/lib/utils";

export type ActionState = {
  ok: boolean;
  message: string;
};

function actionError(message: string): ActionState {
  return { ok: false, message };
}

export async function registerOwnerAction(_: ActionState, formData: FormData) {
  const parsed = signUpSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return actionError(parsed.error.issues[0]?.message || "Please review the form.");
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return actionError("An account with that email already exists.");
  }

  const slug = slugify(parsed.data.slug || parsed.data.funeralHomeName);
  const slugTaken = await prisma.funeralHome.findUnique({ where: { slug } });
  if (slugTaken) {
    return actionError("That funeral home URL is already in use.");
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const funeralHome = await prisma.funeralHome.create({
    data: {
      name: parsed.data.funeralHomeName,
      slug,
      supportEmail: email,
      planName: "Starter",
      trialEndsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
      introText:
        "Thank you for trusting us with these details. Please share as much information as you can and our staff will shape it into a polished memorial draft.",
      customApprovalMessage:
        "Please review the draft carefully and let us know if any details should be updated before publication.",
      locations: {
        create: {
          name: `${parsed.data.funeralHomeName} - Main Chapel`,
          slug: "main-chapel",
          city: "Sample City",
          state: "ST",
          addressLine: "100 Memorial Avenue",
        },
      },
      subscriptions: {
        create: {
          status: SubscriptionStatus.TRIALING,
        },
      },
    },
    include: { locations: true },
  });

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email,
      passwordHash,
      role: UserRole.OWNER,
      funeralHomeId: funeralHome.id,
      locationId: funeralHome.locations[0]?.id,
    },
  });

  return {
    ok: true,
    message: "Account created. Sign in to finish onboarding.",
  };
}

export async function credentialsSignInAction(_: ActionState, formData: FormData) {
  const parsed = signInSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return actionError("Enter a valid email and password.");
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/dashboard",
    });
  } catch {
    return actionError("Sign in failed. Check your credentials and try again.");
  }

  return { ok: true, message: "Signed in." };
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function saveOnboardingAction(_: ActionState, formData: FormData) {
  const session = await requireSession();
  const parsed = onboardingSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success || !session.user.funeralHomeId) {
    return actionError("Please complete all onboarding fields.");
  }

  const logoUrl = await saveImageFile(formData.get("logo") as File | null);
  const funeralHomeId = session.user.funeralHomeId;

  await prisma.funeralHome.update({
    where: { id: funeralHomeId },
    data: {
      name: parsed.data.name,
      slug: slugify(parsed.data.slug),
      supportEmail: parsed.data.supportEmail,
      phone: parsed.data.phone,
      primaryColor: parsed.data.primaryColor,
      introText: parsed.data.introText,
      customApprovalMessage: parsed.data.customApprovalMessage,
      logoUrl: logoUrl || undefined,
      onboardingComplete: true,
      locations: {
        deleteMany: {},
        create: {
          name: parsed.data.locationName,
          slug: slugify(parsed.data.locationSlug),
          city: parsed.data.city,
          state: parsed.data.state,
          addressLine: parsed.data.addressLine,
          phone: parsed.data.phone,
        },
      },
    },
  });

  const mainLocation = await prisma.location.findFirst({
    where: { funeralHomeId },
    orderBy: { name: "asc" },
  });

  if (mainLocation) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        locationId: mainLocation.id,
      },
    });
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function submitIntakeAction(_: ActionState, formData: FormData) {
  const parsed = intakeSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return actionError(parsed.error.issues[0]?.message || "Please complete the form.");
  }

  const funeralHome = await prisma.funeralHome.findUnique({
    where: { slug: parsed.data.funeralHomeSlug },
  });

  if (!funeralHome) {
    return actionError("That intake portal is unavailable.");
  }

  const photoUrl = await saveImageFile(formData.get("photo") as File | null);
  const biographyHtml = toParagraphHtml(parsed.data.biographyRaw);
  const serviceDetailsHtml = toParagraphHtml(
    [
      parsed.data.serviceDate && `Service date: ${parsed.data.serviceDate}`,
      parsed.data.serviceTime && `Service time: ${parsed.data.serviceTime}`,
      `Service location: ${parsed.data.serviceLocation}`,
      parsed.data.clergyName && `Clergy: ${parsed.data.clergyName}`,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  const survivorInfoJson = JSON.stringify({
    details: parsed.data.survivorDetails,
  });
  const serviceInfoJson = JSON.stringify({
    serviceDate: parsed.data.serviceDate,
    serviceTime: parsed.data.serviceTime,
    serviceLocation: parsed.data.serviceLocation,
    clergyName: parsed.data.clergyName,
  });

  const submission = await prisma.submission.create({
    data: {
      funeralHomeId: funeralHome.id,
      locationId: parsed.data.locationId,
      contactName: parsed.data.contactName,
      contactEmail: parsed.data.contactEmail,
      contactPhone: parsed.data.contactPhone,
      deceasedName: parsed.data.deceasedName,
      title: parsed.data.title,
      dateOfBirth: parsed.data.dateOfBirth ? new Date(parsed.data.dateOfBirth) : null,
      dateOfDeath: parsed.data.dateOfDeath ? new Date(parsed.data.dateOfDeath) : null,
      serviceInfoJson,
      survivorInfoJson,
      charityInfo: parsed.data.charityInfo,
      clergyName: parsed.data.clergyName,
      biographyRaw: parsed.data.biographyRaw,
      obituary: {
        create: {
          funeralHomeId: funeralHome.id,
          locationId: parsed.data.locationId,
          slug: slugify(`${parsed.data.deceasedName}-${Date.now().toString().slice(-5)}`),
          title: parsed.data.title,
          summary: `Memorial draft for ${parsed.data.deceasedName}`,
          biographyHtml,
          serviceDetailsHtml,
          charityDetailsHtml: parsed.data.charityInfo
            ? toParagraphHtml(parsed.data.charityInfo)
            : null,
          survivorDetails: parsed.data.survivorDetails,
          approvalContact: parsed.data.approvalContact,
          approvalEmail: parsed.data.approvalEmail,
          familyMessage: funeralHome.customApprovalMessage,
          status: ObituaryStatus.SUBMITTED,
        },
      },
    },
    include: {
      obituary: true,
    },
  });

  if (photoUrl && submission.obituary) {
    await prisma.asset.create({
      data: {
        funeralHomeId: funeralHome.id,
        submissionId: submission.id,
        obituaryId: submission.obituary.id,
        url: photoUrl,
        alt: parsed.data.deceasedName,
      },
    });
  }

  if (submission.obituary) {
    await prisma.auditLog.create({
      data: {
        obituaryId: submission.obituary.id,
        action: "intake_submitted",
        metadataJson: JSON.stringify({
          contactName: parsed.data.contactName,
          approvalEmail: parsed.data.approvalEmail,
        }),
      },
    });
  }

  await sendTransactionalEmail({
    to: funeralHome.supportEmail || parsed.data.contactEmail,
    subject: `New obituary intake for ${parsed.data.deceasedName}`,
    kind: "submission-received",
    props: {
      deceasedName: parsed.data.deceasedName,
      funeralHomeName: funeralHome.name,
    },
  });

  await trackEvent("intake_submission", {
    funeralHomeId: funeralHome.id,
    deceasedName: parsed.data.deceasedName,
    distinctId: parsed.data.contactEmail,
  });

  revalidatePath(`/submit/${funeralHome.slug}`);

  return {
    ok: true,
    message: "Thank you. The obituary details have been submitted for staff review.",
  };
}

export async function saveObituaryAction(_: ActionState, formData: FormData) {
  const session = await requireFuneralHome();
  const parsed = obituaryUpdateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return actionError(parsed.error.issues[0]?.message || "Review the obituary fields.");
  }

  const obituary = await prisma.obituary.update({
    where: { id: parsed.data.obituaryId },
    data: {
      title: parsed.data.title,
      summary: parsed.data.summary,
      biographyHtml: parsed.data.biographyHtml,
      serviceDetailsHtml: parsed.data.serviceDetailsHtml,
      charityDetailsHtml: parsed.data.charityDetailsHtml,
      survivorDetails: parsed.data.survivorDetails,
      approvalContact: parsed.data.approvalContact,
      approvalEmail: parsed.data.approvalEmail,
      familyMessage: parsed.data.familyMessage,
      status: parsed.data.status,
      publishedAt:
        parsed.data.status === ObituaryStatus.PUBLISHED ? new Date() : undefined,
    },
    include: {
      funeralHome: true,
    },
  });

  await prisma.auditLog.create({
    data: {
      obituaryId: obituary.id,
      actorUserId: session.user.id,
      action: "obituary_saved",
      metadataJson: JSON.stringify({ status: obituary.status }),
    },
  });

  if (obituary.status === ObituaryStatus.PUBLISHED) {
    await sendTransactionalEmail({
      to: obituary.approvalEmail || obituary.funeralHome.supportEmail || session.user.email || "",
      subject: `${obituary.title} is now published`,
      kind: "published",
      props: {
        deceasedName: obituary.title,
        publishedUrl: absoluteUrl(
          `/obituaries/${obituary.funeralHome.slug}/${obituary.slug}`,
        ),
      },
    });
  }

  await trackEvent("obituary_published", {
    funeralHomeId: obituary.funeralHomeId,
    obituaryId: obituary.id,
    status: obituary.status,
    distinctId: session.user.id,
  });

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/obituaries/${obituary.id}`);

  return { ok: true, message: "Obituary saved." };
}

export async function requestApprovalAction(_: ActionState, formData: FormData) {
  const session = await requireFuneralHome();
  const parsed = approvalRequestSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return actionError("Enter the family contact and email.");
  }

  const obituary = await prisma.obituary.findUnique({
    where: { id: parsed.data.obituaryId },
    include: { funeralHome: true },
  });

  if (!obituary) {
    return actionError("Obituary not found.");
  }

  const approval = await prisma.approvalRequest.create({
    data: {
      obituaryId: obituary.id,
      token: randomUUID(),
      recipientName: parsed.data.recipientName,
      recipientEmail: parsed.data.recipientEmail,
      message: parsed.data.message,
    },
  });

  await prisma.obituary.update({
    where: { id: obituary.id },
    data: {
      status: ObituaryStatus.AWAITING_APPROVAL,
      approvalContact: parsed.data.recipientName,
      approvalEmail: parsed.data.recipientEmail,
      familyMessage: parsed.data.message || obituary.familyMessage,
    },
  });

  await prisma.auditLog.create({
    data: {
      obituaryId: obituary.id,
      actorUserId: session.user.id,
      action: "approval_requested",
      metadataJson: JSON.stringify({ approvalId: approval.id }),
    },
  });

  const approvalUrl = absoluteUrl(`/approve/${approval.token}`);

  await sendTransactionalEmail({
    to: parsed.data.recipientEmail,
    subject: `Please review the obituary for ${obituary.title}`,
    kind: "approval-requested",
    props: {
      deceasedName: obituary.title,
      approvalUrl,
    },
  });

  await trackEvent("approval_requested", {
    funeralHomeId: obituary.funeralHomeId,
    obituaryId: obituary.id,
    distinctId: session.user.id,
  });

  revalidatePath(`/dashboard/obituaries/${obituary.id}`);

  return { ok: true, message: `Approval link ready: ${approvalUrl}` };
}

export async function respondApprovalAction(_: ActionState, formData: FormData) {
  const parsed = approvalResponseSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return actionError("Please include your name and a short note.");
  }

  const approval = await prisma.approvalRequest.findUnique({
    where: { token: parsed.data.token },
    include: {
      obituary: {
        include: {
          funeralHome: true,
        },
      },
    },
  });

  if (!approval) {
    return actionError("That approval link is invalid or expired.");
  }

  const status =
    parsed.data.action === "approve"
      ? ApprovalStatus.APPROVED
      : ApprovalStatus.CHANGES_REQUESTED;
  const obituaryStatus =
    parsed.data.action === "approve"
      ? ObituaryStatus.APPROVED
      : ObituaryStatus.IN_REVIEW;

  await prisma.approvalRequest.update({
    where: { id: approval.id },
    data: {
      status,
      respondedAt: new Date(),
      comments: {
        create: {
          authorName: parsed.data.authorName,
          authorEmail: parsed.data.authorEmail || undefined,
          body: parsed.data.body,
        },
      },
    },
  });

  await prisma.obituary.update({
    where: { id: approval.obituaryId },
    data: { status: obituaryStatus },
  });

  await prisma.auditLog.create({
    data: {
      obituaryId: approval.obituaryId,
      action: parsed.data.action === "approve" ? "family_approved" : "changes_requested",
      metadataJson: JSON.stringify({ authorName: parsed.data.authorName }),
    },
  });

  await sendTransactionalEmail({
    to:
      approval.obituary.funeralHome.supportEmail ||
      approval.obituary.approvalEmail ||
      parsed.data.authorEmail ||
      "support@example.com",
    subject:
      parsed.data.action === "approve"
        ? `${approval.obituary.title} was approved`
        : `Changes were requested for ${approval.obituary.title}`,
    kind: "approval-confirmed",
    props: {
      deceasedName: approval.obituary.title,
    },
  });

  await trackEvent("approval_completed", {
    funeralHomeId: approval.obituary.funeralHomeId,
    obituaryId: approval.obituaryId,
    action: parsed.data.action,
    distinctId: parsed.data.authorEmail || parsed.data.authorName,
  });

  revalidatePath(`/approve/${parsed.data.token}`);

  return {
    ok: true,
    message:
      parsed.data.action === "approve"
        ? "Thank you. The obituary has been approved."
        : "Thank you. Your requested changes were sent to the funeral home.",
  };
}

export async function startCheckoutAction(planName: string) {
  const session = await requireFuneralHome();
  const result = await createCheckoutSession({
    planName,
    customerEmail: session.user.email || "support@example.com",
    funeralHomeId: session.user.funeralHomeId!,
  });

  await trackEvent("pricing_cta_clicked", {
    planName,
    distinctId: session.user.id,
  });

  if (!result.ok && result.fallbackUrl) {
    redirect(result.fallbackUrl);
  }

  if (result.ok && result.url) {
    redirect(result.url);
  }

  redirect("/pricing");
}

export async function requestDemoAction(_: ActionState, formData: FormData) {
  const name = formData.get("name")?.toString().trim() || "";
  const email = formData.get("email")?.toString().trim() || "";
  const company = formData.get("company")?.toString().trim() || "";
  const notes = formData.get("notes")?.toString().trim() || "";

  if (name.length < 2 || !email.includes("@") || company.length < 2 || notes.length < 12) {
    return actionError("Enter your name, work email, funeral home, and a short workflow note.");
  }

  await trackEvent("demo_request_submitted", {
    distinctId: email,
    name,
    company,
  });

  await sendTransactionalEmail({
    to: process.env.EMAIL_FROM || email,
    subject: `Demo request from ${company}`,
    kind: "submission-received",
    props: {
      deceasedName: "workflow walkthrough request",
      funeralHomeName: company,
    },
  });

  return {
    ok: true,
    message:
      "Walkthrough request captured. Use the seeded demo portal now, or connect email/CRM later for production routing.",
  };
}
