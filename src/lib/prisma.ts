import { PrismaClient } from "@prisma/client";

const DEFAULT_NEON_POSTGRES_URL =
  "postgresql://neondb_owner:npg_V2gTmroqKyX3@ep-soft-wind-bdrnr1e7-pooler.c-8.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

function cleanDbUrl(url?: string): string {
  if (!url || url.trim() === "") {
    return DEFAULT_NEON_POSTGRES_URL;
  }
  let clean = url.trim();
  // Strip surrounding quotes if accidentally pasted with quotes into Vercel dashboard
  if (
    (clean.startsWith('"') && clean.endsWith('"')) ||
    (clean.startsWith("'") && clean.endsWith("'"))
  ) {
    clean = clean.slice(1, -1).trim();
  }

  // If stale local config in memory points to SQLite "file:...", auto-switch to Neon PostgreSQL
  if (clean.startsWith("file:") || clean.startsWith("sqlite:")) {
    return DEFAULT_NEON_POSTGRES_URL;
  }

  return clean;
}

const dbUrl = cleanDbUrl(process.env.DATABASE_URL);
process.env.DATABASE_URL = dbUrl;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
