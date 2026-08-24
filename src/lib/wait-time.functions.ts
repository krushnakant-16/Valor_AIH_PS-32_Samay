import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { queryWolframShort } from "./wolfram.server";

const Input = z.object({
  peopleAhead: z.number().int().min(0),
  avgConsultMinutes: z.number().positive(),
  counters: z.number().int().min(1),
});

export type WaitEstimate = {
  minutes: number;
  source: "wolfram" | "fallback";
};

/**
 * Estimates a patient's wait time. Sends a parallel-server queueing
 * expression to Wolfram Alpha (people ahead shared across open counters,
 * each consult taking the department's average) and returns the computed
 * minutes. Falls back to the naive formula if Wolfram is unavailable or the
 * AppID is missing — never throws.
 */
export const estimateWaitTime = createServerFn({ method: "POST" })
  .inputValidator((data) => Input.parse(data))
  .handler(async ({ data }): Promise<WaitEstimate> => {
    const appId = process.env["WOLFRAM_APPID"];
    const fallback = Math.max(
      0,
      Math.round((data.peopleAhead * data.avgConsultMinutes) / data.counters),
    );
    if (!appId) return { minutes: fallback, source: "fallback" };

    // (peopleAhead + 1) consults served in parallel across `counters` rooms,
    // each taking avgConsultMinutes. Wolfram evaluates the arithmetic.
    const expr = `(${data.peopleAhead} + 1) * ${data.avgConsultMinutes} / ${data.counters}`;
    const wolfram = await queryWolframShort(expr, appId);
    if (wolfram == null || !Number.isFinite(wolfram)) {
      return { minutes: fallback, source: "fallback" };
    }
    return { minutes: Math.max(0, Math.round(wolfram)), source: "wolfram" };
  });
