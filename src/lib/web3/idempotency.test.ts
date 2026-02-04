import { describe, expect, test } from "bun:test";
import { createIdempotencyKey } from "./idempotency";

describe("createIdempotencyKey", () => {
  test("is stable for same payload within the same time bucket", async () => {
    const origNow = Date.now;
    try {
      Date.now = () => 1_700_000_000_000;
      const a = await createIdempotencyKey({ action: "send", amount: "1", to: "0xabc" }, { windowSeconds: 600 });
      const b = await createIdempotencyKey({ action: "send", amount: "1", to: "0xabc" }, { windowSeconds: 600 });
      expect(a).toBe(b);
      expect(a.length).toBeGreaterThanOrEqual(24);
    } finally {
      Date.now = origNow;
    }
  });

  test("changes across buckets for same payload", async () => {
    const origNow = Date.now;
    try {
      Date.now = () => 1_700_000_000_000;
      const a = await createIdempotencyKey({ action: "send", amount: "1", to: "0xabc" }, { windowSeconds: 600 });
      Date.now = () => 1_700_000_000_000 + 600_000; // next bucket
      const b = await createIdempotencyKey({ action: "send", amount: "1", to: "0xabc" }, { windowSeconds: 600 });
      expect(a).not.toBe(b);
    } finally {
      Date.now = origNow;
    }
  });
});

