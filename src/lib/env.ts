import { z } from "zod";

/**
 * Fail-Closed Enterprise Environment & Secrets Validator (PILLAR 1)
 *
 * Implements strict schema enforcement across all runtime configurations.
 * If any mandatory variable is missing or malformed, bootstrap terminates
 * immediately with an actionable diagnostic, eliminating runtime fallback vulnerabilities.
 */

const BaseEnvSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL cannot be empty."),

  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters long to secure HS256 signatures."),

  ADMIN_WHATSAPP_NUMBER: z.string().min(10, "ADMIN_WHATSAPP_NUMBER must be at least 10 digits."),

  NEXT_PUBLIC_APP_URL: z.string().url("NEXT_PUBLIC_APP_URL must be a valid URL.").default("http://localhost:3000"),

  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  // Meta WhatsApp Cloud API credentials
  META_ACCESS_TOKEN: z.string().optional().default(""),
  META_PHONE_NUMBER_ID: z.string().optional().default(""),
  META_WEBHOOK_VERIFY_TOKEN: z.string().optional().default(""),
  META_APP_SECRET: z.string().optional().default(""),

  ALLOW_PROD_SEED: z.string().optional().default("false"),
});

// Production Refinement: Mandatory Meta API secrets at runtime in production
const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";

const ProductionEnvSchema = BaseEnvSchema.superRefine((data, ctx) => {
  // During build phase (static analysis & route compilation), allow compilation without active production Meta secrets
  if (data.NODE_ENV === "production" && !isBuildPhase) {
    if (!data.META_ACCESS_TOKEN) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "META_ACCESS_TOKEN is required in production mode.",
        path: ["META_ACCESS_TOKEN"],
      });
    }
    if (!data.META_PHONE_NUMBER_ID) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "META_PHONE_NUMBER_ID is required in production mode.",
        path: ["META_PHONE_NUMBER_ID"],
      });
    }
    if (!data.META_WEBHOOK_VERIFY_TOKEN) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "META_WEBHOOK_VERIFY_TOKEN is required in production mode.",
        path: ["META_WEBHOOK_VERIFY_TOKEN"],
      });
    }
    if (!data.META_APP_SECRET) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "META_APP_SECRET is required in production mode for webhook signature verification.",
        path: ["META_APP_SECRET"],
      });
    }
  }
});

function validateEnvironment() {
  const result = ProductionEnvSchema.safeParse(process.env);

  if (!result.success) {
    const errorDetails = result.error.issues
      .map((issue) => `  - [${issue.path.join(".") || "GLOBAL"}]: ${issue.message}`)
      .join("\n");

    const message = [
      "====================================================================",
      "🚨 [FATAL SECURITY MISCONFIGURATION] ENVIRONMENT VALIDATION FAILED",
      "====================================================================",
      errorDetails,
      "====================================================================",
      "The application refused to bootstrap under the Fail-Closed Principle.",
      "Check your .env / deployment configuration and restart.",
      "====================================================================",
    ].join("\n");

    console.error(message);
    throw new Error("Application terminated due to invalid environment security contracts.");
  }

  return result.data;
}

export const env = validateEnvironment();
export type Env = typeof env;
