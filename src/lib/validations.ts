import { z } from "zod";

/**
 * Strict Zod validation schemas for API inputs
 */

// 1. Public Lead Ingestion Schema
export const LeadSubmissionSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters"),
  phone: z
    .string()
    .trim()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number cannot exceed 15 digits"),
  email: z
    .string()
    .trim()
    .email("Invalid email format")
    .max(120, "Email cannot exceed 120 characters")
    .optional()
    .or(z.literal(""))
    .nullable(),
  city: z.string().trim().max(100).optional().nullable(),
  totalDebt: z.string().trim().max(50).optional().nullable(),
  totalDebtRange: z.string().trim().max(50).optional().nullable(),
  loanType: z.string().trim().max(100).optional().nullable(),
  legalIssue: z.string().trim().max(100).optional().nullable(),
  harassmentLevel: z.string().trim().max(100).optional().nullable(),
  facingHarassment: z.boolean().optional().nullable(),
  banks: z.string().trim().max(200).optional().nullable(),
  lenders: z.string().trim().max(200).optional().nullable(),
  overdueStatus: z.string().trim().max(50).optional().nullable(),
  settlementReadiness: z.string().trim().max(100).optional().nullable(),
  consultationMode: z.string().trim().max(50).optional().nullable(),
  consultationSlot: z.string().trim().max(100).optional().nullable(),
  preferredCallbackTime: z.string().trim().max(100).optional().nullable(),
  message: z.string().trim().max(3000, "Message cannot exceed 3000 characters").optional().nullable(),
  source: z.string().trim().max(80).optional().nullable(),
  honeypot: z.string().max(100).optional().nullable(),
  website: z.string().max(100).optional().nullable(),
  companyFax: z.string().max(100).optional().nullable(),
  consentGiven: z.boolean().optional().nullable(),
});

export type LeadSubmissionInput = z.infer<typeof LeadSubmissionSchema>;

// 2. Admin Lead Modification Schema
export const AdminLeadUpdateSchema = z.object({
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
  nextFollowUpAt: z.union([z.string(), z.date()]).nullable().optional(),
  fullName: z.string().trim().min(2).max(100).optional(),
  email: z.string().trim().email().max(120).nullable().optional().or(z.literal("")),
  city: z.string().trim().max(100).nullable().optional(),
  legalIssue: z.string().trim().max(100).optional(),
  lenders: z.string().trim().max(200).nullable().optional(),
  totalDebtRange: z.string().trim().max(50).nullable().optional(),
  overdueStatus: z.string().trim().max(50).nullable().optional(),
  harassmentLevel: z.string().trim().max(100).nullable().optional(),
  message: z.string().trim().max(3000).nullable().optional(),
  unreadCount: z.number().int().min(0).max(9999).optional(),
});

export type AdminLeadUpdateInput = z.infer<typeof AdminLeadUpdateSchema>;

// 3. Admin Authentication Login Schema
export const LoginSubmissionSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address")
    .max(120, "Email cannot exceed 120 characters"),
  password: z
    .string()
    .min(1, "Password cannot be empty")
    .max(128, "Password length exceeds safety limit"),
});

export type LoginSubmissionInput = z.infer<typeof LoginSubmissionSchema>;
