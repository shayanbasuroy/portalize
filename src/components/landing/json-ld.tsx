export function JsonLd() {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Portalize",
    applicationCategory: "BusinessApplication",
    operatingSystem: "All",
    url: "https://www.portalize.site",
    description:
      "Zero-login client portal for freelancers. Share deliverables with 4-digit PIN access, watermarked in-browser previews, and invoice payment-gated downloads.",
    offers: [
      {
        "@type": "Offer",
        name: "Starter",
        price: "0",
        priceCurrency: "USD",
        description: "1 active client portal, watermarked previews, PIN-protected access.",
      },
      {
        "@type": "Offer",
        name: "Pro Freelancer",
        price: "9.00",
        priceCurrency: "USD",
        billingDuration: "P1M",
        description: "Unlimited client portals, payment-gated downloads, custom branding, read receipts.",
      },
    ],
    author: {
      "@type": "Organization",
      name: "Portalize",
      url: "https://www.portalize.site",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Do my clients need to create an account?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Every portal opens with a link and a 4-digit PIN. No passwords, no signup, no plugins on their side.",
        },
      },
      {
        "@type": "Question",
        name: "When do downloads unlock for the client?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The moment you mark the invoice as paid. Downloads are gated automatically, so the client sees watermarked previews until then and the real files the second payment clears.",
        },
      },
      {
        "@type": "Question",
        name: "Can I watermark previews?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, watermarks are on by default. They appear on every preview and never touch the real files, which only unlock after payment.",
        },
      },
      {
        "@type": "Question",
        name: "What can I share inside a portal?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Files such as PDFs, images, and zips, plus code snippets and links. Anything with a preview renders right in the browser, so clients never need to download to look.",
        },
      },
      {
        "@type": "Question",
        name: "Is there a free plan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Starter is free to try with one active portal. Upgrade to Pro Freelancer whenever you want unlimited portals, custom branding, and payment-gated downloads.",
        },
      },
      {
        "@type": "Question",
        name: "Can I cancel anytime?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Pro is billed month to month. Cancel in one click and keep your portals working until the end of the billing period.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
