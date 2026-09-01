import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get started free — Portalize",
  description: "Create your free Portalize account. Build your first private client portal in minutes — no credit card required.",
  alternates: {
    canonical: "/signup",
  },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
