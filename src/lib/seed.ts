import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { env } from "@/lib/env";

export async function seedTemplatesAndSettings() {
  try {
    // 1. Ensure AUTO_ASSIGN_LEADS setting exists
    const existingAutoAssign = await prisma.systemSetting.findUnique({
      where: { key: "AUTO_ASSIGN_LEADS" },
    });
    if (!existingAutoAssign) {
      await prisma.systemSetting.create({
        data: {
          key: "AUTO_ASSIGN_LEADS",
          value: "false",
        },
      });
      console.log("⚙️ Seeded default system setting: AUTO_ASSIGN_LEADS = 'false'");
    }

    // 2. Ensure WhatsApp Templates exist
    const templateCount = await prisma.whatsAppTemplate.count();
    if (templateCount === 0) {
      const defaultTemplates = [
        {
          title: "📋 Document Checklist",
          content:
            "Kindly share your loan sanction letters, latest statement of accounts, and any collection notices you have received.",
          isActive: true,
        },
        {
          title: "⏰ Working Hours",
          content:
            "Our legal team is available Mon–Fri, 9 AM – 5 PM IST. Our senior advocate panel is actively auditing your loan portfolio.",
          isActive: true,
        },
        {
          title: "⚖️ Notice Audit",
          content:
            "Please send a clear photo or PDF of the legal notice / Section 138 demand letter you received so our advocate can inspect the statutory timelines.",
          isActive: true,
        },
        {
          title: "🛑 Direct Payment Warning",
          content:
            "CRITICAL WARNING: Never pay any recovery agent via personal UPI or cash. All legitimate settlement payments are made directly to the bank account against a verified OTS sanction letter.",
          isActive: true,
        },
      ];

      for (const t of defaultTemplates) {
        await prisma.whatsAppTemplate.create({ data: t });
      }
      console.log("📱 Seeded 4 default legal WhatsApp quick-reply templates.");
    }
  } catch (err) {
    console.warn("Notice: Error ensuring default templates/settings:", err);
  }
}

