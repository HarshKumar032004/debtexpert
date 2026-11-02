import { ServicePageData } from "@/types/service";
import { siteConfig } from "@/config/site";

export const antiHarassmentData: ServicePageData = {
  slug: "anti-harassment",
  serviceName: "Anti-Harassment & Legal Shield",
  shortTitle: "Stop Harassment",
  badge: "Enforcing RBI Circular on Recovery Agents (August 2022)",
  h1Title: "Stop Recovery Agent Harassment in India | RBI Guidelines & Legal Notice Shield",
  heroSubtitle:
    "You do not have to live in fear of abusive recovery agents, unauthorized home visits, or threats to your family. Our High Court empanelled advocates serve formal Cease & Desist notices and enforce the RBI August 2022 Circular, legally halting harassment within 24 to 48 hours and escalating violations to the RBI Banking Ombudsman.",
  canonicalUrl: `${siteConfig.url}/services/anti-harassment`,
  metaTitle: "Stop Recovery Agent Harassment in India | RBI Guidelines & Legal Notice Shield",
  metaDescription:
    "Stop recovery agent abuse, unlawful home visits, and calls to family within 24 hours. Our High Court empanelled advocates enforce RBI August 2022 Circular & file Ombudsman complaints.",
  metaKeywords: [
    "stop recovery agent harassment india",
    "rbi recovery agent guidelines 2022",
    "recovery agent calling family friends",
    "complaint against recovery agent rbi ombudsman",
    "legal notice to bank recovery harassment",
    "can loan recovery agent visit home",
    "police complaint against recovery agent",
    "debt harassment advocate lawyer",
  ],
  breadcrumbs: [
    { label: "Services", href: "/services" },
    { label: "Anti-Harassment & Legal Shield", href: "/services/anti-harassment" },
  ],
  defaultLoanType: "personal-loan",
  customWhatsAppMessage:
    "Hello Debt Support Expert, I am facing severe recovery agent harassment, home visits, and threats. I need immediate advocate protection.",
  stats: [
    { value: "24 - 48 Hrs", label: "Harassment Halted", description: "Cease & desist notice served" },
    { value: "100%", label: "RBI Circular Enforced", description: "Clause-by-clause legal compliance" },
    { value: "15,000+", label: "Borrowers Protected", description: "From abusive collection tactics" },
    { value: "Zero", label: "Tolerance for Abuse", description: "Direct Ombudsman escalation" },
  ],
  urgentNotice: {
    title: "Defaulting on a Loan is NOT a Crime Under Indian Law",
    text: "Aggressive recovery agents frequently impersonate police officers, threaten arrest warrants, or claim they are sending police teams to your house. Under Indian jurisprudence, failure to repay an unsecured debt due to genuine financial distress is strictly a civil matter. No police officer can arrest you for loan default.",
  },
  educationalSections: [
    {
      id: "illegal-mechanics-harassment",
      title: "The Illegal Mechanics of Third-Party Recovery Harassment in India",
      intro:
        "When an unsecured personal loan or credit card default crosses 60 to 90 days, commercial banks and NBFCs frequently outsource collection to third-party Direct Recovery Agents (DRAs). Understanding how these agencies operate empowers you to protect your rights.",
      subsections: [
        {
          title: "Why Banks Outsource to Unregulated Third-Party Collection Agencies",
          content: [
            "Third-party collection agencies operate on high commission structures—often earning 15% to 35% of any money they recover. Because these agents are not direct payroll employees of the bank, they frequently resort to illegal, coercive tactics to maximize their commissions.",
            "Agents use auto-dialing software to flood your phone with 40 to 80 calls a day from untraceable VoIP numbers, deliberately designed to cause psychological collapse, panic, and distress.",
          ],
        },
        {
          title: "Psychological Intimidation: Fake Police Warrants, Court Summons & Shaming",
          content: [
            "Common fraudulent tactics deployed by rogue recovery personnel include:",
          ],
          bulletPoints: [
            "Sending fake legal notices via WhatsApp displaying bogus court seals, fabricated FIR numbers, or forged police signatures.",
            "Impersonating Crime Branch, Tehsildar, or local police officers over the phone and threatening to raid your house with a police van.",
            "Threatening to contact your employer, HR manager, or corporate clients to destroy your professional career and get you fired.",
            "Visiting your residential society, screaming at your doorstep, and creating public scenes in front of neighbors and family members.",
          ],
        },
        {
          title: "The Statutory Truth: Loan Default is Strictly a Civil Dispute",
          content: [
            "Under Indian law, loan contracts are governed by the Indian Contract Act, 1872. A failure to service EMIs due to financial hardship (such as medical crisis or business slowdown) represents a simple breach of contract—a purely civil issue.",
            "The Supreme Court of India in numerous landmark decisions has clarified that the police cannot be utilized as debt recovery agents for banks. Threats of criminal arrest, non-bailable warrants, or immediate imprisonment are totally bogus and legally punishable.",
          ],
        },
      ],
    },
    {
      id: "rbi-august-2022-circular",
      title: "Your Inalienable Legal Rights Under the RBI August 2022 Circular",
      intro:
        "On August 12, 2022, the Reserve Bank of India issued a comprehensive directive (RBI/2022-23/108 DOR.ORG.REC.65/21.04.158/2022-23) governing the conduct of Recovery Agents across all Regulated Entities.",
      subsections: [
        {
          title: "1. Strict Calling Hours Restriction (8:00 AM to 7:00 PM Only)",
          content: [
            "Under Clause 2.1 of the RBI Circular, recovery agents cannot call you before 8:00 AM in the morning or after 7:00 PM in the evening under any circumstance whatsoever.",
            "Calls made late at night, early in the morning, or on national holidays constitute a direct regulatory offense. Furthermore, repeated persistent calling throughout the day designed to harass is an actionable violation.",
          ],
        },
        {
          title: "2. Absolute Ban on Contacting Family Members, Friends, or Employers",
          content: [
            "Agents are strictly barred from contacting your parents, spouse, children, siblings, friends, neighbors, or workplace colleagues. The circular explicitly prohibits contacting any third party whose name and contact information were not voluntarily pledged as co-borrowers or legal guarantors.",
            "Reaching out to third parties violates Section 43A of the Information Technology Act and infringes upon your Fundamental Right to Privacy under Article 21 of the Indian Constitution, as upheld by the 9-judge Constitution Bench in K.S. Puttaswamy v. Union of India.",
          ],
        },
        {
          title: "3. Mandatory Agent Identification & Prohibition of Coercive Visits",
          content:
            "Before any recovery agent can visit your home or place of work, they must strictly comply with mandatory statutory prerequisites:",
          bulletPoints: [
            "The bank must provide prior written intimation to the borrower specifying the date, time, and identity of the visiting recovery agent.",
            "The visiting agent must carry a valid bank identity card, an official authorization letter from the lending institution, and a certified copy of the loan default notice.",
            "Agents are strictly prohibited from using abusive or unparliamentary language, using physical force, or causing any public nuisance.",
          ],
        },
        {
          title: "4. Severe Regulatory Penalties for Lenders Violating the Fair Practices Code",
          content: [
            "The RBI has repeatedly penalized major private banks, public sector lenders, and NBFCs with multi-crore fines for rogue recovery practices. Under the Reserve Bank - Integrated Ombudsman Scheme, 2021, borrowers have the statutory right to file formal complaints against abusive lenders, entitling them to regulatory compensation for mental harassment.",
          ],
        },
      ],
    },
    {
      id: "when-to-seek-legal-protection",
      title: "When to Seek Immediate Legal Anti-Harassment Protection",
      intro:
        "Do not wait until recovery agents cross the line into physical intimidation or public humiliation. Legal intervention is most potent when deployed at the first sign of abuse.",
      subsections: [
        {
          title: "Warning Signs of Extortion and Criminal Intimidation",
          content: [
            "If an agent shifts from discussing repayment schedules to using abusive language, hurling insults regarding your character, threatening physical violence, or demanding unreceipted cash payments, you are no longer dealing with a standard recovery process—you are experiencing criminal intimidation under Section 351/352/356 of the Bharatiya Nyaya Sanhita (BNS) / Section 503/506 of the Indian Penal Code.",
          ],
        },
        {
          title: "Threats to Visit Your Workplace or Defame You Among Neighbors",
          content: [
            "Recovery personnel frequently threaten to visit your office reception or create a scene in front of your apartment society guard to shame you into borrowing from relatives. This is intentional criminal defamation. Our advocates immediately serve high-level legal notices to the bank's executive board, holding the institution vicariously liable for the agent's misconduct.",
          ],
        },
        {
          title: "Digital Loan Apps & Illegal Contact Book Siphoning",
          content: [
            "Instant digital lending apps frequently siphon borrowers' phone contact lists and gallery photos using intrusive Android permissions. Rogue agents then create defamatory WhatsApp groups with your relatives and circulate manipulated photos.",
            "Our cybersecurity and legal team files emergency petitions with the Ministry of Electronics & IT (MeitY), the Cyber Crime Cell, and the RBI Fintech Department to take down predatory apps and lodge criminal FIRs against extortion syndicates.",
          ],
        },
      ],
    },
    {
      id: "how-advocates-stop-harassment",
      title: "How Our High Court Empanelled Advocates Stop Harassment in 24 Hours",
      intro:
        "A formal legal intervention fundamentally transforms the dynamic between you and the lending institution. Here is our proven 4-stage anti-harassment shield:",
      subsections: [
        {
          title: "1. Formal Advocate Representation Notice & Vakalatnama",
          content: [
            "Within 24 hours of retaining our advisory, our advocates draft and dispatch an official Legal Representation Notice to the Bank Managing Director, Head of Collections, and Principal Nodal Officer.",
            "The notice invokes the RBI August 2022 Circular and informs the lender that you are represented by High Court counsel. Under Indian civil procedure, the bank is strictly instructed to cease all direct contact with you or your family and direct all future communications to our law office.",
          ],
        },
        {
          title: "2. Re-routing All Communications Through Legal Counsel",
          content: [
            "Once our notice is served, you are legally insulated. Whenever an agent calls, you simply state: 'My case is represented by legal advocates at Debt Support Expert. Please contact my legal counsel as per the formal advocate notice served to your bank.' Callers quickly back down when confronted with verified legal representation.",
          ],
        },
        {
          title: "3. Direct Escalation to the RBI Banking Ombudsman (CMS Portal)",
          content: [
            "If an overzealous agent violates our notice and continues harassment, we immediately file a formal regulatory complaint on the RBI Complaint Management System (CMS) against the bank's Principal Nodal Officer. Banks treat Ombudsman complaints with the utmost urgency, as unresolved grievances negatively impact their regulatory compliance ratings.",
          ],
        },
        {
          title: "4. Section 138 / Section 25 Defense & Lok Adalat Representation",
          content: [
            "If the lender issues court summons or arbitration notices, our advocates draft comprehensive legal replies, protect you from ex-parte orders, and represent you before the court or National Lok Adalat to negotiate a fair, harassment-free One-Time Settlement.",
          ],
        },
      ],
    },
  ],
  partnerInstitutionsTitle: "Financial Institutions We Enforce Fair Practice Compliance Against:",
  partnerInstitutions: [
    "HDFC Bank Collection Grievance Cell",
    "ICICI Bank Nodal Office",
    "State Bank of India (SBI) Internal Ombudsman",
    "Axis Bank Principal Nodal Officer",
    "Bajaj Finserv Customer Grievance Cell",
    "Kotak Mahindra Bank Legal Department",
    "Tata Capital Nodal Grievance Office",
    "Aditya Birla Finance Redressal Cell",
    "RBL Bank Collections Escalation",
    "IndusInd Bank Ombudsman Cell",
    "IDFC FIRST Bank Grievance Officer",
    "Piramal Finance Legal Team",
    "KreditBee / EarlySalary / MoneyTap",
    "Fullerton India (SMFG) Grievance",
    "Standard Chartered Legal Office",
  ],
  processTitle: "Our 4-Stage Legal Protection Protocol:",
  processSubtitle:
    "How our advocates establish an impenetrable legal shield between you and aggressive recovery departments.",
  processSteps: [
    {
      step: "Stage 01",
      title: "Advocate Representation Notice Served",
      description:
        "We serve an official legal notice to the Bank's Managing Director and Principal Nodal Officer within 24 hours, invoking the RBI August 2022 Circular.",
      badge: "Within 24 Hours",
    },
    {
      step: "Stage 02",
      title: "Communication Blackout for Recovery Callers",
      description:
        "All calls to your relatives, employers, and residence are formally barred; communications are strictly redirected to our legal office.",
      badge: "Immediate Relief",
    },
    {
      step: "Stage 03",
      title: "RBI Banking Ombudsman Escalation",
      description:
        "Any persistent rogue agent activity triggers an immediate formal complaint on the RBI CMS Portal against the bank's regulatory license.",
      badge: "Regulatory Power",
    },
    {
      step: "Stage 04",
      title: "Court Notice Defense & Peaceful Settlement",
      description:
        "We handle all arbitration or Section 138/25 notices, steering your dispute into a peaceful, highly discounted One-Time Settlement.",
      badge: "Final Resolution",
    },
  ],
  comparisonRows: [
    {
      feature: "Harassing Phone Calls (30-50 per day)",
      alone: "Continuous Abuse & Panic",
      debtSupport: "Halted in 24-48 Hours",
      aloneNote: "Agents call repeatedly, including late at night and early mornings.",
      debtSupportNote: "Advocate Cease & Desist Notice enforces strict RBI calling hour limits.",
    },
    {
      feature: "Calls to Relatives, Friends & Workplace Boss",
      alone: "Severe Social Humiliation",
      debtSupport: "100% Legally Blocked",
      aloneNote: "Agents leak your debt to employers, colleagues, and family members.",
      debtSupportNote: "We enforce Article 21 Privacy & Section 43A IT Act with criminal liability.",
    },
    {
      feature: "Unannounced Home Visits by Field Recovery Agents",
      alone: "Terrifying Doorstep Drama",
      debtSupport: "Visits Barred Without ID & Notice",
      aloneNote: "Goons visit unexpectedly and create scenes in your residential building.",
      debtSupportNote: "Notice mandates prior bank intimation, ID credentials, and police notice.",
    },
    {
      feature: "Police Arrest & Court Summons Threats",
      alone: "Constant Fear of Jail",
      debtSupport: "Debunked as 100% Civil Dispute",
      aloneNote: "Distressed borrowers believe fake WhatsApp warrants sent by agents.",
      debtSupportNote: "Our advocates clarify statutory rights and handle court notices legally.",
    },
    {
      feature: "Escalation to RBI Banking Ombudsman (CMS Portal)",
      alone: "Ignored by Bank Desk",
      debtSupport: "Direct Legal Regulatory Petition",
      aloneNote: "Individual customer care complaints are closed with canned replies.",
      debtSupportNote: "Advocate petitions subject bank to regulatory scrutiny and penalties.",
    },
    {
      feature: "Transition into Peaceful Debt Settlement",
      alone: "Extorted for Extra Penalties",
      debtSupport: "50% to 70% Discounted OTS",
      aloneNote: "Agents demand full penalty payments with zero valid NDC guarantee.",
      debtSupportNote: "We negotiate directly with Zonal Settlement Committees for clean closure.",
    },
  ],
  faqs: [
    {
      question: "What are my legal rights if a recovery agent threatens me or visits my home in India?",
      answer:
        "Under the RBI August 2022 Circular on Recovery Agents and Supreme Court rulings, you have the right to dignity, privacy, and peaceful enjoyment of your home. Recovery agents cannot call you before 8:00 AM or after 7:00 PM. They cannot visit your residence without prior written intimation from the bank, cannot speak to your neighbors or family, and must carry verified bank identity credentials. Verbal abuse or threats of violence are criminal offenses under the Indian Penal Code / Bharatiya Nyaya Sanhita.",
    },
    {
      question: "Can recovery agents contact my employer, colleagues, or parents?",
      answer:
        "No, absolutely not. Under the RBI Fair Practices Code and Article 21 of the Constitution of India (Right to Privacy), lenders and their agents are strictly barred from contacting third parties who are not co-borrowers or official guarantors. Calling your employer to jeopardize your job or calling your relatives to cause social humiliation violates Section 43A of the IT Act and constitutes criminal defamation. Our advocates serve formal notices to bank management to hold them vicariously liable for such illegal actions.",
    },
    {
      question: "Can police arrest me if I default on my loan or credit card in India?",
      answer:
        "No. Defaulting on a loan or credit card in India due to financial hardship is strictly a civil matter, NOT a criminal offense. The Supreme Court has repeatedly held that a failure to repay a loan cannot be equated with criminal cheating under Section 420 IPC / Section 318 BNS. The police have no legal power to register an FIR, issue an arrest warrant, or summon you to a police station for an unsecured loan default.",
    },
    {
      question: "How quickly does Debt Support Expert stop recovery agent harassment?",
      answer:
        "Within 24 to 48 hours. The moment you engage our advisory, our empanelled advocates serve a formal Advocate Representation Notice and Cease & Desist letter directly to the bank's Managing Director, Principal Nodal Officer, and Collection Head. This notice directs the bank to cease all direct contact with you and your family, requiring all future communications to be routed to our legal office.",
    },
    {
      question: "What should I do if an agent threatens me with a fake WhatsApp legal notice or police warrant?",
      answer:
        "Do NOT panic and do NOT make any payment. Rogue recovery agents frequently generate fake legal notices on fraudulent court letterheads or bogus police seals. Genuine court notices are never served via casual WhatsApp messages—they are delivered by registered post or court bailiffs. Forward the notice to our advocates immediately. We verify its authenticity, issue a counter legal notice, and file a police cybercrime complaint against the agent for forgery and extortion.",
    },
    {
      question: "What happens if a bank ignores your legal notice and continues to harass me?",
      answer:
        "If a lender or its recovery agency persists in harassment after receiving our advocate notice, we immediately escalate the violation to the RBI Banking Ombudsman via the Complaint Management System (CMS) and the lender's Board-appointed Internal Ombudsman. We also file complaints with the Cyber Crime Cell and Consumer Disputes Redressal Commission for severe deficiency in service, entitling you to monetary damages for mental distress.",
    },
  ],
};
