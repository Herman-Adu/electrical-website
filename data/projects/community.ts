import type { Project } from "@/types/projects";

export const communityProjects: Project[] = [
  // ─── Thames Valley Adventure Playground ─────────────────────────────────────
  {
    id: "proj-tvap-pat-2026-001",
    slug: "thames-valley-adventure-playground-pat-testing",
    category: "community",
    categoryLabel: "Community",
    title: "Thames Valley Adventure Playground — Free PAT Testing",
    clientSector: "Charity & Disability Services",
    status: "planned",
    description:
      "Free PAT testing programme donated to Thames Valley Adventure Playground — a charity serving children and adults with disabilities since 1979 across a 2.5-acre site in Taplow, Berkshire.",
    coverImage: {
      src: "/images/projects/community/thames-valley-adventure-playground/nexgen-tvap-inclusive-adventure-playground-castle-taplow.jpg",
      alt: "Thames Valley Adventure Playground — wooden castle fortress with red slide and accessible ramp, Taplow, Berkshire",
    },
    kpis: {
      budget: "Pro Bono",
      timeline: "2026 — Planned",
      capacity: "Full Site PAT",
      location: "Taplow, Berkshire",
    },
    tags: [
      "PAT Testing",
      "Pro Bono",
      "Community Charity",
      "Disability Services",
      "Electrical Safety",
    ],
    progress: 0,
    isFeatured: false,
    heroHeadline: ["Thames Valley", "Adventure Playground"],
    heroIndicators: [
      {
        icon: "ClipboardCheck",
        title: "PAT Testing",
        description:
          "Full portable appliance inspection and testing across all charity facilities, carried out to NICEIC standards.",
      },
      {
        icon: "Heart",
        title: "Pro Bono",
        description:
          "100% donated — our time, expertise, and certification, at zero cost to the charity.",
      },
      {
        icon: "Users",
        title: "Inclusive Play",
        description:
          "Supporting a charity serving children and adults with every type of disability since 1979 across the Thames Valley.",
      },
      {
        icon: "MapPin",
        title: "Taplow, Berkshire",
        description:
          "TVAP's 2.5-acre inclusive play facility adjacent to the A4, near Maidenhead.",
      },
    ] as const,
    publishedAt: "2026-05-17T09:00:00.000Z",
    updatedAt: "2026-05-17T09:00:00.000Z",
    detail: {
      intro: {
        label: "Community Initiative",
        headlineWords: ["Every", "socket.", "Every", "appliance.", "Donated."],
        leadParagraph:
          "Thames Valley Adventure Playground is one of those organisations that reminds you why community matters. A charity that has given children and adults with disabilities a safe, stimulating place to play since 1979 — on a 2.5-acre site in Taplow that families across Berkshire, Buckinghamshire, and Oxfordshire travel to reach. When the opportunity came to support TVAP through a fully free PAT testing programme, Nexgen didn't hesitate.",
        bodyParagraphs: [
          "Portable appliance testing might sound straightforward, but for a charity operating a facility of this scale — sensory rooms, splash pads, outdoor play equipment, indoor spaces, and staff welfare areas — the number of appliances to inspect, test, and certify is significant. For TVAP, this is not a budget line. It's a compliance obligation that competes for funds the charity would far rather spend on the children they serve.",
          "Nexgen are donating the entire programme: every visual inspection, every electrical test, every label applied, and every certificate produced. Full NICEIC-compliant documentation and reporting will be provided on completion. No invoice. No charge. Just neighbours looking after neighbours.",
        ],
        pillars: [
          {
            num: "01",
            title: "Every Appliance Covered",
            description:
              "Full site inspection across all portable electrical appliances — no exclusions, no shortcuts. Every item is visually inspected, electrically tested where required, and clearly labelled on completion.",
          },
          {
            num: "02",
            title: "Zero Cost to the Charity",
            description:
              "Nexgen are donating time, expertise, and materials in full. TVAP carries no cost whatsoever — every pound they would have spent on compliance stays with the children they serve.",
          },
          {
            num: "03",
            title: "Full Certification and Reporting",
            description:
              "NICEIC-compliant test records, pass/fail register, and all required certification provided at handover. TVAP leaves with everything they need to demonstrate electrical compliance to their insurers, funders, and OFSTED.",
          },
          {
            num: "04",
            title: "OFSTED-Registered Facility",
            description:
              "TVAP is an OFSTED-registered day-care facility. Electrical compliance is not optional — it's a condition of their registration. Our work directly protects their ability to operate and serve their community.",
          },
        ],
      },
      narrativeBlocks: [
        {
          position: "after-intro",
          anchorId: "our-values",
          heading: "What Community Means to Nexgen",
          paragraphs: [
            "Nexgen Electrical Innovations is a local business. Our team lives in this area, sends children to schools near here, drives past the same roundabouts and shops as the families TVAP serves. When a charity like Thames Valley Adventure Playground is operating nearby, giving back isn't a marketing exercise — it's the obvious thing to do.",
            "We believe trade businesses have a responsibility to their communities that goes beyond delivering work on time and on spec. Charities and community organisations often operate without the budgets to maintain full compliance on every front. Where Nexgen can close that gap, we will — and the TVAP PAT testing programme is exactly that kind of initiative.",
          ],
          background: "muted",
        },
      ],
      scope: [
        {
          icon: "Wrench",
          title: "Visual Inspection",
          description:
            "Every portable appliance inspected for visible damage, cable condition, plug integrity, and marking compliance before electrical testing begins.",
        },
        {
          icon: "Zap",
          title: "Electrical Testing",
          description:
            "In-service testing carried out using calibrated PAT equipment to IET Code of Practice standards, with pass/fail recorded for each appliance.",
        },
        {
          icon: "Shield",
          title: "Labelling",
          description:
            "All tested appliances clearly labelled with test result, date, and next test due — giving staff instant visibility of compliance status.",
        },
        {
          icon: "Award",
          title: "Documentation & Certification",
          description:
            "Full test register produced for every appliance on site. NICEIC-compliant certification and reporting provided at handover.",
        },
        {
          icon: "Settings",
          title: "Remedial Identification",
          description:
            "Any appliance that fails testing is flagged, removed from service, and reported. Nexgen will advise on remedial options at no additional charge.",
        },
        {
          icon: "Activity",
          title: "Compliance Confidence",
          description:
            "TVAP leaves the programme with a complete, dated, certified electrical appliance record — ready for OFSTED inspection, insurer requests, or funder reporting.",
        },
      ],
      timeline: [
        {
          phase: "Phase 1",
          title: "Site Survey & Appliance Register",
          description:
            "Pre-visit survey to establish appliance count, site layout, and access requirements. Full appliance register produced prior to testing day.",
          duration: "TBC",
          status: "upcoming",
        },
        {
          phase: "Phase 2",
          title: "Testing & Inspection Programme",
          description:
            "Full site PAT testing day(s) — visual inspection, electrical testing, labelling, and real-time recording for all portable appliances across the facility.",
          duration: "TBC",
          status: "upcoming",
        },
        {
          phase: "Phase 3",
          title: "Certification & Handover",
          description:
            "Test register finalised, NICEIC certificates produced, and full documentation package handed to TVAP management. Remedial items reported separately.",
          duration: "TBC",
          status: "upcoming",
        },
      ],
      gallery: [
        {
          src: "/images/projects/community/thames-valley-adventure-playground/nexgen-tvap-inclusive-adventure-playground-castle-taplow.jpg",
          alt: "Thames Valley Adventure Playground — wooden castle fortress with red slide and accessible ramp, Taplow",
          caption: "TVAP Play Castle — Accessible Design",
        },
        {
          src: "/images/projects/community/thames-valley-adventure-playground/nexgen-tvap-outdoor-play-area-panoramic-taplow.jpg",
          alt: "Thames Valley Adventure Playground — panoramic view of outdoor play area with multiple structures and sandpit",
          caption: "TVAP Outdoor Play Area",
        },
        {
          src: "/images/projects/community/thames-valley-adventure-playground/nexgen-tvap-adventure-playground-facility-building.jpg",
          alt: "Thames Valley Adventure Playground — log cabin facility building exterior, Taplow",
          caption: "TVAP Facility Building",
        },
        {
          src: "/images/projects/community/thames-valley-adventure-playground/nexgen-tvap-site-plan-taplow-berkshire.jpg",
          alt: "Thames Valley Adventure Playground — site plan display board, 2.5-acre facility at Taplow, Berkshire",
          caption: "TVAP Site Plan",
        },
      ],
    },
  },

  // ─── Slough in Bloom ────────────────────────────────────────────────────────
  {
    id: "proj-slough-in-bloom-sponsor-001",
    slug: "slough-in-bloom-community-sponsorship",
    category: "community",
    categoryLabel: "Community",
    title: "Slough in Bloom — Community Sponsorship",
    clientSector: "Community Horticulture & Civic Pride",
    status: "in-progress",
    description:
      "Community sponsorship of Slough in Bloom for its 29th (2023) and 32nd (2026) year — backing the annual competition that has brightened Slough's streets, allotments, and roundabouts for over three decades.",
    coverImage: {
      src: "/images/projects/community/slough-in-bloom/nexgen-slough-in-bloom-2023-overall-winner-award.jpg",
      alt: "Slough in Bloom 2023 — overall winner award presentation, sponsored by Nexgen Electrical Innovations",
    },
    kpis: {
      budget: "Community Sponsor",
      timeline: "2023 → 2026",
      capacity: "32nd Year Sponsor",
      location: "Slough, Berkshire",
    },
    tags: [
      "Community Sponsorship",
      "Slough in Bloom",
      "Civic Pride",
      "Horticulture",
      "Local Giving",
    ],
    progress: 50,
    isFeatured: false,
    heroHeadline: ["Slough in Bloom.", "Community First."],
    heroIndicators: [
      {
        icon: "Heart",
        title: "2023 + 2026",
        description:
          "Proud sponsors of Slough in Bloom for both its 29th (2023) and 32nd (2026) year — our roots run deep.",
      },
      {
        icon: "Star",
        title: "Community Sponsor",
        description:
          "Backing the competition that has brightened Slough's streets, allotments, and roundabouts for over three decades.",
      },
      {
        icon: "Lightbulb",
        title: "10 Categories",
        description:
          "Supporting all 10 judging categories — from residential front gardens to environmental projects across the borough.",
      },
      {
        icon: "MapPin",
        title: "Slough, Berkshire",
        description:
          "Investing in the community where our team lives and works, alongside the people who make Slough worth living in.",
      },
    ] as const,
    publishedAt: "2023-09-16T09:00:00.000Z",
    updatedAt: "2026-05-17T09:00:00.000Z",
    detail: {
      intro: {
        label: "Community Initiative",
        headlineWords: ["We", "came", "back.", "Because", "Slough", "is", "home."],
        leadParagraph:
          "Slough in Bloom has been brightening this town for over three decades. Every summer, residents, schools, allotment holders, and businesses spend months cultivating something beautiful — not for profit, not for recognition, but because a colourful street is a better street for everyone who walks it. Our team has been part of this competition's story since 2023. In 2026, under our own name, we came back — and we intend to keep coming back.",
        bodyParagraphs: [
          "The competition runs across 10 categories and is entirely free to enter. It relies on sponsors to exist. Without business support, the judging, the awards, the publicity, and the infrastructure that makes the competition real simply wouldn't happen. That's where Nexgen comes in — not as a passive logo on a banner, but as a business that genuinely believes the town it operates in is worth investing in.",
          "In 2023, we backed this competition as it entered its 29th year. In 2026, as Nexgen Electrical Innovations, we returned for its 32nd — under new chairman Phil Vance and with Mayor Siobhan Dauti at the launch. The competition keeps growing. So does our commitment to it.",
        ],
        pillars: [
          {
            num: "01",
            title: "Community Before Commerce",
            description:
              "We don't sponsor Slough in Bloom to generate leads. We do it because our engineers live here, our families shop here, and a town people are proud of is a better place for everyone — including us.",
          },
          {
            num: "02",
            title: "Keeping the Competition Alive",
            description:
              "Slough in Bloom is free to enter because sponsors make it viable. Without business backing, the judging programme, the awards ceremony, and the momentum built over 32 years would simply stop. Nexgen helps make sure it doesn't.",
          },
          {
            num: "03",
            title: "A Relationship, Not a Transaction",
            description:
              "Our involvement began in 2023 and returned in 2026. This is not a one-off PR exercise — it's an ongoing relationship with a competition and a community that has meant something to us from the start.",
          },
        ],
      },
      narrativeBlocks: [
        {
          position: "after-intro",
          anchorId: "the-competition",
          heading: "Year 32. New Leadership. Same Mission.",
          paragraphs: [
            "Slough in Bloom's 32nd year launched on 5 May 2026 under new chairman Phil Vance, with Mayor Siobhan Dauti at the opening event. The competition spans 10 judging categories — from residential front gardens to community roundabouts, school grounds, allotments, and environmental projects — and is free to enter for anyone in the borough. That open-entry model is the foundation of what makes it meaningful: the entries come from residents who have tended a front garden for years without recognition, from school gardening clubs, from allotment holders who have worked the same plot across three decades.",
            "The judging process visits hundreds of locations across Slough each summer. Trained judges score every entry against consistent criteria, ensuring each entrant's effort is counted rather than overlooked. An awards ceremony in autumn closes the loop — giving Slough a structured, annual reason to notice what is growing in its streets, recognise the people who planted it, and celebrate them publicly. It is a small, unglamorous machine. It has been running without interruption for 32 years. Nexgen is proud to help keep it running.",
          ],
          background: "muted",
        },
        {
          position: "after-challenge",
          anchorId: "why-we-show-up",
          heading: "Why Local Business Shows Up",
          paragraphs: [
            "There is a version of community involvement that is pure marketing — a logo, a press release, and a line on a website. That's not what this is. The electrical industry is built on reputation and relationships. The people of Slough are the same people who recommend contractors to their neighbours, who remember which businesses gave something back when they didn't have to, and who notice when a name shows up consistently rather than once.",
            "Slough in Bloom has been running for 32 years because of people like Margaret Inniss, who gave over three decades to building it into what it is today. The 2025 ceremony created the Margaret Inniss Award for Blooming Excellence in her honour — a recognition of what sustained, unglamorous commitment to a community can achieve. That's the kind of legacy we want to be part of.",
          ],
          background: "default",
        },
      ],
      scope: [
        {
          icon: "Award",
          title: "Competition Funding",
          description:
            "Our sponsorship contributes directly to the costs of running the annual competition — judging, publicity, materials, and the awards ceremony that recognises entrants' work.",
        },
        {
          icon: "Network",
          title: "Community Platform",
          description:
            "Slough in Bloom is a platform for residents, schools, and businesses to engage with each other around something positive. Our backing helps keep that platform open and free to all.",
        },
        {
          icon: "Lightbulb",
          title: "Supporting 10 Categories",
          description:
            "From residential front gardens to environmental projects and sponsored roundabouts — the competition's breadth is part of its appeal. Our sponsorship supports every category.",
        },
        {
          icon: "CheckCircle",
          title: "Recognising Residents",
          description:
            "The competition acknowledges people who give their time and money to make Slough look its best. Our involvement is a way of saying that effort is noticed and valued.",
        },
        {
          icon: "Building",
          title: "Local Investment",
          description:
            "This is money that stays in the community. The entrants are local, the judges are local, the awards go to local people — and so does every pound of our sponsorship.",
        },
        {
          icon: "Activity",
          title: "Year-on-Year Continuity",
          description:
            "Returning in 2026 after 2023 means something. It tells the committee, the entrants, and the borough that Nexgen's commitment isn't contingent on a good PR quarter.",
        },
      ],
      challenge:
        "Community sponsorship is an easy thing to talk about and a harder thing to sustain. A business can put its logo on a banner once and move on. The challenge — and the test of whether a commitment is genuine — is whether you come back. Whether you show up the following year, and the year after that, not because it generates work, but because you decided it was the right thing to do and you haven't changed your mind.",
      solution:
        "Nexgen showed up in 2023. We came back in 2026. The gap between those two years was a period of significant change for the business — but not a change in values. We returned to Slough in Bloom because the competition is worth supporting, because the people who run it give their time generously and deserve businesses that reciprocate, and because the team at Nexgen is made up of people from this area who want to see it flourish. That's the only calculation we needed.",
      timeline: [
        {
          phase: "Phase 1",
          title: "2023 — Community Roots",
          description:
            "Our team backed Slough in Bloom as it entered its 29th year. Bruce Hicks, Senior Parks Improvement Officer, confirmed the competition's continuation was made possible by new sponsors stepping forward. We were proud to be one of them.",
          duration: "2023",
          status: "completed",
        },
        {
          phase: "Phase 2",
          title: "Nexgen Electrical Innovations Founded",
          description:
            "A new chapter — same team, same values, new name. When Nexgen was established, returning to support Slough in Bloom was never in question.",
          duration: "2023–2025",
          status: "completed",
        },
        {
          phase: "Phase 3",
          title: "2026 — We Came Back",
          description:
            "As Nexgen Electrical Innovations, we returned as sponsors for the competition's 32nd year. Under new chairman Phil Vance, with Mayor Siobhan Dauti at the launch on 5 May 2026, Nexgen is listed as an active sponsor on sloughinbloom.com.",
          duration: "2026 (active)",
          status: "in-progress",
        },
      ],
      gallery: [
        {
          src: "/images/projects/community/slough-in-bloom/nexgen-slough-in-bloom-2023-overall-winner-award.jpg",
          alt: "Slough in Bloom 2023 — overall winner award presentation",
          caption: "2023 Overall Winner Award",
        },
        {
          src: "/images/projects/community/slough-in-bloom/nexgen-slough-in-bloom-2023-overall-winner-display.jpg",
          alt: "Slough in Bloom 2023 — overall winner display board at ceremony",
          caption: "2023 Overall Winner Display",
        },
        {
          src: "/images/projects/community/slough-in-bloom/nexgen-slough-in-bloom-2023-gold-award-winner-01.jpg",
          alt: "Slough in Bloom 2023 — gold award winner category 1",
          caption: "2023 Gold Award Winner",
        },
        {
          src: "/images/projects/community/slough-in-bloom/nexgen-slough-in-bloom-2023-gold-award-winner-02.jpg",
          alt: "Slough in Bloom 2023 — gold award winner category 2",
          caption: "2023 Gold Award Winner",
        },
        {
          src: "/images/projects/community/slough-in-bloom/nexgen-slough-in-bloom-2023-gold-award-winner-03.jpg",
          alt: "Slough in Bloom 2023 — gold award winner category 3",
          caption: "2023 Gold Award Winner",
        },
        {
          src: "/images/projects/community/slough-in-bloom/nexgen-slough-in-bloom-2023-gold-award-winner-04.jpg",
          alt: "Slough in Bloom 2023 — gold award winner category 4",
          caption: "2023 Gold Award Winner",
        },
        {
          src: "/images/projects/community/slough-in-bloom/nexgen-slough-in-bloom-2023-gold-award-winner-05.jpg",
          alt: "Slough in Bloom 2023 — gold award winner category 5",
          caption: "2023 Gold Award Winner",
        },
        {
          src: "/images/projects/community/slough-in-bloom/nexgen-slough-in-bloom-2023-community-garden-entry-01.jpg",
          alt: "Slough in Bloom 2023 — community garden competition entry, Slough",
          caption: "Community Garden Entry",
        },
        {
          src: "/images/projects/community/slough-in-bloom/nexgen-slough-in-bloom-2023-community-garden-entry-02.jpg",
          alt: "Slough in Bloom 2023 — community garden competition entry, Slough",
          caption: "Community Garden Entry",
        },
        {
          src: "/images/projects/community/slough-in-bloom/nexgen-slough-in-bloom-2023-community-garden-entry-03.jpg",
          alt: "Slough in Bloom 2023 — community garden competition entry, Slough",
          caption: "Community Garden Entry",
        },
        {
          src: "/images/projects/community/slough-in-bloom/nexgen-slough-in-bloom-2023-community-garden-entry-04.jpg",
          alt: "Slough in Bloom 2023 — community garden competition entry, Slough",
          caption: "Community Garden Entry",
        },
        {
          src: "/images/projects/community/slough-in-bloom/nexgen-slough-in-bloom-2023-prize-winning-garden-display.jpg",
          alt: "Slough in Bloom 2023 — prize-winning garden competition display, Berkshire",
          caption: "Prize-Winning Garden Display",
        },
        {
          src: "/images/projects/community/slough-in-bloom/nexgen-slough-in-bloom-2023-competition-floral-display.jpg",
          alt: "Slough in Bloom 2023 — competition floral display entry, Slough Berkshire",
          caption: "Competition Floral Display",
        },
      ],
      testimonial: {
        quote:
          "Slough in Bloom have been working with new sponsors who have enabled this lovely competition to continue for its 29th year.",
        author: "Bruce Hicks",
        role: "Senior Parks Improvement Officer",
        company: "Slough Borough Council",
      },
    },
  },
];
