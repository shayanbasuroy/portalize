import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log in — Portalize",
  description: "Log in to your Portalize account to manage your client delivery portals.",
  alternates: {
    canonical: "/login",
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
