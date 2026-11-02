export interface CityDrtInfo {
  name: string;
  location: string;
  jurisdiction: string;
}

export interface CityClientStory {
  clientName: string;
  locality: string;
  originalDebt: string;
  settledAmount: string;
  waiver: string;
  lenders: string;
  quote: string;
}

export interface CityData {
  slug: string;
  cityName: string;
  state: string;
  region: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  heroSubtitle: string;
  popularAreas: string[];
  drtCourts: CityDrtInfo[];
  rbiOmbudsmanOffice: {
    officeName: string;
    address: string;
  };
  stats: {
    borrowersProtected: string;
    debtResolved: string;
    avgWaiver: string;
  };
  clientStory: CityClientStory;
  commonLendersInCity: string[];
  localFaqs: { question: string; answer: string }[];
}

export const citiesData: Record<string, CityData> = {
  "delhi-ncr": {
    slug: "delhi-ncr",
    cityName: "Delhi NCR",
    state: "National Capital Region",
    region: "North India",
    metaTitle: "Best Loan Settlement & Anti-Harassment Lawyers in Delhi NCR | Settle 50-70% Less",
    metaDescription:
      "Empanelled High Court advocates in Delhi NCR (Delhi, Noida, Gurugram, Faridabad, Ghaziabad). Settle personal loans and credit cards legally under RBI guidelines. Stop recovery agent harassment.",
    keywords: [
      "loan settlement lawyers delhi ncr",
      "debt settlement advocate gurugram",
      "stop recovery agent harassment noida delhi",
      "drt lawyer delhi sarfaesi",
      "credit card settlement agency delhi",
      "personal loan ots delhi",
    ],
    heroSubtitle:
      "Facing aggressive recovery calls in Delhi, Gurugram, Noida, or Faridabad? Our High Court empanelled litigation advocates enforce RBI guidelines, stay coercive actions before DRT Delhi, and negotiate direct One-Time Settlements with 50% to 70% debt waivers.",
    popularAreas: ["Connaught Place", "Gurugram Cyber City", "Noida Sector 62", "Dwarka", "Rohini", "Faridabad", "Ghaziabad"],
    drtCourts: [
      {
        name: "DRT-I, DRT-II & DRT-III Delhi",
        location: "Sansad Marg / Parliament Street, New Delhi",
        jurisdiction: "Jurisdiction over stressed banking disputes, SARFAESI appeals, and commercial credit recovery across NCT of Delhi.",
      },
      {
        name: "District Courts (Tis Hazari, Patiala House, Saket, Rohini)",
        location: "Central, South & North Delhi",
        jurisdiction: "Hearing Section 138 Negotiable Instruments Act cheque bounce summons and summary commercial recovery suits.",
      },
    ],
    rbiOmbudsmanOffice: {
      officeName: "Office of the RBI Banking Ombudsman (New Delhi)",
      address: "Reserve Bank of India, 6, Sansad Marg, New Delhi - 110001",
    },
    stats: {
      borrowersProtected: "3,800+",
      debtResolved: "₹14.5+ Cr",
      avgWaiver: "50% - 70%",
    },
    clientStory: {
      clientName: "Sanjay M.",
      locality: "Sector 56, Gurugram",
      originalDebt: "₹14,50,000 (2 Personal Loans + 1 Credit Card)",
      settledAmount: "₹4,80,000",
      waiver: "67% Waiver",
      lenders: "HDFC Bank & Bajaj Finserv",
      quote:
        "Recovery callers were threatening to come to my MNC office in Cyber City. Debt Support Expert served an advocate notice within 24 hours. The harassment stopped immediately, and both loans were settled with official No Dues Certificates.",
    },
    commonLendersInCity: ["HDFC Bank", "ICICI Bank", "SBI", "Axis Bank", "Kotak Mahindra", "Bajaj Finserv", "Tata Capital"],
    localFaqs: [
      {
        question: "How quickly can your advocates stop recovery visits in Delhi NCR?",
        answer:
          "Within 24 to 48 hours. Our legal team serves an immediate Advocate Representation & Cease-and-Desist notice directly to the bank's Head of Collections and the Principal Nodal Officer in New Delhi, barring all unauthorized home and workplace visits.",
      },
      {
        question: "Do you represent borrowers in DRT Delhi and District Courts?",
        answer:
          "Yes. Our empanelled advocates represent clients before DRT-I, II, and III at Parliament Street, as well as Patiala House, Saket, Tis Hazari, and Rohini courts for Section 138 cheque bounce defenses.",
      },
    ],
  },

  "mumbai": {
    slug: "mumbai",
    cityName: "Mumbai",
    state: "Maharashtra",
    region: "West India",
    metaTitle: "Best Loan Settlement & Anti-Harassment Advocates in Mumbai | 50-70% Debt Waiver",
    metaDescription:
      "Top banking litigation advocates in Mumbai, Navi Mumbai, and Thane. Settle credit cards and personal loans legally under RBI Fair Practices Code. Stop collection agent abuse.",
    keywords: [
      "loan settlement advocates mumbai",
      "debt settlement agency mumbai thane",
      "stop recovery agent calls mumbai navi mumbai",
      "drt mumbai ballard estate advocate",
      "credit card ots settlement mumbai",
    ],
    heroSubtitle:
      "Struggling with unmanageable debt in Mumbai, Thane, or Navi Mumbai? Our Bombay High Court empanelled advocates shield you from recovery agent intimidation and negotiate binding One-Time Settlements (OTS) with major banks headquartered right here in Mumbai.",
    popularAreas: ["Andheri", "Bandra Kurla Complex (BKC)", "Thane West", "Navi Mumbai (Vashi)", "Borivali", "Dadar", "Colaba"],
    drtCourts: [
      {
        name: "DRT-I, DRT-II & DRT-III Mumbai",
        location: "Ballard Estate / Fort, South Mumbai",
        jurisdiction: "Appellate and original jurisdiction for commercial debt, SARFAESI Section 17 appeals, and bank recovery actions across Mumbai and suburban areas.",
      },
      {
        name: "Bombay City Civil & Sessions Court",
        location: "Fort / Dindoshi, Mumbai",
        jurisdiction: "Adjudication of commercial recovery disputes and Section 138 cheque bounce appeals.",
      },
    ],
    rbiOmbudsmanOffice: {
      officeName: "Office of the RBI Banking Ombudsman (Mumbai-I & II)",
      address: "Reserve Bank of India, Byculla / Fort Office, Mumbai - 400001",
    },
    stats: {
      borrowersProtected: "4,200+",
      debtResolved: "₹18+ Cr",
      avgWaiver: "55% - 75%",
    },
    clientStory: {
      clientName: "Prashant K.",
      locality: "Andheri West, Mumbai",
      originalDebt: "₹22,00,000 (3 Credit Cards)",
      settledAmount: "₹6,60,000",
      waiver: "70% Waiver",
      lenders: "SBI Card, ICICI, Standard Chartered",
      quote:
        "Compounding 42% APR interest turned my credit cards into an endless nightmare. Debt Support Expert advocates audited my ledger, froze all finance charges, and closed all three cards for 70% less.",
    },
    commonLendersInCity: ["SBI Cards", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Mahindra", "RBL Bank", "Standard Chartered"],
    localFaqs: [
      {
        question: "Why is Mumbai a strategic advantage for debt settlement negotiations?",
        answer:
          "Almost all major Indian banks (SBI, HDFC, ICICI, Axis, Kotak, IDFC) have their corporate headquarters and apex Stressed Asset Committees located in Mumbai. Our advocates engage directly with senior committee heads rather than junior outsourced call centers.",
      },
      {
        question: "Can recovery agents create a scene in my residential co-operative society in Mumbai?",
        answer:
          "No. Doing so violates the Maharashtra Co-operative Societies Act, the Right to Privacy (Article 21), and the RBI August 2022 Circular. Our advocates serve formal notices to the bank and society management to immediately bar rogue agents from premises.",
      },
    ],
  },

  "bangalore": {
    slug: "bangalore",
    cityName: "Bengaluru",
    state: "Karnataka",
    region: "South India",
    metaTitle: "Best Loan Settlement & Anti-Harassment Lawyers in Bengaluru | Tech Worker Debt Relief",
    metaDescription:
      "Expert debt settlement advocates in Bengaluru for IT professionals and business owners. Settle personal loans and credit cards legally. Stop recovery threats in Whitefield, Koramangala & Indiranagar.",
    keywords: [
      "loan settlement lawyers bangalore",
      "debt settlement agency bengaluru",
      "stop recovery harassment it professionals bangalore",
      "drt bangalore indiranagar advocate",
      "personal loan settlement hdfc icici bangalore",
    ],
    heroSubtitle:
      "Are tech layoffs or salary cuts impacting your loan servicing in Bengaluru? Our Karnataka High Court empanelled advocates protect tech employees and business founders from aggressive recovery callers and negotiate lawful compromise settlements.",
    popularAreas: ["Whitefield", "Koramangala", "Indiranagar", "Electronic City", "HSR Layout", "Hebbal", "Jayanagar"],
    drtCourts: [
      {
        name: "DRT-I & DRT-II Bengaluru",
        location: "BDA Complex, Indira Nagar, Bengaluru",
        jurisdiction: "Hearing securitisation applications, SARFAESI injunctions, and commercial banking disputes across Karnataka.",
      },
      {
        name: "City Civil Court Complex",
        location: "Kempegowda Road, Bengaluru",
        jurisdiction: "Magistrate proceedings for Section 138 Negotiable Instruments Act and commercial summary suits.",
      },
    ],
    rbiOmbudsmanOffice: {
      officeName: "Office of the RBI Banking Ombudsman (Bengaluru)",
      address: "Reserve Bank of India, 10/3/8, Nrupathunga Road, Bengaluru - 560001",
    },
    stats: {
      borrowersProtected: "3,100+",
      debtResolved: "₹12.8+ Cr",
      avgWaiver: "50% - 70%",
    },
    clientStory: {
      clientName: "Ananya R.",
      locality: "HSR Layout, Bengaluru",
      originalDebt: "₹11,80,000 (Fintech App Loans + Personal Loan)",
      settledAmount: "₹4,10,000",
      waiver: "65% Waiver",
      lenders: "KreditBee, MoneyTap, Axis Bank",
      quote:
        "Fintech loan apps were threatening to message my LinkedIn connections and WhatsApp contacts. The advocates at Debt Support Expert intervened under IT Act Section 43A and stopped the extortion completely.",
    },
    commonLendersInCity: ["HDFC Bank", "ICICI Bank", "Axis Bank", "Canara Bank", "IDFC FIRST", "Bajaj Finserv", "Digital Loan Apps"],
    localFaqs: [
      {
        question: "Can recovery agents contact my IT employer in Bengaluru or message me on Slack/Teams?",
        answer:
          "Absolutely not. Contacting your employer or using professional social platforms to discuss personal debt is an egregious violation of data privacy and the RBI Fair Practices Code. We initiate immediate criminal defamation proceedings against such agencies.",
      },
    ],
  },

  "hyderabad": {
    slug: "hyderabad",
    cityName: "Hyderabad",
    state: "Telangana",
    region: "South India",
    metaTitle: "Best Loan Settlement Lawyers in Hyderabad & Cyberabad | Stop Recovery Harassment",
    metaDescription:
      "Empanelled legal advocates in Hyderabad and Secunderabad for personal loan and credit card settlements. Enforce RBI guidelines and save 50-70% on bank dues.",
    keywords: [
      "loan settlement lawyers hyderabad",
      "debt settlement agency cyberabad",
      "stop recovery agent calls hyderabad telangana",
      "drt hyderabad koti advocate",
      "credit card debt relief hyderabad",
    ],
    heroSubtitle:
      "Facing unmanageable debt in Hyderabad, Cyberabad, or Secunderabad? Our Telangana High Court empanelled advocates serve Cease & Desist notices and negotiate formal One-Time Settlements (OTS) with irrevocable No Dues Certificates.",
    popularAreas: ["HITEC City", "Gachibowli", "Madhapur", "Banjara Hills", "Jubilee Hills", "Secunderabad", "Kukatpally"],
    drtCourts: [
      {
        name: "DRT-I & DRT-II Hyderabad",
        location: "Triveni Complex, Koti, Hyderabad",
        jurisdiction: "Jurisdiction across Telangana and Andhra Pradesh for banking recovery litigations and SARFAESI Securitisation Applications.",
      },
    ],
    rbiOmbudsmanOffice: {
      officeName: "Office of the RBI Banking Ombudsman (Hyderabad)",
      address: "Reserve Bank of India, 6-1-56, Secretariat Road, Saifabad, Hyderabad - 500004",
    },
    stats: {
      borrowersProtected: "2,600+",
      debtResolved: "₹9.5+ Cr",
      avgWaiver: "50% - 70%",
    },
    clientStory: {
      clientName: "Venkat R.",
      locality: "Gachibowli, Hyderabad",
      originalDebt: "₹16,00,000 (Personal Loan + Credit Card)",
      settledAmount: "₹5,20,000",
      waiver: "68% Waiver",
      lenders: "SBI & Kotak Mahindra",
      quote:
        "After my business experienced heavy cash flow disruption, recovery calls reached 50 a day. Debt Support Expert took over all bank communications and negotiated a clean OTS that saved my family's peace of mind.",
    },
    commonLendersInCity: ["SBI", "HDFC Bank", "ICICI Bank", "Union Bank", "Axis Bank", "Bajaj Finserv"],
    localFaqs: [
      {
        question: "Do your advocates represent borrowers in Cyberabad police jurisdictions?",
        answer:
          "Yes. If recovery agents attempt unlawful coercion or doorstep intimidation in Cyberabad or Hyderabad, our advocates draft criminal complaints to the Cyber Crime Police and serve legal notices to the bank.",
      },
    ],
  },

  "pune": {
    slug: "pune",
    cityName: "Pune",
    state: "Maharashtra",
    region: "West India",
    metaTitle: "Best Loan Settlement Advocates in Pune & PCMC | Legal OTS & Anti-Harassment",
    metaDescription:
      "Top banking dispute advocates in Pune, PCMC, and Hinjewadi. Settle credit cards, personal loans, and MSME debts legally under RBI guidelines.",
    keywords: [
      "loan settlement advocates pune",
      "debt settlement agency pcmc hinjewadi",
      "stop recovery harassment pune maharashtra",
      "drt pune camp advocate",
      "ots loan settlement pune",
    ],
    heroSubtitle:
      "Stressed by personal loans or credit card dues in Pune, Hinjewadi, or PCMC? Our legal advocates halt recovery harassment within 24 to 48 hours and negotiate direct settlements with bank zonal committees.",
    popularAreas: ["Kothrud", "Hinjewadi IT Park", "Wakad", "Baner", "Viman Nagar", "Hadapsar", "Pimpri-Chinchwad"],
    drtCourts: [
      {
        name: "DRT Pune",
        location: "Camp / General Thimayya Road, Pune",
        jurisdiction: "Covers banking disputes, SARFAESI proceedings, and commercial recovery for Western Maharashtra.",
      },
    ],
    rbiOmbudsmanOffice: {
      officeName: "Office of the RBI Banking Ombudsman (Mumbai & Pune Region)",
      address: "Reserve Bank of India, Regional Office, Pune / Mumbai",
    },
    stats: {
      borrowersProtected: "2,400+",
      debtResolved: "₹8.9+ Cr",
      avgWaiver: "50% - 70%",
    },
    clientStory: {
      clientName: "Amol D.",
      locality: "Wakad, Pune",
      originalDebt: "₹9,50,000 (Personal Loan + Card)",
      settledAmount: "₹3,30,000",
      waiver: "65% Waiver",
      lenders: "Bajaj Finserv & HDFC Bank",
      quote:
        "Bajaj Finserv collection agents were threatening to visit my apartment society gate. Debt Support Expert served a Cease & Desist notice and settled the account with a full No Dues Certificate.",
    },
    commonLendersInCity: ["Bajaj Finserv", "HDFC Bank", "ICICI Bank", "Bank of Maharashtra", "Axis Bank", "Tata Capital"],
    localFaqs: [
      {
        question: "Why are Bajaj Finserv settlements common in Pune?",
        answer:
          "Bajaj Finserv has its national headquarters in Pune. Our legal advocates engage directly with the central collections and grievance cell at Bajaj Auto Finance / Finserv to negotiate swift hardship settlements.",
      },
    ],
  },

  "chennai": {
    slug: "chennai",
    cityName: "Chennai",
    state: "Tamil Nadu",
    region: "South India",
    metaTitle: "Best Loan Settlement Lawyers in Chennai | Legal OTS & Anti-Harassment Shield",
    metaDescription:
      "Empanelled Madras High Court advocates in Chennai for personal loan, credit card, and MSME debt settlements. Stop recovery abuse under RBI circulars.",
    keywords: [
      "loan settlement lawyers chennai",
      "debt settlement agency chennai tamil nadu",
      "stop recovery harassment chennai",
      "drt chennai parrys advocate",
      "credit card settlement chennai",
    ],
    heroSubtitle:
      "Facing debt pressure in Chennai? Our Madras High Court empanelled advocates defend your statutory rights, halt recovery intimidation, and negotiate definitive compromise settlements with leading banks.",
    popularAreas: ["Anna Nagar", "T. Nagar", "OMR IT Corridor", "Velachery", "Adyar", "Guindy", "Tambaram"],
    drtCourts: [
      {
        name: "DRT-I, DRT-II & DRT-III Chennai",
        location: "Spencer Towers / Parrys, Chennai",
        jurisdiction: "Hearing banking appeals, DRT original applications, and SARFAESI challenges for Tamil Nadu and Puducherry.",
      },
    ],
    rbiOmbudsmanOffice: {
      officeName: "Office of the RBI Banking Ombudsman (Chennai)",
      address: "Reserve Bank of India, Fort Glacis, Rajaji Salai, Chennai - 600001",
    },
    stats: {
      borrowersProtected: "2,100+",
      debtResolved: "₹7.6+ Cr",
      avgWaiver: "50% - 70%",
    },
    clientStory: {
      clientName: "Karthik S.",
      locality: "Velachery, Chennai",
      originalDebt: "₹8,40,000 (Personal Loan)",
      settledAmount: "₹2,90,000",
      waiver: "65% Waiver",
      lenders: "Indian Overseas Bank & Axis Bank",
      quote:
        "The advocates guided me through Lok Adalat mediation with complete transparency. We closed the entire loan with an official bank signed letter without a single stressful argument.",
    },
    commonLendersInCity: ["Indian Bank", "Indian Overseas Bank", "HDFC Bank", "ICICI Bank", "SBI", "Kotak"],
    localFaqs: [
      {
        question: "Can your advocates represent me at the Chennai National Lok Adalat?",
        answer:
          "Yes. We regularly represent borrowers at the Chennai High Court Legal Services Committee and District Legal Services Authority (DLSA) Lok Adalat sessions.",
      },
    ],
  },

  "kolkata": {
    slug: "kolkata",
    cityName: "Kolkata",
    state: "West Bengal",
    region: "East India",
    metaTitle: "Best Loan Settlement Advocates in Kolkata | Stop Harassment & Settle Dues",
    metaDescription:
      "Calcutta High Court empanelled advocates in Kolkata, Howrah, and Salt Lake. Settle personal loans and credit cards legally under RBI Fair Practices Code.",
    keywords: [
      "loan settlement advocates kolkata",
      "debt settlement agency west bengal",
      "stop recovery agent harassment kolkata salt lake",
      "drt kolkata esplanade advocate",
      "credit card ots settlement kolkata",
    ],
    heroSubtitle:
      "Stressed with bank debts in Kolkata, Salt Lake, or Howrah? Our Calcutta High Court empanelled advocates provide authoritative legal shields against recovery intimidation and secure deep settlement waivers.",
    popularAreas: ["Salt Lake (Bidhannagar)", "New Town", "Alipore", "Park Street", "Howrah", "Garia", "Ballygunge"],
    drtCourts: [
      {
        name: "DRT-I, DRT-II & DRT-III Kolkata",
        location: "K.S. Roy Road / Esplanade, Kolkata",
        jurisdiction: "Adjudicating stressed banking assets, corporate loan defaults, and SARFAESI actions across West Bengal and Eastern India.",
      },
    ],
    rbiOmbudsmanOffice: {
      officeName: "Office of the RBI Banking Ombudsman (Kolkata)",
      address: "Reserve Bank of India, 15, Netaji Subhas Road, Kolkata - 700001",
    },
    stats: {
      borrowersProtected: "1,950+",
      debtResolved: "₹6.8+ Cr",
      avgWaiver: "50% - 70%",
    },
    clientStory: {
      clientName: "Debashis B.",
      locality: "Salt Lake Sector V, Kolkata",
      originalDebt: "₹7,20,000 (2 Credit Cards)",
      settledAmount: "₹2,30,000",
      waiver: "68% Waiver",
      lenders: "SBI Card & RBL Bank",
      quote:
        "The collection agency kept threatening police visits. Debt Support Expert clarified that loan default is purely civil, served legal notices to the bank, and finalized the settlement smoothly.",
    },
    commonLendersInCity: ["UCO Bank", "Punjab National Bank", "SBI", "HDFC Bank", "ICICI Bank", "Bandhan Bank"],
    localFaqs: [
      {
        question: "Do you defend borrowers against arbitration notices in Kolkata?",
        answer:
          "Yes. Many lenders conduct unilateral arbitration in Kolkata. Our advocates draft preliminary jurisdictional objections and represent you before sole arbitrators to ensure fair settlement terms.",
      },
    ],
  },

  "ahmedabad": {
    slug: "ahmedabad",
    cityName: "Ahmedabad",
    state: "Gujarat",
    region: "West India",
    metaTitle: "Best Loan Settlement & MSME Debt Advocates in Ahmedabad | Legal OTS Relief",
    metaDescription:
      "Expert loan settlement and commercial debt lawyers in Ahmedabad and Gandhinagar. Settle unsecured business loans, CC/OD limits, and personal debts under RBI guidelines.",
    keywords: [
      "loan settlement lawyers ahmedabad",
      "msme debt settlement agency gujarat",
      "stop recovery harassment ahmedabad gandhinagar",
      "drt ahmedabad ashram road advocate",
      "cash credit ots settlement ahmedabad",
    ],
    heroSubtitle:
      "Stressed with working capital, Cash Credit (CC) limits, or personal debt in Ahmedabad or Gandhinagar? Our Gujarat High Court empanelled advocates defend commercial assets and negotiate legal One-Time Settlements.",
    popularAreas: ["Ashram Road", "SG Highway", "Bodakdev", "Maninagar", "Prahlad Nagar", "Gandhinagar", "Vastrapur"],
    drtCourts: [
      {
        name: "DRT-I & DRT-II Ahmedabad",
        location: "Ellisbridge / Ashram Road, Ahmedabad",
        jurisdiction: "Hearing MSME debt defaults, SARFAESI Section 13(2) objections, and bank recovery actions for Gujarat.",
      },
    ],
    rbiOmbudsmanOffice: {
      officeName: "Office of the RBI Banking Ombudsman (Ahmedabad)",
      address: "Reserve Bank of India, Near Income Tax Circle, Ashram Road, Ahmedabad - 380014",
    },
    stats: {
      borrowersProtected: "2,200+",
      debtResolved: "₹9.8+ Cr",
      avgWaiver: "45% - 65%",
    },
    clientStory: {
      clientName: "Bhavik P.",
      locality: "SG Highway, Ahmedabad",
      originalDebt: "₹24,00,000 (MSME Loan + CC Limit)",
      settledAmount: "₹9,60,000",
      waiver: "60% Waiver",
      lenders: "Bank of Baroda & Kotak Mahindra",
      quote:
        "The bank issued a SARFAESI notice threatening to auction our packaging machinery. Debt Support Expert advocates filed Section 13(3A) objections, stayed the action, and negotiated a structured OTS.",
    },
    commonLendersInCity: ["Bank of Baroda", "State Bank of India", "HDFC Bank", "ICICI Bank", "Kotak Mahindra", "AU Small Finance"],
    localFaqs: [
      {
        question: "Can your advocates represent MSME business owners in Ahmedabad?",
        answer:
          "Yes. We specialize in resolving stressed Cash Credit (CC), Overdraft (OD), and machinery loan defaults for manufacturing and trading enterprises across Gujarat.",
      },
    ],
  },

  "jaipur": {
    slug: "jaipur",
    cityName: "Jaipur",
    state: "Rajasthan",
    region: "North-West India",
    metaTitle: "Best Loan Settlement Lawyers in Jaipur | Legal Debt Waiver & Harassment Protection",
    metaDescription:
      "High Court empanelled advocates in Jaipur for personal loan, credit card, and business debt settlement. Settle loans legally under RBI Fair Practices Code.",
    keywords: [
      "loan settlement lawyers jaipur",
      "debt settlement agency jaipur rajasthan",
      "stop recovery harassment jaipur",
      "drt jaipur vidhyadhar nagar advocate",
      "personal loan ots jaipur",
    ],
    heroSubtitle:
      "Facing continuous recovery agent pressure in Jaipur? Our Rajasthan High Court empanelled advocates enforce the RBI August 2022 Circular, protect your family dignity, and negotiate legal One-Time Settlements.",
    popularAreas: ["Mansarovar", "Vaishali Nagar", "Malviya Nagar", "C-Scheme", "Raja Park", "Tonk Road", "Jhotwara"],
    drtCourts: [
      {
        name: "DRT Jaipur",
        location: "Kalyan Tower, Vidhyadhar Nagar, Jaipur",
        jurisdiction: "Hearing recovery matters, DRT applications, and SARFAESI appeals for the entire state of Rajasthan.",
      },
    ],
    rbiOmbudsmanOffice: {
      officeName: "Office of the RBI Banking Ombudsman (Jaipur)",
      address: "Reserve Bank of India, Ram Bagh Circle, Tonk Road, Jaipur - 302004",
    },
    stats: {
      borrowersProtected: "1,600+",
      debtResolved: "₹5.4+ Cr",
      avgWaiver: "50% - 70%",
    },
    clientStory: {
      clientName: "Gaurav S.",
      locality: "Mansarovar, Jaipur",
      originalDebt: "₹6,80,000 (Personal Loan + Card)",
      settledAmount: "₹2,40,000",
      waiver: "64% Waiver",
      lenders: "SBI & Axis Bank",
      quote:
        "The collection agents were calling my distant relatives. Within 24 hours of Debt Support Expert serving an advocate notice, all rogue calls stopped, and we settled the debt affordably.",
    },
    commonLendersInCity: ["SBI", "Bank of Baroda", "AU Small Finance Bank", "HDFC Bank", "ICICI Bank", "Bajaj Finserv"],
    localFaqs: [
      {
        question: "How do your advocates handle AU Small Finance Bank accounts in Jaipur?",
        answer:
          "AU Small Finance Bank is headquartered in Jaipur. Our legal office maintains direct grievance channels with senior management in Jaipur to negotiate transparent hardship settlements.",
      },
    ],
  },

  "patna": {
    slug: "patna",
    cityName: "Patna",
    state: "Bihar",
    region: "East India",
    metaTitle: "Best Loan Settlement Advocates in Patna | Stop Recovery Agent Harassment",
    metaDescription:
      "Patna High Court empanelled advocates for personal loan, credit card, and commercial debt settlements. Protect borrower legal rights under RBI regulations.",
    keywords: [
      "loan settlement advocates patna",
      "debt settlement agency bihar",
      "stop recovery harassment patna",
      "drt patna kankarbagh advocate",
      "personal loan ots patna bihar",
    ],
    heroSubtitle:
      "Stressed with loan repayments in Patna or across Bihar? Our Patna High Court empanelled advocates serve statutory notices to bank nodal officers, halt unlawful recovery practices, and negotiate definitive compromise settlements.",
    popularAreas: ["Kankarbagh", "Bailey Road", "Boring Road", "Patliputra Colony", "Rajendra Nagar", "Danapur", "Anisabad"],
    drtCourts: [
      {
        name: "DRT Patna",
        location: "Karpuri Thakur Sadan, Ashiana-Digha Road, Patna",
        jurisdiction: "Jurisdiction over stressed banking claims, DRT original applications, and SARFAESI matters for Bihar.",
      },
    ],
    rbiOmbudsmanOffice: {
      officeName: "Office of the RBI Banking Ombudsman (Patna)",
      address: "Reserve Bank of India, South Gandhi Maidan, Patna - 800001",
    },
    stats: {
      borrowersProtected: "1,450+",
      debtResolved: "₹4.8+ Cr",
      avgWaiver: "50% - 70%",
    },
    clientStory: {
      clientName: "Rakesh K.",
      locality: "Bailey Road, Patna",
      originalDebt: "₹5,50,000 (Personal Loan)",
      settledAmount: "₹1,90,000",
      waiver: "65% Waiver",
      lenders: "Punjab National Bank & Bajaj Finserv",
      quote:
        "Agents were shouting at my doorstep. Debt Support Expert issued an immediate legal representation notice. The agents vanished, and we settled the loan directly with the bank's zonal office.",
    },
    commonLendersInCity: ["Punjab National Bank", "State Bank of India", "Canara Bank", "HDFC Bank", "Bajaj Finserv", "Bandhan Bank"],
    localFaqs: [
      {
        question: "Can recovery agents threaten me with police arrest in Patna?",
        answer:
          "No. Unsecured loan default is purely a civil matter. The Supreme Court has ruled that police cannot be used as collection agents. Our advocates take strict action against any agent making criminal threats.",
      },
    ],
  },
};

export const cities = Object.values(citiesData).map((c) => ({
  slug: c.slug,
  name: c.cityName,
  state: c.state,
}));
