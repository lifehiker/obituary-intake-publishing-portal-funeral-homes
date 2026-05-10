import { ObituaryStatus } from "@prisma/client";
import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const signUpSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  funeralHomeName: z.string().min(2),
  slug: z.string().min(2),
});

export const onboardingSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  supportEmail: z.string().email(),
  phone: z.string().min(7),
  primaryColor: z.string().min(4),
  introText: z.string().min(12),
  customApprovalMessage: z.string().min(8),
  locationName: z.string().min(2),
  locationSlug: z.string().min(2),
  city: z.string().min(2),
  state: z.string().min(2),
  addressLine: z.string().min(4),
});

export const intakeSchema = z.object({
  funeralHomeSlug: z.string().min(2),
  locationId: z.string().min(1),
  contactName: z.string().min(2),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(7),
  deceasedName: z.string().min(2),
  title: z.string().min(2),
  dateOfBirth: z.string().optional(),
  dateOfDeath: z.string().optional(),
  serviceDate: z.string().optional(),
  serviceTime: z.string().optional(),
  serviceLocation: z.string().min(2),
  clergyName: z.string().optional(),
  survivorDetails: z.string().min(10),
  charityInfo: z.string().optional(),
  biographyRaw: z.string().min(60),
  approvalContact: z.string().min(2),
  approvalEmail: z.string().email(),
});

export const obituaryUpdateSchema = z.object({
  obituaryId: z.string().min(1),
  title: z.string().min(2),
  summary: z.string().min(6),
  biographyHtml: z.string().min(40),
  serviceDetailsHtml: z.string().min(20),
  charityDetailsHtml: z.string().optional(),
  survivorDetails: z.string().min(10),
  approvalContact: z.string().min(2),
  approvalEmail: z.string().email(),
  familyMessage: z.string().optional(),
  status: z.nativeEnum(ObituaryStatus),
});

export const approvalRequestSchema = z.object({
  obituaryId: z.string().min(1),
  recipientName: z.string().min(2),
  recipientEmail: z.string().email(),
  message: z.string().optional(),
});

export const approvalResponseSchema = z.object({
  token: z.string().min(8),
  action: z.enum(["approve", "changes"]),
  authorName: z.string().min(2),
  authorEmail: z.string().email().optional().or(z.literal("")),
  body: z.string().min(4),
});
