"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { CountUp, EASE, Heading, Reveal } from "@/components/landing/reveal";

type Plan = {
  name: string;
  tagline: string;
  price: number;
  period: string;
  cta: string;
  popular?: boolean;
  features: string[];
};

const plans: Plan[] = [
  {
    name: "Starter",
    tagline: "Try Portalize with your next client.",
    price: 0,
    period: "free trial",
    cta: "Start free",
    features: [
      "1 active client portal",
      "Watermarked in-browser previews",
      "PIN-protected client access",
      "Feedback and approvals",
    ],
  },
  {
    name: "Pro Freelancer",
    tagline: "For full-time freelancers shipping every week.",
    price: 9,
    period: "/ month",
    cta: "Start 14-day free trial",
    popular: true,
    features: [
      "Unlimited client portals",
      "Payment-gated downloads",
      "Custom branding and your subdomain",
      "Read receipts and activity",
      "Priority support",
    ],
  },
];

/**
 * Two plans separated by a vertical rule — never a highlight card. The Pro
 * column is flagged with a plain mono label and carries the solid CTA. Prices
 * count up as the section enters.
 */
export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-16 border-t border-zinc-200">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="max-w-2xl">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
              Pricing
            </p>
          </Reveal>
          <Heading className="mt-6 text-3xl font-medium leading-[1.05] tracking-[-0.02em] text-[#151B45] sm:text-4xl lg:text-5xl">
            Start free. Upgrade when it pays for itself.
          </Heading>
        </div>

        <div className="mt-14 grid lg:grid-cols-2 lg:divide-x lg:divide-zinc-200">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, ease: EASE, delay: i * 0.1 }}
              className="py-10 lg:px-14 lg:py-4 lg:first:pl-0 lg:last:pr-0"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-xl font-medium tracking-tight text-[#151B45]">
                  {plan.name}
                </h3>
                {plan.popular && (
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400">
                    Most popular
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-zinc-600">{plan.tagline}</p>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-5xl font-medium tracking-tight text-[#151B45]">
                  $
                  <CountUp to={plan.price} duration={1.2} delay={i * 0.1 + 0.1} />
                </span>
                <span className="text-sm text-zinc-500">{plan.period}</span>
              </div>

              <ul className="mt-8 space-y-3 border-t border-zinc-200 pt-8">
                {plan.features.map((f, fi) => (
                  <motion.li
                    key={f}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.4, ease: EASE, delay: i * 0.1 + 0.15 + fi * 0.06 }}
                    className="flex items-start gap-3 text-sm text-zinc-600"
                  >
                    <span aria-hidden className="mt-[7px] h-px w-3 shrink-0 bg-zinc-300" />
                    {f}
                  </motion.li>
                ))}
              </ul>

              <Link
                href="/signup"
                className={`group mt-9 inline-flex w-full items-center justify-center gap-2 px-6 py-3.5 text-sm font-medium transition-colors duration-150 ease-out sm:w-auto ${
                  plan.popular
                    ? "bg-[#151B45] text-[#F8F7FC] hover:bg-zinc-800"
                    : "border border-zinc-300 text-[#151B45] hover:border-[#151B45]"
                }`}
              >
                {plan.cta}
                <motion.span
                  className="inline-flex"
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.6 }}
                >
                  <ArrowRight className="size-4" strokeWidth={2} />
                </motion.span>
              </Link>
            </motion.div>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-10 font-mono text-xs text-zinc-400">
            Billed month to month. Cancel in one click.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
