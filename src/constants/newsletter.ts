// constants/newsletter.ts
export const NEWSLETTER_CONSTANTS = {
  MAX_SUBJECT_LENGTH: 78,
  MAX_PREVIEW_TEXT_LENGTH: 140,
  RECOMMENDED_CONTENT_LENGTH: 500,
  MAX_CONTENT_LENGTH: 10000,

  DEFAULT_SEND_TIME: {
    hour: 10,
    minute: 0,
  },

  INDUSTRY_BENCHMARKS: {
    OPEN_RATE: 21.3,
    CLICK_RATE: 2.6,
    UNSUBSCRIBE_RATE: 0.2,
  },

  STATUS_COLORS: {
    draft: {
      bg: "bg-gray-100",
      text: "text-gray-800",
      border: "border-gray-300",
    },
    scheduled: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      border: "border-blue-300",
    },
    sent: {
      bg: "bg-green-100",
      text: "text-green-800",
      border: "border-green-300",
    },
    failed: {
      bg: "bg-red-100",
      text: "text-red-800",
      border: "border-red-300",
    },
  },

  CAMPAIGN_TEMPLATES: [
    {
      name: "Welcome Series",
      subject: "Welcome to our newsletter!",
      content: `Hi there!

Welcome to our newsletter! We're excited to have you join our community.

In this newsletter, you'll receive:
- Weekly updates on our latest features
- Industry insights and trends
- Exclusive offers and promotions

Thank you for subscribing!

Best regards,
The Team`,
    },
    {
      name: "Product Update",
      subject: "New features and improvements",
      content: `Hello!

We've been busy improving our platform and wanted to share the latest updates with you.

**New Features:**
- Feature 1: Description here
- Feature 2: Description here
- Feature 3: Description here

**Improvements:**
- Improved performance and reliability
- Better user interface
- Enhanced security

Try out these new features and let us know what you think!

Best regards,
The Team`,
    },
    {
      name: "Monthly Newsletter",
      subject: "Monthly roundup - [Month] [Year]",
      content: `Hi [Name]!

Here's what happened this month:

**Highlights:**
- Major achievement or milestone
- Important company news
- Community highlights

**Resources:**
- Helpful article or guide
- Industry report or whitepaper
- Upcoming events or webinars

**What's Next:**
- Preview of upcoming features
- Important dates to remember
- Call to action

Thanks for being part of our community!

Best regards,
The Team`,
    },
  ],
} as const;

export const SUBSCRIBER_SOURCES = [
  "website",
  "landing-page",
  "social-media",
  "referral",
  "event",
  "admin-added",
  "import",
  "api",
] as const;

export type SubscriberSource = (typeof SUBSCRIBER_SOURCES)[number];
