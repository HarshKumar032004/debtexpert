import { z } from "zod";

/**
 * Enterprise Environment & Secrets Validator
 *
 * All secrets, connection strings, and API keys are strictly loaded via process.env.
 * No sensitive values, tokens, or database URLs are ever hardcoded in application code.
 */

// Detect whether Next.js is executing a static build/compilation phase
const isBuildPhase =
  process.env.NEXT_PHASE === "phase-production-build" ||
  process.env.NEXT_BUILDING === "1" ||
  process.env.npm_lifecycle_event === "build" ||
  process.env.SKIP_ENV_VALIDATION === "true" ||
  process.env.SKIP_ENV_VALIDATION === "1" ||
  (typeof process.argv !== "undefined" &&
    process.argv.includes("build") &&
    !process.argv.includes("dev"));

export function cleanEnvValue(val: unknown): string {
  if (typeof val !== "string") return "";
  let clean = val.trim();
  if (
    (clean.startsWith('"') && clean.endsWith('"')) ||
    (clean.startsWith("'") && clean.endsWith("'"))
  ) {
    clean = clean.slice(1, -1).trim();
  }
  return clean;
}

const BaseEnvSchema = z.object({
  DATABASE_URL: z
    .preprocess(cleanEnvValue, z.string())
    .default(() => (isBuildPhase ? "" : (process.env.DATABASE_URL ? cleanEnvValue(process.env.DATABASE_URL) : ""))),

  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET must be at least 32 characters long to secure HS256 signatures.")
    .default(() => (isBuildPhase ? "build_placeholder_secret_key_minimum_32_characters" : "")),

  ADMIN_WHATSAPP_NUMBER: z
    .string()
    .min(10, "ADMIN_WHATSAPP_NUMBER must be at least 10 digits.")
    .default(() => (isBuildPhase ? "919876543210" : "")),

  NEXT_PUBLIC_APP_URL: z
    .string()
    .url("NEXT_PUBLIC_APP_URL must be a valid URL.")
    .default("http://localhost:3000"),

  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  // Meta WhatsApp Cloud API credentials (strictly via environment variables)
  META_ACCESS_TOKEN: z.string().optional().default(""),
  META_PHONE_NUMBER_ID: z.string().optional().default(""),
  META_WEBHOOK_VERIFY_TOKEN: z.string().optional().default(""),
  META_APP_SECRET: z.string().optional().default(""),

  ALLOW_PROD_SEED: z.string().optional().default("false"),
});

const ProductionEnvSchema = BaseEnvSchema.superRefine((data, ctx) => {
  // If at runtime in production (and not in build phase), enforce that required secrets are present
  if (data.NODE_ENV === "production" && !isBuildPhase) {
    if (!data.DATABASE_URL || data.DATABASE_URL === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "DATABASE_URL must be configured in production environment variables.",
        path: ["DATABASE_URL"],
      });
    }

    if (!data.JWT_SECRET || data.JWT_SECRET.includes("build_placeholder")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "A secure JWT_SECRET (min 32 chars) must be configured in production environment variables.",
        path: ["JWT_SECRET"],
      });
    }

    if (!data.ADMIN_WHATSAPP_NUMBER || data.ADMIN_WHATSAPP_NUMBER === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "ADMIN_WHATSAPP_NUMBER must be configured in production environment variables.",
        path: ["ADMIN_WHATSAPP_NUMBER"],
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
      "🚨 [CONFIGURATION WARNING] ENVIRONMENT VARIABLES VALIDATION NOTICE",
      "====================================================================",
      errorDetails,
      "====================================================================",
      "Ensure all required variables are configured in your .env or deployment dashboard.",
      "====================================================================",
    ].join("\n");

    console.warn(message);

    return {
      DATABASE_URL: cleanEnvValue(process.env.DATABASE_URL),
      JWT_SECRET: cleanEnvValue(process.env.JWT_SECRET),
      ADMIN_WHATSAPP_NUMBER: cleanEnvValue(process.env.ADMIN_WHATSAPP_NUMBER) || "919876543210",
      NEXT_PUBLIC_APP_URL: cleanEnvValue(process.env.NEXT_PUBLIC_APP_URL) || "http://localhost:3000",
      NODE_ENV: (process.env.NODE_ENV as "development" | "test" | "production") || "development",
      META_ACCESS_TOKEN: cleanEnvValue(process.env.META_ACCESS_TOKEN),
      META_PHONE_NUMBER_ID: cleanEnvValue(process.env.META_PHONE_NUMBER_ID),
      META_WEBHOOK_VERIFY_TOKEN: cleanEnvValue(process.env.META_WEBHOOK_VERIFY_TOKEN),
      META_APP_SECRET: cleanEnvValue(process.env.META_APP_SECRET),
      ALLOW_PROD_SEED: cleanEnvValue(process.env.ALLOW_PROD_SEED) || "false",
    };
  }

  return result.data;
}

export const env = validateEnvironment();
export type Env = typeof env;
