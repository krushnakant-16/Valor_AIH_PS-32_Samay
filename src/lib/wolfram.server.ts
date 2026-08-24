// Server-only helper: calls Wolfram Alpha's Short Answers API and extracts a
// numeric result. The `.server.ts` extension keeps it out of client bundles.

const SHORT_ANSWERS_ENDPOINT = "https://api.wolframalpha.com/v1/result";

/**
 * Ask Wolfram Alpha to evaluate `expression` and return the first number in
 * its short answer. Returns `null` on any failure (network, non-200, no
 * number) so callers can fall back to a local estimate.
 */
export async function queryWolframShort(
  expression: string,
  appId: string,
): Promise<number | null> {
  const url = new URL(SHORT_ANSWERS_ENDPOINT);
  url.searchParams.set("input", expression);
  url.searchParams.set("appid", appId);
  url.searchParams.set("units", "metric");

  try {
    const res = await fetch(url, { method: "GET" });
    // The Short Answers API returns 501 with a text explanation when it
    // cannot compute an answer — treat that as "no result".
    if (!res.ok) return null;
    const text = (await res.text()).trim();
    if (!text || text.startsWith("Wolfram")) return null;
    return parseFirstNumber(text);
  } catch {
    return null;
  }
}

function parseFirstNumber(text: string): number | null {
  const match = text.match(/-?\d+(\.\d+)?/);
  if (!match) return null;
  const value = Number(match[0]);
  return Number.isFinite(value) ? value : null;
}
