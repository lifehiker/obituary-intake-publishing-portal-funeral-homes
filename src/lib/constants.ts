export const APP_NAME = "Harbor Memorial Portal";
export const DEFAULT_BRAND_COLOR = "#0F4C5C";
export const DEFAULT_SIGNIN_REDIRECT = "/dashboard";

export const PUBLIC_ROUTE_PREFIXES = [
  "/",
  "/pricing",
  "/demo",
  "/sign-in",
  "/sign-up",
  "/submit",
  "/approve",
  "/obituaries",
  "/api/auth",
  "/api/health",
  "/api/webhooks/stripe",
];

export const PROTECTED_ROUTE_PREFIXES = ["/dashboard", "/onboarding"];

export const STATUS_STYLES: Record<string, string> = {
  SUBMITTED: "bg-amber-100 text-amber-900",
  IN_REVIEW: "bg-slate-200 text-slate-900",
  DRAFTED: "bg-sky-100 text-sky-900",
  AWAITING_APPROVAL: "bg-orange-100 text-orange-900",
  APPROVED: "bg-emerald-100 text-emerald-900",
  PUBLISHED: "bg-primary/15 text-primary",
};

export const PLANS = [
  {
    name: "Starter",
    price: "$79",
    description: "For a single location replacing phone and email intake.",
    features: [
      "1 location and up to 3 staff users",
      "Branded intake portal and public memorial pages",
      "Family approvals and print exports",
    ],
    stripePriceEnv: "STRIPE_PRICE_STARTER",
  },
  {
    name: "Professional",
    price: "$149",
    description: "For growing teams that need reusable templates and more seats.",
    features: [
      "Up to 10 staff users",
      "Advanced section templates and custom approval messaging",
      "Multiple export layouts and priority support",
    ],
    stripePriceEnv: "STRIPE_PRICE_PROFESSIONAL",
  },
  {
    name: "Regional Chain",
    price: "$299",
    description: "For small chains managing multiple locations and shared standards.",
    features: [
      "Up to 5 locations with brand controls",
      "Shared templates and chain admin view",
      "White-label rollout support",
    ],
    stripePriceEnv: "STRIPE_PRICE_CHAIN",
  },
];