export async function seedDatabaseIfNeeded() {
  try {
    // Defensive check: Disable automatic cold-start seeding in production unless explicitly opted in (Pillar 6)
    if (env.NODE_ENV === "production" && env.ALLOW_PROD_SEED !== "true") {
      return { seeded: false, message: "Automated cold-start seeding disabled in production environment." };
    }

    // Ensure system settings & templates are populated
    await seedTemplatesAndSettings();

    const existingUsers = await prisma.user.count();
    if (existingUsers > 0) {
      return { seeded: false, message: "Database already contains users." };
    }


    console.log("🌱 Database is empty. Commencing automated CRM initialization & seed...");

    // 1. Create Core Staff Users
    const superAdminPassword = await hashPassword("Admin@12345");
    const advisorPassword = await hashPassword("Advisor@12345");
    const supportPassword = await hashPassword("Support@12345");

    const superAdmin = await prisma.user.create({
      data: {
        email: "admin@debtsupportexpert.com",
        name: "Chief Legal Administrator",
        passwordHash: superAdminPassword,
        role: "SUPER_ADMIN",
        isActive: true,
      },
    });

    const legalAdvisor = await prisma.user.create({
      data: {
        email: "advocate.sharma@debtsupportexpert.com",
        name: "Advocate Alok Sharma (High Court Panelist)",
        passwordHash: advisorPassword,
        role: "LEGAL_ADVISOR",
        isActive: true,
      },
    });

    const supportAgent = await prisma.user.create({
      data: {
        email: "support@debtsupportexpert.com",
        name: "Kavita Rao (Legal Intake Desk)",
        passwordHash: supportPassword,
        role: "SUPPORT_AGENT",
        isActive: true,
      },
    });

    // 2. Realistic Indian Borrower Leads
    // Lead 1: Rahul Sharma - Mumbai (Harassment Emergency)
    const lead1 = await prisma.lead.create({
      data: {
        referenceId: "DSE-MUM849",
        fullName: "Rahul Sharma",
        phone: "919820112233",
        email: "rahul.sharma87@gmail.com",
        city: "Mumbai, Maharashtra",
        source: "HERO_QUICK_FORM",
        legalIssue: "Personal Loan NPA & Recovery Harassment",
        lenders: "HDFC Bank, Bajaj Finance",
        totalDebtRange: "₹8,50,000",
        overdueStatus: "3–6 Months",
        harassmentLevel: "Harassment Calls & Home Visits",
        settlementReadiness: "Ready with 40% lump-sum funds",
        status: "NEW",
        assignedToId: legalAdvisor.id,
        unreadCount: 1,
        message: "Recovery agents visited my elderly parents' house in Andheri West yesterday. Need immediate anti-harassment shield.",
        consentGiven: true,
      },
    });

    await prisma.whatsAppMessage.createMany({
      data: [
        {
          leadId: lead1.id,
          direction: "OUTBOUND",
          type: "text",
          content: `⚖️ Debt Support Expert — Case Ref #DSE-MUM849 registered. Our High Court advocates are reviewing your portfolio.`,
          status: "DELIVERED",
          sentById: "SYSTEM_AUTO_WELCOME",
        },
        {
          leadId: lead1.id,
          direction: "INBOUND",
          type: "text",
          content: `Sir please call me urgent, Bajaj agents are calling my office colleagues and threatening to visit my workplace.`,
          status: "READ",
        },
      ],
    });

    await prisma.leadNote.create({
      data: {
        leadId: lead1.id,
        authorId: legalAdvisor.id,
        authorName: legalAdvisor.name,
        content: "Drafted formal Section 2(1)(d) harassment representation letter to HDFC & Bajaj nodal officers. Injunction ready if home visits persist.",
      },
    });

    await prisma.followUpReminder.create({
      data: {
        leadId: lead1.id,
        assignedToId: legalAdvisor.id,
        scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        note: "Call Rahul back with anti-harassment police intimation copy",
        isCompleted: false,
      },
    });

    await prisma.activityLog.create({
      data: {
        leadId: lead1.id,
        userId: legalAdvisor.id,
        actorName: legalAdvisor.name,
        action: "LEAD_CREATED",
        details: "Ingested via Hero Quick Form with Harassment Emergency flag",
      },
    });

    // Lead 2: Priya Patel - Ahmedabad (Credit Card Spiral & Sec 138 Notice)
    const lead2 = await prisma.lead.create({
      data: {
        referenceId: "DSE-AHM294",
        fullName: "Priya Patel",
        phone: "919879123456",
        email: "priya.patel.design@yahoo.com",
        city: "Ahmedabad, Gujarat",
        source: "CONTACT_EVALUATION",
        legalIssue: "Credit Card Outstanding & Legal Notice Sec 138",
        lenders: "ICICI Bank, SBI Card, Axis Bank",
        totalDebtRange: "₹14,20,000",
        overdueStatus: "6+ Months NPA",
        harassmentLevel: "Legal Notice Received",
        settlementReadiness: "Wants full OTS before next court hearing",
        status: "CONTACTED",
        assignedToId: legalAdvisor.id,
        unreadCount: 0,
        message: "Received Section 138 NI Act legal notice from SBI Card advocate regarding bounced NACH mandates.",
        consentGiven: true,
      },
    });

    await prisma.whatsAppMessage.createMany({
      data: [
        {
          leadId: lead2.id,
          direction: "OUTBOUND",
          type: "text",
          content: `Hello Priya, Advocate Alok Sharma here from Debt Support Expert. Please send a clear photo of the Section 138 legal notice received from SBI Card.`,
          status: "READ",
          sentById: legalAdvisor.id,
        },
        {
          leadId: lead2.id,
          direction: "INBOUND",
          type: "text",
          content: `Sharing the notice PDF. Notice dated 20th Oct gave 15 days demand notice. Please reply to their advocate.`,
          status: "READ",
        },
      ],
    });

    await prisma.leadNote.create({
      data: {
        leadId: lead2.id,
        authorId: legalAdvisor.id,
        authorName: legalAdvisor.name,
        content: "Verified Section 138 statutory demand timeline. Prepared formal legal reply denying criminal intent and proposing structured mediation.",
      },
    });

    await prisma.activityLog.create({
      data: {
        leadId: lead2.id,
        userId: legalAdvisor.id,
        actorName: legalAdvisor.name,
        action: "STATUS_UPDATED",
        details: "Status changed to CONTACTED; Legal notice response under drafting",
      },
    });

    // Lead 3: Vikramaditya Singh - Gurugram (High EMI Burden Consultation)
    const lead3 = await prisma.lead.create({
      data: {
        referenceId: "DSE-NCR611",
        fullName: "Vikramaditya Singh",
        phone: "919910456789",
        email: "vikram.singh.tech@gmail.com",
        city: "Gurugram, Haryana",
        source: "CONSULTATION_BOOKING",
        legalIssue: "Multiple Loans & High EMI Burden",
        lenders: "Kotak Mahindra, HDFC Bank, RBL Bank, Tata Capital",
        totalDebtRange: "₹28,50,000",
        overdueStatus: "1–3 Months",
        harassmentLevel: "High EMI Burden",
        settlementReadiness: "Exploring EMI pause / moratorium roadmap",
        consultationMode: "Google Meet",
        consultationSlot: "Tomorrow at 3:00 PM IST",
        preferredCallbackTime: "Afternoon 12–5",
        status: "CONSULTATION_SCHEDULED",
        assignedToId: legalAdvisor.id,
        unreadCount: 0,
        message: "Total monthly EMIs are ₹1.4L while in-hand salary reduced to ₹90k due to IT layoff. Need debt restructuring without asset seizure.",
        consentGiven: true,
      },
    });

    await prisma.followUpReminder.create({
      data: {
        leadId: lead3.id,
        assignedToId: legalAdvisor.id,
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        note: "Conduct Google Meet consultation with Vikramaditya: Review 4 loan agreements & cash flow",
        isCompleted: false,
      },
    });

    // Lead 4: Ananya Sundaram - Bengaluru (Instant App Harassment)
    const lead4 = await prisma.lead.create({
      data: {
        referenceId: "DSE-BLR402",
        fullName: "Ananya Sundaram",
        phone: "919845789012",
        email: "ananya.sundaram@outlook.com",
        city: "Bengaluru, Karnataka",
        source: "ELIGIBILITY_WIZARD",
        legalIssue: "Digital Loan Apps & Privacy Violation",
        lenders: "KreditBee, MoneyView, Kissht",
        totalDebtRange: "₹4,20,000",
        overdueStatus: "1–3 Months",
        harassmentLevel: "Harassment Calls",
        settlementReadiness: "Ready to settle principal immediately",
        status: "FOLLOW_UP",
        assignedToId: supportAgent.id,
        unreadCount: 2,
        message: "Digital lending apps morphing photos and threatening contacts list. Need urgent cybercrime complaint and legal cease & desist.",
        consentGiven: true,
      },
    });

    await prisma.whatsAppMessage.create({
      data: {
        leadId: lead4.id,
        direction: "INBOUND",
        type: "text",
        content: `Agent called my cousin from an unknown VoIP number. Please issue the legal notice to digital lending app nodal officers today.`,
        status: "DELIVERED",
      },
    });

    // Lead 5: Rajesh Verma - Pune (MSME Loan Settlement OTS Converted)
    const lead5 = await prisma.lead.create({
      data: {
        referenceId: "DSE-PUN750",
        fullName: "Rajesh Verma",
        phone: "919765432100",
        email: "rajesh.verma.auto@gmail.com",
        city: "Pune, Maharashtra",
        source: "CALCULATOR",
        legalIssue: "MSME Business Loan Restructuring",
        lenders: "IDFC First Bank, Fullerton India",
        totalDebtRange: "₹16,00,000",
        overdueStatus: "6+ Months NPA",
        harassmentLevel: "None",
        settlementReadiness: "Funds arranged via family property mortgage",
        status: "CONVERTED",
        assignedToId: superAdmin.id,
        unreadCount: 0,
        message: "Negotiating One Time Settlement (OTS) for auto-parts manufacturing firm. Target 55% waiver.",
        consentGiven: true,
      },
    });

    await prisma.leadNote.create({
      data: {
        leadId: lead5.id,
        authorId: superAdmin.id,
        authorName: superAdmin.name,
        content: "Bank sanctioned OTS letter received at ₹6.8 Lakhs (57.5% waiver). Verified genuine bank letterhead and authorized signatory.",
      },
    });

    console.log("✅ Seed completed successfully: 3 Staff Users and 5 Comprehensive Case Files initialized.");
    return {
      seeded: true,
      message: "Admin staff and sample case files seeded successfully.",
    };
  } catch (error) {
    console.error("Error running database seed:", error);
    throw error;
  }
}

// Standalone execution if executed directly via node/ts-node
if (typeof require !== "undefined" && typeof module !== "undefined" && require.main === module) {
  seedDatabaseIfNeeded()
    .then((res) => {
      console.log(res);
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
