import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";

export interface SystemHealthData {
  timestamp: string;
  database: {
    status: "CONNECTED" | "DEGRADED" | "DISCONNECTED";
    active: boolean;
    latencyMs: number;
    provider: string;
    totalLeads: number;
    totalUsers: number;
    error?: string;
  };
  meta: {
    status: "LIVE_CONNECTED" | "AUTH_ERROR" | "SIMULATION";
    active: boolean;
    latencyMs?: number;
    displayPhoneNumber?: string;
    verifiedName?: string;
    qualityRating?: string;
    phoneNumberId?: string;
    adminWhatsAppNumber: string;
    hasToken: boolean;
    error?: string;
  };
  security: {
    webhookConfigured: boolean;
    appSecretConfigured: boolean;
    jwtActive: boolean;
    environment: string;
    appUrl: string;
  };
}

/**
 * Executes live health and diagnostics checks for:
 * 1. Database (Active, latency, provider, row count)
 * 2. Meta WhatsApp Cloud API (Probes Graph API, latency, verified name, quality score)
 * 3. Security (Webhook signature guard, verify token, JWT session guard)
 */
export async function getSystemHealth(): Promise<SystemHealthData> {
  // 1. Live Database Probe
  let dbStatus: "CONNECTED" | "DEGRADED" | "DISCONNECTED" = "DISCONNECTED";
  let dbActive = false;
  let dbLatencyMs = 0;
  let totalLeads = 0;
  let totalUsers = 0;
  let dbError: string | undefined;

  const dbStart = performance.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbLatencyMs = Math.max(1, Math.round(performance.now() - dbStart));
    dbActive = true;
    dbStatus = dbLatencyMs > 1500 ? "DEGRADED" : "CONNECTED";

    const [leadsCount, usersCount] = await Promise.all([
      prisma.lead.count().catch(() => 0),
      prisma.user.count().catch(() => 0),
    ]);
    totalLeads = leadsCount;
    totalUsers = usersCount;
  } catch (err: unknown) {
    dbLatencyMs = Math.round(performance.now() - dbStart);
    dbActive = false;
    dbStatus = "DISCONNECTED";
    dbError = err instanceof Error ? err.message : "Database connection refused";
  }

  // Detect Database Provider
  const dbUrl = env.DATABASE_URL || "";
  let provider = "Unknown Database";
  if (dbUrl.includes("neon.tech") || dbUrl.includes("postgres")) {
    provider = "Neon Serverless PostgreSQL (Cloud)";
  } else if (dbUrl.startsWith("file:") || dbUrl.includes("sqlite")) {
    provider = "SQLite (Local Engine)";
  } else if (dbUrl.includes("mysql")) {
    provider = "MySQL (Relational)";
  }

  // 2. Live Meta WhatsApp API Probe
  let metaStatus: "LIVE_CONNECTED" | "AUTH_ERROR" | "SIMULATION" = "SIMULATION";
  let metaActive = false;
  let metaLatencyMs: number | undefined;
  let displayPhoneNumber: string | undefined;
  let verifiedName: string | undefined;
  let qualityRating: string | undefined;
  let metaError: string | undefined;

  const hasToken = Boolean(env.META_ACCESS_TOKEN);
  const hasPhoneId = Boolean(env.META_PHONE_NUMBER_ID);

  if (hasToken && hasPhoneId) {
    const metaStart = performance.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(
        `https://graph.facebook.com/v21.0/${env.META_PHONE_NUMBER_ID}?fields=verified_name,display_phone_number,quality_rating`,
        {
          headers: {
            Authorization: `Bearer ${env.META_ACCESS_TOKEN}`,
          },
          signal: controller.signal,
          cache: "no-store",
        }
      );
      clearTimeout(timeoutId);
      metaLatencyMs = Math.max(1, Math.round(performance.now() - metaStart));

      const data = await res.json();
      if (res.ok && !data.error) {
        metaActive = true;
        metaStatus = "LIVE_CONNECTED";
        displayPhoneNumber = data.display_phone_number;
        verifiedName = data.verified_name;
        qualityRating = data.quality_rating;
      } else {
        metaActive = false;
        metaStatus = "AUTH_ERROR";
        metaError = data.error?.message || "Invalid or expired token";
      }
    } catch (err: unknown) {
      metaLatencyMs = Math.round(performance.now() - metaStart);
      metaActive = false;
      metaStatus = "AUTH_ERROR";
      const isAbort = err instanceof Error && err.name === "AbortError";
      metaError = isAbort ? "Meta API request timed out (6s)" : (err instanceof Error ? err.message : "Meta API unreachable");
    }
  }

  return {
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus,
      active: dbActive,
      latencyMs: dbLatencyMs,
      provider,
      totalLeads,
      totalUsers,
      error: dbError,
    },
    meta: {
      status: metaStatus,
      active: metaActive,
      latencyMs: metaLatencyMs,
      displayPhoneNumber,
      verifiedName,
      qualityRating,
      phoneNumberId: env.META_PHONE_NUMBER_ID,
      adminWhatsAppNumber: env.ADMIN_WHATSAPP_NUMBER,
      hasToken,
      error: metaError,
    },
    security: {
      webhookConfigured: Boolean(env.META_WEBHOOK_VERIFY_TOKEN),
      appSecretConfigured: Boolean(env.META_APP_SECRET),
      jwtActive: Boolean(env.JWT_SECRET),
      environment: env.NODE_ENV,
      appUrl: env.NEXT_PUBLIC_APP_URL,
    },
  };
}

