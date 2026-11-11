import { z } from "zod";

/**
 * Enterprise Strict Data Contracts & Validation Pipeline (PILLAR 2)
 *
 * Implements strict whitelist validation, regex bounds, HTML sanitization,
 * and .strict() enforcement to reject unexpected payload parameters.
 */

function sanitizeHtml(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .trim();
}

// 1. Strict Lead Ingestion Contract (Public Form Boundary)
export const LeadIngestionSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name cannot exceed 100 characters")
      .transform((val) => sanitizeHtml(val)),

    phone: z
      .string()
      .trim()
      .regex(
        /^(\+91|91|0)?[6-9]\d{9}$/,
        "Please provide a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9."
      ),

    email: z
      .string()
      .trim()
      .email("Please enter a valid email address.")
      .max(120, "Email cannot exceed 120 characters")
      .optional()
      .or(z.literal(""))
      .nullable(),

    city: z.string().trim().max(100).optional().nullable().transform((val) => (val ? sanitizeHtml(val) : val)),
    totalDebt: z.string().trim().max(50).optional().nullable(),
    totalDebtRange: z.string().trim().max(50).optional().nullable(),
    loanType: z.string().trim().max(100).optional().nullable(),
    legalIssue: z.string().trim().max(100).optional().nullable(),
    harassmentLevel: z.string().trim().max(100).optional().nullable(),
    facingHarassment: z.boolean().optional().nullable(),
    banks: z.string().trim().max(200).optional().nullable().transform((val) => (val ? sanitizeHtml(val) : val)),
    lenders: z.string().trim().max(200).optional().nullable().transform((val) => (val ? sanitizeHtml(val) : val)),
    overdueStatus: z.string().trim().max(50).optional().nullable(),
    settlementReadiness: z.string().trim().max(100).optional().nullable(),
    consultationMode: z.string().trim().max(50).optional().nullable(),
    consultationSlot: z.string().trim().max(100).optional().nullable(),
    preferredCallbackTime: z.string().trim().max(100).optional().nullable(),

    message: z
      .string()
      .trim()
      .max(3000, "Case notes cannot exceed 3000 characters")
      .optional()
      .nullable()
      .transform((val) => (val ? sanitizeHtml(val) : val)),

    source: z.string().trim().max(80).optional().nullable(),

    // Anti-spam bot honeypots
    honeypot: z.string().max(100).optional().nullable(),
    website: z.string().max(100).optional().nullable(),
    companyFax: z.string().max(100).optional().nullable(),
    consentGiven: z.boolean().optional().nullable(),
  })
  .strict();

export type LeadIngestionInput = z.infer<typeof LeadIngestionSchema>;

// 2. Strict Admin Lead Update Contract
export const AdminLeadUpdateSchema = z
  .object({
    status: z
      .enum([
        "NEW",
        "CONTACTED",
        "CONSULTATION_SCHEDULED",
        "DOCUMENTS_PENDING",
        "LEGAL_NOTICE_REPLY",
        "IN_SETTLEMENT_NEGOTIATION",
        "OTS_SANCTIONED",
        "FOLLOW_UP",
        "CONVERTED",
        "CLOSED",
        "DROPPED",
      ])
      .optional(),
    assignedToId: z.string().max(64).nullable().optional(),
    nextFollowUpAt: z.string().datetime().nullable().optional().or(z.literal("")),
    fullName: z.string().trim().min(2).max(100).optional().transform((val) => (val ? sanitizeHtml(val) : val)),
    email: z.string().trim().email().max(120).nullable().optional().or(z.literal("")),
    city: z.string().trim().max(100).nullable().optional().transform((val) => (val ? sanitizeHtml(val) : val)),
    legalIssue: z.string().trim().max(100).optional().transform((val) => (val ? sanitizeHtml(val) : val)),
    lenders: z.string().trim().max(200).nullable().optional().transform((val) => (val ? sanitizeHtml(val) : val)),
    totalDebtRange: z.string().trim().max(50).nullable().optional(),
    overdueStatus: z.string().trim().max(50).nullable().optional(),
    harassmentLevel: z.string().trim().max(100).nullable().optional(),
    message: z.string().trim().max(3000).nullable().optional().transform((val) => (val ? sanitizeHtml(val) : val)),
    unreadCount: z.number().int().min(0).max(9999).optional(),
  })
  .strict();

