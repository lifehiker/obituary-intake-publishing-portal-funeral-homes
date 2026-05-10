type EventPayload = Record<string, string | number | boolean | null | undefined>;

export async function trackEvent(event: string, payload: EventPayload = {}) {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

  if (!key) {
    console.info("[analytics] noop", event, payload);
    return;
  }

  await fetch(`${process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com"}/capture/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api_key: key,
      event,
      distinct_id: payload.distinctId?.toString() || "server",
      properties: payload,
    }),
    cache: "no-store",
  }).catch((error) => {
    console.warn("[analytics] failed", error);
  });
}
