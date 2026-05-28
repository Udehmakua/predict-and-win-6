import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const submitSchema = z.object({
  userId: z
    .string()
    .trim()
    .regex(/^[0-9]{4,20}$/, "User ID must be 4-20 digits"),
  weekNumber: z.number().int().min(1).max(53),
  year: z.number().int().min(2024).max(2100),
  predictions: z
    .array(
      z.object({
        matchId: z.string().min(1).max(50),
        pick: z.enum(["HOME", "DRAW", "AWAY"]),
      }),
    )
    .min(1)
    .max(10),
});

export const submitPredictions = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => submitSchema.parse(input))
  .handler(async ({ data }) => {
    // Block duplicates server-side (defence in depth — DB unique constraint is the truth)
    const { data: existing } = await supabaseAdmin
      .from("predictions")
      .select("id")
      .eq("user_id", data.userId)
      .eq("week_number", data.weekNumber)
      .eq("year", data.year)
      .maybeSingle();

    if (existing) {
      return {
        success: false as const,
        error: "You've already submitted your predictions for this week.",
      };
    }

    const { error } = await supabaseAdmin.from("predictions").insert({
      user_id: data.userId,
      week_number: data.weekNumber,
      year: data.year,
      predictions: data.predictions,
    });

    if (error) {
      if (error.code === "23505") {
        return {
          success: false as const,
          error: "You've already submitted your predictions for this week.",
        };
      }
      console.error("submitPredictions error:", error);
      return { success: false as const, error: "Could not save predictions. Try again." };
    }

    // Mirror write to external Supabase (best-effort; don't fail user submission)
    const extUrl = process.env.EXTERNAL_SUPABASE_URL;
    const extKey = process.env.EXTERNAL_SUPABASE_SERVICE_ROLE_KEY;
    if (extUrl && extKey) {
      try {
        const res = await fetch(`${extUrl}/rest/v1/predictions`, {
          method: "POST",
          headers: {
            apikey: extKey,
            Authorization: `Bearer ${extKey}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            user_id: data.userId,
            week_number: data.weekNumber,
            year: data.year,
            predictions: data.predictions,
          }),
        });
        if (!res.ok) {
          console.error("External mirror failed:", res.status, await res.text());
        }
      } catch (e) {
        console.error("External mirror error:", e);
      }
    }

    return { success: true as const };
  });


export const checkSubmission = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        userId: z.string().regex(/^[0-9]{4,20}$/),
        weekNumber: z.number().int(),
        year: z.number().int(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { data: existing } = await supabaseAdmin
      .from("predictions")
      .select("id, submitted_at")
      .eq("user_id", data.userId)
      .eq("week_number", data.weekNumber)
      .eq("year", data.year)
      .maybeSingle();
    return { alreadySubmitted: !!existing, submittedAt: existing?.submitted_at ?? null };
  });
