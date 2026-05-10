export type MarketingPage = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  sections: Array<{
    heading: string;
    body: string;
    bullets?: string[];
  }>;
};

export const marketingPages: Record<string, MarketingPage> = {
  "obituary-software": {
    slug: "obituary-software",
    eyebrow: "Category",
    title: "Obituary Software Built for Independent Funeral Homes",
    description:
      "Collect obituary details, draft memorial pages, manage family approvals, and publish faster from one focused workflow.",
    ctaLabel: "See the live demo",
    ctaHref: "/demo",
    sections: [
      {
        heading: "Replace scattered intake",
        body: "Move obituary details, service schedules, photos, and family instructions out of phone notes and email attachments.",
        bullets: [
          "Structured submission forms reduce missing information",
          "Each submission becomes a draft obituary instantly",
          "Staff review and publication happen in the same workspace",
        ],
      },
      {
        heading: "Designed around one operational job",
        body: "The portal is purpose-built for obituary intake, drafting, approvals, publishing, and print preparation instead of requiring a full website migration.",
      },
    ],
  },
  "funeral-home-obituary-submission-form": {
    slug: "funeral-home-obituary-submission-form",
    eyebrow: "Use Case",
    title: "A Branded Funeral Home Obituary Submission Form Families Can Finish",
    description:
      "Give families a polished obituary intake experience with clear prompts for service details, survivors, charities, and photos.",
    ctaLabel: "Open a sample intake portal",
    ctaHref: "/submit/harbor-house-funeral-home",
    sections: [
      {
        heading: "Capture the right details the first time",
        body: "Prompt for names, dates, clergy, service locations, charity requests, biography text, and approval contacts without forcing staff to chase follow-up emails.",
      },
      {
        heading: "Make your portal feel local",
        body: "Brand the page with your logo, colors, welcome copy, and location defaults so the handoff feels like part of your funeral home's service.",
      },
    ],
  },
  "family-obituary-intake-portal": {
    slug: "family-obituary-intake-portal",
    eyebrow: "Family Experience",
    title: "A Family Obituary Intake Portal That Feels Calm, Guided, and Professional",
    description:
      "Offer families a single place to submit information, review the draft, and approve the obituary without juggling multiple files.",
    ctaLabel: "Review the workflow",
    ctaHref: "/features/family-approvals",
    sections: [
      {
        heading: "A calmer approval experience",
        body: "Families receive a private link, review the exact draft, approve it, or request edits with context preserved in one thread.",
      },
      {
        heading: "Less back-and-forth for staff",
        body: "Staff can see which obituaries are waiting on the family, what change requests were made, and when approval was completed.",
      },
    ],
  },
  "obituary-management-software-for-funeral-homes": {
    slug: "obituary-management-software-for-funeral-homes",
    eyebrow: "Operations",
    title: "Obituary Management Software for Funeral Homes With Review, Approval, and Publishing Built In",
    description:
      "Track obituary records from submission through publication with search, status filters, approval links, audit logs, and export-ready content.",
    ctaLabel: "Explore the dashboard",
    ctaHref: "/dashboard",
    sections: [
      {
        heading: "See the queue at a glance",
        body: "Summary cards, recent activity, and status filters help staff understand what is newly submitted, awaiting approval, approved, or published.",
      },
      {
        heading: "Preserve accountability",
        body: "Every major status change and approval response can be written to an audit trail for the funeral home's internal record.",
      },
    ],
  },
  "obituary-template-software": {
    slug: "obituary-template-software",
    eyebrow: "Templates",
    title: "Obituary Template Software That Supports Memorial Pages and Newspaper Exports",
    description:
      "Draft faster with reusable sections, structured service content, and plain-text export formatting for newspapers or Word-based downstream systems.",
    ctaLabel: "See print exports",
    ctaHref: "/features/print-exports",
    sections: [
      {
        heading: "Draft once, publish twice",
        body: "Create the memorial page and the print-ready export from the same obituary record, avoiding duplicate formatting work.",
      },
      {
        heading: "Keep copy practical",
        body: "Use plain text and editable sections so staff can adapt the obituary for legacy systems without fighting a complicated editor.",
      },
    ],
  },
  "features/family-approvals": {
    slug: "features/family-approvals",
    eyebrow: "Feature",
    title: "Family Approvals Without Email Chains and Attachments",
    description:
      "Send one secure review link, capture approvals or requested changes, and keep the obituary process moving.",
    ctaLabel: "Try a sample approval page",
    ctaHref: "/demo",
    sections: [
      {
        heading: "One clear approval path",
        body: "Staff can request approval directly from the obituary record and families respond on a page tailored to the memorial draft.",
      },
      {
        heading: "Changes stay attached to the record",
        body: "Each comment, decision, and status transition remains tied to the obituary instead of getting lost in inboxes.",
      },
    ],
  },
  "features/print-exports": {
    slug: "features/print-exports",
    eyebrow: "Feature",
    title: "Print and Export Views for Newspaper Submission and Internal Reuse",
    description:
      "Prepare obituary copy for newspaper systems or Word-based internal workflows using a clean printer-friendly view and plain-text export.",
    ctaLabel: "View the print layout",
    ctaHref: "/demo",
    sections: [
      {
        heading: "Made for copy-paste reality",
        body: "Use a plain layout with condensed service facts and biography text that can be pasted into newspaper portals or documents without cleanup.",
      },
      {
        heading: "Reduce repeat formatting",
        body: "The print view uses the same source obituary record as the public page, so staff edit once and reuse everywhere.",
      },
    ],
  },
  "compare/frontrunner-alternative": {
    slug: "compare/frontrunner-alternative",
    eyebrow: "Comparison",
    title: "A FrontRunner Alternative for Obituary Intake and Family Approvals",
    description:
      "Choose a lighter obituary workflow portal when you need branded intake, approvals, and publishing without replacing your entire web platform.",
    ctaLabel: "Request a walkthrough",
    ctaHref: "/demo",
    sections: [
      {
        heading: "Focus instead of platform sprawl",
        body: "Harbor Memorial Portal is built around obituary submission, drafting, approvals, publishing, and export workflows rather than a broad bundled site stack.",
      },
      {
        heading: "Faster for smaller teams",
        body: "Independent funeral homes can launch a branded intake portal quickly and keep their current website footprint intact.",
      },
    ],
  },
  "compare/frazer-consultants-alternative": {
    slug: "compare/frazer-consultants-alternative",
    eyebrow: "Comparison",
    title: "A Frazer Consultants Alternative for Obituary Workflow Operations",
    description:
      "Use a workflow-first obituary portal when your priority is intake accuracy, approvals, and publishing speed.",
    ctaLabel: "Compare the workflow",
    ctaHref: "/demo",
    sections: [
      {
        heading: "Workflow-first instead of website-first",
        body: "This product centers the internal obituary process and the family approval loop rather than leading with broader memorial website capabilities.",
      },
      {
        heading: "Lower switching friction",
        body: "Launch the intake and approval experience as a branded layer while keeping the rest of your digital stack in place.",
      },
    ],
  },
  "resources/what-funeral-homes-need-in-an-obituary-submission-form": {
    slug: "resources/what-funeral-homes-need-in-an-obituary-submission-form",
    eyebrow: "Resource",
    title: "What Funeral Homes Need in an Obituary Submission Form",
    description:
      "A practical outline for the fields, family guidance, and workflow triggers that make an obituary submission form useful in daily operations.",
    ctaLabel: "See a live form",
    ctaHref: "/submit/harbor-house-funeral-home",
    sections: [
      {
        heading: "Ask for complete service and family context",
        body: "The strongest forms do more than collect a biography. They collect service details, clergy, charities, survivors, approval contacts, and photos in one session.",
      },
      {
        heading: "Tie the form to the draft workflow",
        body: "Submitting a form should create a draft obituary automatically so staff are not retyping the family’s information into a second system.",
      },
    ],
  },
  "resources/how-to-replace-email-based-family-approval-for-obituaries": {
    slug: "resources/how-to-replace-email-based-family-approval-for-obituaries",
    eyebrow: "Resource",
    title: "How to Replace Email-Based Family Approval for Obituaries",
    description:
      "A workflow guide for moving obituary review out of attachments and into a single secure approval page.",
    ctaLabel: "See approvals in action",
    ctaHref: "/features/family-approvals",
    sections: [
      {
        heading: "Keep the draft and the decision together",
        body: "Approval works best when the exact draft, the family’s comments, and the final decision live together in one place.",
      },
      {
        heading: "Make status visible to staff",
        body: "The approval step should update the obituary queue immediately so staff know when to revise, publish, or close the case.",
      },
    ],
  },
  "resources/website-obituary-vs-newspaper-obituary-managing-both-without-duplicate-work": {
    slug: "resources/website-obituary-vs-newspaper-obituary-managing-both-without-duplicate-work",
    eyebrow: "Resource",
    title: "Website Obituary vs Newspaper Obituary: Managing Both Without Duplicate Work",
    description:
      "Publish one obituary workflow to both the web memorial page and the print-ready newspaper version from the same source record.",
    ctaLabel: "See print exports",
    ctaHref: "/features/print-exports",
    sections: [
      {
        heading: "Keep one canonical record",
        body: "The cleanest operation starts from a single draft record that feeds the public obituary, the approval page, and the print export.",
      },
      {
        heading: "Use format-specific views, not duplicate entries",
        body: "The memorial page can be richer while the newspaper version stays tighter and plain text, all without re-entering content.",
      },
    ],
  },
};

export function getMarketingPage(slug: string) {
  return marketingPages[slug];
}
