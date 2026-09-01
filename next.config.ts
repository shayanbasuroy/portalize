import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Server Actions reject request bodies over 1MB by default. Deliverable
    // uploads (ZIPs, PDFs, images) go through Server Actions, so raise the
    // limit to match the 50MB ceiling advertised in the upload UI.
    serverActions: {
      bodySizeLimit: "50mb",
    },
    // The proxy buffers request bodies (default 10MB). Since upload POSTs pass
    // through the `/dashboard/:path*` proxy, raise this too or bodies above
    // 10MB get truncated and the file arrives corrupted.
    proxyClientMaxBodySize: "50mb",
  },
};

export default nextConfig;
