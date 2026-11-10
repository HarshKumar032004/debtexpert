import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { WhatsAppChatView, ConversationItem } from "@/components/admin/whatsapp-chat-view";

export const dynamic = "force-dynamic";

export default async function AdminWhatsAppPage({
  searchParams,
}: {
  searchParams: Promise<{ leadId?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }

  const { leadId } = await searchParams;

  let conversationsRaw: Array<{
    id: string;
    referenceId: string;
    fullName: string;
    phone: string;
    city: string | null;
    status: string;
    totalDebtRange: string | null;
    harassmentLevel: string | null;
    legalIssue: string;
    unreadCount: number;
    lastMessageAt: Date;
    assignedTo: { id: string; name: string } | null;
    whatsAppMessages: Array<{
      id: string;
      content: string;
      direction: string;
      status: string;
      createdAt: Date;
    }>;
  }> = [];
  let staffMembers: Array<{ id: string; name: string; role: string }> = [];

  try {
    const [cRaw, sMembers] = await Promise.all([
      prisma.lead.findMany({
        orderBy: { lastMessageAt: "desc" },
        take: 60,
        select: {
          id: true,
          referenceId: true,
          fullName: true,
          phone: true,
          city: true,
          status: true,
          totalDebtRange: true,
          harassmentLevel: true,
          legalIssue: true,
          unreadCount: true,
          lastMessageAt: true,
          assignedTo: {
            select: { id: true, name: true },
          },
          whatsAppMessages: {
            orderBy: { createdAt: "desc" },
            take: 1,
            select: {
              id: true,
              content: true,
              direction: true,
              status: true,
              createdAt: true,
            },
          },
        },
      }),
      prisma.user.findMany({
        where: { isActive: true },
        select: { id: true, name: true, role: true },
      }),
    ]);
    conversationsRaw = cRaw;
    staffMembers = sMembers;
  } catch (err) {
    console.warn("Database query notice in AdminWhatsAppPage (database may still be initializing):", err);
  }

  const initialConversations: ConversationItem[] = conversationsRaw.map((c) => ({
    id: c.id,
    referenceId: c.referenceId,
    fullName: c.fullName,
    phone: c.phone,
    city: c.city,
    status: c.status,
    totalDebtRange: c.totalDebtRange,
    harassmentLevel: c.harassmentLevel,
    legalIssue: c.legalIssue,
    unreadCount: c.unreadCount,
    lastMessageAt: c.lastMessageAt.toISOString(),
    assignedTo: c.assignedTo,
    whatsAppMessages: c.whatsAppMessages.map((m) => ({
      id: m.id,
      content: m.content,
      direction: m.direction,
      status: m.status,
      createdAt: m.createdAt.toISOString(),
    })),
  }));

  return (
    <WhatsAppChatView
      initialConversations={initialConversations}
      initialActiveLeadId={leadId || null}
      staffMembers={staffMembers}
    />
  );
}
