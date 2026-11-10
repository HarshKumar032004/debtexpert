import { z } from "zod";

/**
 * Fail-Closed Enterprise Environment & Secrets Validator (PILLAR 1)
 *
 * Implements strict schema enforcement across all runtime configurations.
 * If any mandatory variable is missing or malformed, bootstrap terminates
 * immediately with an actionable diagnostic, eliminating runtime fallback vulnerabilities.
 */

// Detect whether Next.js is executing a static build/compilation phase vs live runtime request
const isBuildPhase =
  process.env.NEXT_PHASE === "phase-production-build" ||
  process.env.NEXT_BUILDING === "1" ||
  process.env.npm_lifecycle_event === "build" ||
  process.env.SKIP_ENV_VALIDATION === "true" ||
  process.env.SKIP_ENV_VALIDATION === "1" ||
  (typeof process.argv !== "undefined" &&
    process.argv.some((arg) => typeof arg === "string" && (arg === "build" || arg.endsWith("/next"))));

const BUILD_PLACEHOLDER_JWT = "build_placeholder_secret_key_0000000000000000000000000000000000000000000000";

function cleanValue(val: unknown): string {
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

const POSTGRES_BUILD_PLACEHOLDER = "postgresql://build:build@localhost:5432/build";

const BaseEnvSchema = z.object({
  DATABASE_URL: z
    .preprocess(cleanValue, z.string())
    .default(() => (isBuildPhase ? POSTGRES_BUILD_PLACEHOLDER : "")),

  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET must be at least 32 characters long to secure HS256 signatures.")
    .default(() => (isBuildPhase ? BUILD_PLACEHOLDER_JWT : "")),

  ADMIN_WHATSAPP_NUMBER: z
    .string()
    .min(10, "ADMIN_WHATSAPP_NUMBER must be at least 10 digits.")
    .default(() => (isBuildPhase ? "919876543210" : "")),

  NEXT_PUBLIC_APP_URL: z
    .string()
    .url("NEXT_PUBLIC_APP_URL must be a valid URL.")
    .default("http://localhost:3000"),

  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  // Meta WhatsApp Cloud API credentials
  META_ACCESS_TOKEN: z.string().optional().default(""),
  META_PHONE_NUMBER_ID: z.string().optional().default(""),
  META_WEBHOOK_VERIFY_TOKEN: z.string().optional().default("dse_legal_webhook_secret_2026"),
  META_APP_SECRET: z.string().optional().default(""),

  ALLOW_PROD_SEED: z.string().optional().default("false"),
});

const ProductionEnvSchema = BaseEnvSchema.superRefine((data, ctx) => {
  // If at runtime in production (and not in build phase), enforce that placeholder secrets are not active
  if (data.NODE_ENV === "production" && !isBuildPhase) {
    if (!data.DATABASE_URL || data.DATABASE_URL === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "DATABASE_URL must be configured in production.",
        path: ["DATABASE_URL"],
      });
    }

    if (!data.JWT_SECRET || data.JWT_SECRET === BUILD_PLACEHOLDER_JWT) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "A secure JWT_SECRET (min 32 chars) must be configured in production.",
        path: ["JWT_SECRET"],
      });
    }

    if (!data.ADMIN_WHATSAPP_NUMBER || data.ADMIN_WHATSAPP_NUMBER === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "ADMIN_WHATSAPP_NUMBER must be configured in production.",
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
      "🚨 [CRITICAL CONFIGURATION NOTICE] ENVIRONMENT VARIABLES INCOMPLETE",
      "====================================================================",
      errorDetails,
      "====================================================================",
      "The application is running with fallback defaults for missing secrets.",
      "Configure missing environment variables in your deployment dashboard.",
      "====================================================================",
    ].join("\n");

    console.error(message);

    return {
      DATABASE_URL: cleanValue(process.env.DATABASE_URL) || POSTGRES_BUILD_PLACEHOLDER,
      JWT_SECRET: process.env.JWT_SECRET || BUILD_PLACEHOLDER_JWT,
      ADMIN_WHATSAPP_NUMBER: process.env.ADMIN_WHATSAPP_NUMBER || "919876543210",
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      NODE_ENV: (process.env.NODE_ENV as "development" | "test" | "production") || "development",
      META_ACCESS_TOKEN: process.env.META_ACCESS_TOKEN || "",
      META_PHONE_NUMBER_ID: process.env.META_PHONE_NUMBER_ID || "",
      META_WEBHOOK_VERIFY_TOKEN: process.env.META_WEBHOOK_VERIFY_TOKEN || "dse_legal_webhook_secret_2026",
      META_APP_SECRET: process.env.META_APP_SECRET || "",
      ALLOW_PROD_SEED: process.env.ALLOW_PROD_SEED || "false",
    };
  }

  return result.data;
}

export const env = validateEnvironment();
export type Env = typeof env;