export type AdminLeadUpdateInput = z.infer<typeof AdminLeadUpdateSchema>;

// 3. Strict Authentication Contract
export const AuthLoginSchema = z
  .object({
    email: z
      .string()
      .trim()
      .email("Please provide a valid advocate email address.")
      .max(120, "Email cannot exceed 120 characters"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password length cannot exceed 100 characters"),
  })
  .strict();

export type AuthLoginInput = z.infer<typeof AuthLoginSchema>;

// 4. Strict Reminder Contracts
export const ReminderToggleSchema = z
  .object({
    reminderId: z.string().min(1, "reminderId is required"),
    isCompleted: z.boolean(),
  })
  .strict();

export const ReminderCreateSchema = z
  .object({
    scheduledAt: z.string().datetime("Valid ISO datetime required"),
    note: z.string().trim().max(500, "Note cannot exceed 500 characters").optional().default("Follow up with client"),
  })
  .strict();

// 5. Strict WhatsApp Outbound Message Contract
export const WhatsAppSendSchema = z
  .object({
    leadId: z.string().min(1, "leadId is required"),
    messageText: z.string().trim().max(3000, "Message cannot exceed 3000 characters").optional(),
    templateName: z.string().trim().max(100).optional(),
  })
  .strict()
  .refine((data) => Boolean(data.messageText || data.templateName), {
    message: "Either messageText or templateName must be provided.",
  });

export type WhatsAppSendInput = z.infer<typeof WhatsAppSendSchema>;

// 6. User Management & Access Control Contracts
export const CreateUserSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name cannot exceed 100 characters")
      .transform((val) => sanitizeHtml(val)),
    email: z
      .string()
      .trim()
      .email("Please provide a valid advocate email address.")
      .max(120, "Email cannot exceed 120 characters")
      .transform((val) => val.toLowerCase()),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password length cannot exceed 100 characters"),
    role: z.enum(["SUPER_ADMIN", "LEGAL_ADVISOR", "SUPPORT_AGENT"]),
  })
  .strict();

export type CreateUserInput = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = z
  .object({
    role: z.enum(["SUPER_ADMIN", "LEGAL_ADVISOR", "SUPPORT_AGENT"]).optional(),
    isActive: z.boolean().optional(),
  })
  .strict()
  .refine((data) => data.role !== undefined || data.isActive !== undefined, {
    message: "At least one field (role or isActive) must be provided to update.",
  });

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

// 7. Self-Service Password Change Contract
export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .max(100, "New password cannot exceed 100 characters"),
  })
  .strict();

export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;


// 8. WhatsApp Quick-Reply Template Contracts
export const WhatsAppTemplateSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2, "Template title must be at least 2 characters")
      .max(100, "Template title cannot exceed 100 characters"),
    content: z
      .string()
      .trim()
      .min(5, "Template content must be at least 5 characters")
      .max(3000, "Template content cannot exceed 3000 characters"),
    isActive: z.boolean().optional().default(true),
  })
  .strict();

export type WhatsAppTemplateInput = z.infer<typeof WhatsAppTemplateSchema>;

export const UpdateWhatsAppTemplateSchema = z
  .object({
    title: z.string().trim().min(2).max(100).optional(),
    content: z.string().trim().min(5).max(3000).optional(),
    isActive: z.boolean().optional(),
  })
  .strict()
  .refine(
    (data) => data.title !== undefined || data.content !== undefined || data.isActive !== undefined,
    { message: "At least one field (title, content, or isActive) must be provided to update." }
  );

export type UpdateWhatsAppTemplateInput = z.infer<typeof UpdateWhatsAppTemplateSchema>;

// 9. System Setting Contracts
export const SystemSettingUpdateSchema = z
  .object({
    key: z.string().trim().min(1, "Setting key is required"),
    value: z.string().trim().min(1, "Setting value is required"),
  })
  .strict();

export type SystemSettingUpdateInput = z.infer<typeof SystemSettingUpdateSchema>;
