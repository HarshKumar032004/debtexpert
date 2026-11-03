import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id: leadId } = await params;
    const body = await request.json();
    const content = body.content?.trim();

    if (!content) {
      return NextResponse.json(
        { success: false, error: "Note content cannot be empty." },
        { status: 400 }
      );
    }

    const note = await prisma.leadNote.create({
      data: {
        leadId,
        authorId: user.userId,
        authorName: user.name,
        content,
      },
    });

    // Log in ActivityLog
    await prisma.activityLog.create({
      data: {
        leadId,
        userId: user.userId,
        actorName: user.name,
        action: "NOTE_ADDED",
        details: `Internal advocate note added: "${content.slice(0, 80)}${content.length > 80 ? "..." : ""}"`,
      },
    });

    return NextResponse.json({
      success: true,
      note,
      message: "Note successfully added.",
    });
  } catch (error) {
    console.error("POST /api/admin/leads/[id]/notes error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error adding note" },
      { status: 500 }
    );
  }
}
