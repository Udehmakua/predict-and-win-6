import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { validateBetkingUserId } from "@/lib/user-id-validation";

const userIdSchema = z
  .string()
  .trim()
  .superRefine((val, ctx) => {
    const r = validateBetkingUserId(val);
    if (!r.ok) ctx.addIssue({ code: z.ZodIssueCode.custom, message: r.reason });
  });

const submitSchema = z.object({
  userId: userIdSchema,
  firstName: z.string().trim().min(1, "First name is required").max(50).regex(/^[A-Za-z][A-Za-z'\-\s]*$/, "Letters only"),
  lastName: z.string().trim().min(1, "Last name is required").max(50).regex(/^[A-Za-z][A-Za-z'\-\s]*$/, "Letters only"),
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

    return { success: true as const };
  });


export const checkSubmission = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        userId: userIdSchema,
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
