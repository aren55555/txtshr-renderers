// Shared helpers for interactive renderers that resolve to an answer and
// report it back via a redirect with the answer encoded in a URL fragment
// (the same technique OAuth's implicit grant uses to avoid leaking tokens to
// servers/logs and to sidestep CORS entirely — fragments are never sent over
// the wire, and navigations aren't subject to CORS).
//
// The decrypted text for these renderers is a JWT (header.payload.signature).
// Only the payload is decoded here — no signature verification — because
// that happens server-side when submitUrl's page reads the fragment and
// reports the answer back to its own origin.

export interface BaseRespondPayload {
  kind: string;
  submitUrl: string;
  exp?: number;
}

const base64UrlDecode = (input: string): string => {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

export const decodeJwtPayload = (token: string): unknown => {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid token — expected a JWT with header, payload and signature.");
  }

  try {
    return JSON.parse(base64UrlDecode(parts[1]));
  } catch {
    throw new Error("Invalid token — could not decode payload.");
  }
};

export const isHttpUrl = (s: string): boolean => {
  try {
    const u = new URL(s);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
};

export const isExpired = (exp: number | undefined): boolean =>
  exp !== undefined && Date.now() >= exp * 1000;

export const buildRedirectUrl = (submitUrl: string, token: string, answer: string): string => {
  const url = new URL(submitUrl);
  url.hash = new URLSearchParams({ token, answer }).toString();
  return url.toString();
};
