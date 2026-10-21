import { MemoryAnswerStore } from "./memory-store.ts";
import { RedisAnswerStore } from "./redis-store.ts";
import type { AnswerStore } from "./types.ts";

export type { AnswerStore } from "./types.ts";

// Survives dev hot reloads and is reused across requests in a warm instance.
const globalForStore = globalThis as typeof globalThis & { __novatechStore?: AnswerStore };

export function getStore(): AnswerStore {
  if (!globalForStore.__novatechStore) {
    const redis = RedisAnswerStore.fromEnv();
    if (!redis) {
      console.warn("[store] Redis env vars missing - using in-memory store (data is not persistent).");
    }
    globalForStore.__novatechStore = redis ?? new MemoryAnswerStore();
  }
  return globalForStore.__novatechStore;
}
