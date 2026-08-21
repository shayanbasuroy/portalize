// HMAC-signed, expiring portal session tokens. Web Crypto only, so it runs in
// the Edge runtime (proxy/middleware) as well as the Node runtime.
//
// PRD §6.1: client access is scoped to a project and must not be forgeable. The
// previous implementation stored a static "verified" string, which anyone could
// set by hand. These tokens are `${issuedAt}.${signature}` where the signature
// is HMAC-SHA256(secret, `${slug}.${issuedAt}`) — unforgeable without the secret.

const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function getSecret(): string {
  return (
    process.env.SESSION_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "portalize-insecure-dev-secret-change-me"
  );
}

async function hmacSha256Hex(message: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Constant-time comparison to avoid leaking signature bytes via timing.
function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function createPortalSessionToken(slug: string): Promise<string> {
  const issuedAt = Date.now();
  const signature = await hmacSha256Hex(`${slug}.${issuedAt}`, getSecret());
  return `${issuedAt}.${signature}`;
}

export async function verifyPortalSessionToken(
  slug: string,
  token: string,
): Promise<boolean> {
  if (!token) return false;
  const dot = token.indexOf(".");
  if (dot === -1) return false;
  const issuedAt = Number(token.slice(0, dot));
  const signature = token.slice(dot + 1);
  if (!Number.isFinite(issuedAt) || issuedAt <= 0) return false;
  if (Date.now() - issuedAt > TTL_MS) return false;
  const expected = await hmacSha256Hex(`${slug}.${issuedAt}`, getSecret());
  return timingSafeEqualHex(signature, expected);
}
