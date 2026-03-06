// Deterministic idempotency keys for wallet actions.
// Goal: same semantic action in a short time window => same key; different action => different key.

function stableStringify(value: any): string {
  if (value === null || value === undefined) return String(value);
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;

  const keys = Object.keys(value).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(value[k])}`).join(",")}}`;
}

function toBase64Url(bytes: Uint8Array): string {
  // Browser-safe base64url encoding with Node/Bun fallback.
  let b64: string;
  const anyGlobal = globalThis as any;
  if (typeof anyGlobal.Buffer !== "undefined") {
    b64 = anyGlobal.Buffer.from(bytes).toString("base64");
  } else {
    let str = "";
    for (let i = 0; i < bytes.length; i++) str += String.fromCharCode(bytes[i]);
    b64 = btoa(str);
  }
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export async function createIdempotencyKey(
  payload: Record<string, any>,
  opts?: { windowSeconds?: number },
): Promise<string> {
  const windowSeconds = opts?.windowSeconds ?? 600;
  const bucket = Math.floor(Date.now() / (windowSeconds * 1000));

  const raw = stableStringify({ ...payload, bucket, v: 1 });
  const data = new TextEncoder().encode(raw);

  const digest = await crypto.subtle.digest("SHA-256", data);
  const key = toBase64Url(new Uint8Array(digest));

  // Minimum length for our own validation / storage keys.
  return key.length >= 24 ? key : `${key}${"0".repeat(24 - key.length)}`;
}
