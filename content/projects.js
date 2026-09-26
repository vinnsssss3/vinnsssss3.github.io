/*
  PROJECTS
  One object per project. To add a project, copy an existing one, paste it
  at the top of the list, and change the values.

  Required fields:
    id        unique, lowercase-with-dashes (used in links)
    title     project name
    summary   one sentence: what it is
    year      number, e.g. 2026
    tags      tech used, e.g. ["Python", "Docker"]

  Optional fields:
    draft       true  = hidden from the live site (use for unfinished work)
    featured    true  = shown in "Featured Work" with a full case study
    university  { semester: 4, course: "Course name" }
                = shown in "Built at University"
    role        your role, e.g. "Backend developer · team of 5"
    highlights  short numbers/facts shown as chips on the card
    learned     one sentence: what this project taught you
    links       [{ label: "Code", url: "https://..." }]
    caseStudy   { what, hard: [{ title, body }], result, reflection, chart }
                (only used when featured is true; body text may contain
                 simple HTML such as <strong> and <code>)

  A project can be BOTH featured and university (e.g. Harmoney).
  A project with neither goes into "Other Projects".
*/
window.CONTENT = window.CONTENT || {};

CONTENT.projects = [
  {
    id: "dompet-ledger",
    title: "dompet-ledger",
    summary: "Double-entry wallet API with idempotent transfers and deadlock-safe locking.",
    year: 2026,
    tags: ["NestJS", "TypeORM", "PostgreSQL"],
    draft: true, // unfinished → hidden. Set to false once it runs, is tested and is on GitHub.
  },

  {
    id: "docker-vs-serverless",
    title: "Docker vs Serverless FaaS Benchmark",
    summary:
      "A reproducible benchmark that isolates one variable, process lifecycle, to measure what a cold start actually costs.",
    year: 2026,
    featured: true,
    university: { semester: 4, course: "Research Methodology" },
    role: "First author · team of 4",
    tags: ["Python", "Docker", "Serverless Framework", "psutil", "pandas"],
    highlights: ["64–82 ms cold-start cost", "~57% less memory-time", "Presented at EECSI 2026"],
    learned: "How to design a fair experiment and report its limits honestly.",
    links: [
      { label: "Code, data & paper summary", url: "https://github.com/vinnsssss3/Docker-vs-Serverless" },
    ],
    caseStudy: {
      what:
        "Runs byte-identical Python code under an always-on (Docker-style) lifecycle and a cold/warm-start (FaaS) lifecycle, then measures latency and CPU/memory across four load scenarios.",
      hard: [
        {
          title: "Making the comparison fair",
          body:
            "Deploying to a cloud VM and to Lambda mixes in network hops, API Gateway and noisy neighbours. I isolated the one variable the paper asks about, <strong>process lifecycle</strong>: the same workload module on both paths, pinned runtime and memory, and a probe scenario that forces cold starts at a known cadence so cold and warm requests can be separated.",
        },
      ],
      result:
        "Warm latency is equivalent (<strong>0.01–1.30 ms</strong> median gap). A cold start adds a roughly constant <strong>64–82 ms</strong>: +2,328% on a 3 ms request but only +74% on an 86 ms one. Under sparse traffic FaaS uses <strong>~57% less</strong> cumulative memory-time. 430 latency observations.",
      reflection:
        "Measured on a local, controlled process-lifecycle model, not on AWS. Real Lambda cold starts are typically 200–500 ms, so these are lower bounds. Next step: rerun on real Lambda vs ECS/Fargate with cost per million requests.",
      chart: {
        caption: "Median latency, light workload (probe scenario)",
        unit: "ms",
        bars: [
          { label: "Docker (always-on)", value: 2.8 },
          { label: "FaaS, warm", value: 2.9 },
          { label: "FaaS, cold", value: 71.4, emphasis: true },
        ],
      },
    },
  },

  {
    id: "harmoney",
    title: "Harmoney: Personal Finance App",
    summary:
      "Wallets, savings goals, analytics and receipt-scanning split bills. I built the backend money-movement logic.",
    year: 2026,
    featured: true,
    university: { semester: 4, course: "Software Architecture & Software Engineering" },
    role: "Backend developer · team of 5",
    tags: ["NestJS", "TypeScript", "PostgreSQL", "Prisma", "TypeORM", "Python", "Flask"],
    highlights: ["151 unit specs", "Shipped in one semester", "51 survey respondents"],
    learned: "Why a balance check has to happen inside the lock, not before it.",
    links: [
      { label: "My savings module", url: "https://github.com/AlvinPanjaitan/BE_Harmoney/tree/development-savings/savings-backend-all" },
      { label: "Team backend repo", url: "https://github.com/AlvinPanjaitan/BE_Harmoney" },
      { label: "Demo video", url: "https://youtu.be/ur9Zj1vRRFA" },
    ],
    caseStudy: {
      what:
        "A NestJS REST API on Vercel, plus two Python services (receipt OCR, spending-runway prediction) on Hugging Face Spaces, consumed by a Flutter app.",
      hard: [
        {
          title: "Money movement under concurrency",
          body:
            "I designed the savings module (deposit, withdraw, wallet → goal transfer) so a double-tapped withdrawal can't overdraw. The balance check happens <em>inside</em> a row lock (<code>SELECT … FOR UPDATE</code>), debit + credit + ledger entry commit in one transaction, and every movement is written to an append-only log with a balance snapshot.",
        },
        {
          title: "Receipt parsing that got quantities wrong",
          body:
            "Lines like <code>1 500 ml x 7,000</code> were read as qty 500 at Rp 7. I reworked the OCR → LLM parsing rules to separate packaging units from quantity and enforce <code>qty × price = line total</code>, reshaped the API contract to match the app, and containerised the service for Hugging Face Spaces.",
        },
      ],
      result:
        "The team shipped end-to-end in one semester. 151 unit specs on the savings module (DB mocked). Requirements came from a survey of 51 respondents.",
      reflection:
        "The team's final Prisma port checks the balance <em>before</em> opening the transaction, so I'd carry the in-lock check over to it, prove it with a real-Postgres test that fires 50 parallel withdrawals, and add retry on serialization failures (<code>40001</code>).",
    },
  },

  {
    id: "fashion-trend-dashboard",
    title: "Fashion Trend & Review Sentiment Dashboard",
    summary:
      "A Streamlit dashboard that analyses a fashion survey and customer reviews to suggest what to produce next.",
    year: 2025,
    university: { semester: 3, course: "Artificial Intelligence" },
    role: "Team of 3 · project idea, app, literature review, results",
    tags: ["Python", "Streamlit", "pandas", "scikit-learn", "Matplotlib"],
    learned: "Most of the work in a data project is cleaning and shaping the data, not the model.",
    links: [],
  },

  {
    id: "network-design",
    title: "Network Design & Simulation",
    summary:
      "Designed and simulated a multi-segment network in Cisco Packet Tracer, with a written report and presentation.",
    year: 2025,
    university: { semester: 3, course: "Computer Networks" },
    role: "Team project",
    tags: ["Cisco Packet Tracer", "Networking"],
    learned: "How traffic actually finds its way between devices, and how to document an infrastructure design.",
    links: [],
  },

  {
    id: "crypto-learn-site",
    title: "Crypto Education Website",
    summary:
      "A five-page website introducing cryptocurrency to beginners: coin overviews, a learning guide, benefits and a sign-up form.",
    year: 2025,
    university: { semester: 2, course: "Human-Computer Interaction (Lab)" },
    role: "Solo",
    tags: ["HTML", "CSS", "JavaScript", "Figma"],
    learned: "Designing in Figma first and then building it by hand: layout, hierarchy and form usability.",
    links: [],
  },
];
