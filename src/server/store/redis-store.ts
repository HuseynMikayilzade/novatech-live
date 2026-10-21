import { Redis } from "@upstash/redis";
import type { RawSnapshot } from "@/domain/aggregate.ts";
import { parseLiveState, type LiveState } from "@/domain/live.ts";
import { QUESTION_IDS, type QuestionId } from "@/domain/questions.ts";
import { toRecord, type HashReply } from "./hash-reply.ts";
import { LIVE_TTL_SEC, keys, type AnswerStore, type SaveAnswerInput } from "./types.ts";

export class RedisAnswerStore implements AnswerStore {
  readonly persistent = true;

  constructor(private readonly redis: Redis) {}

  static fromEnv(env: NodeJS.ProcessEnv = process.env): RedisAnswerStore | null {
    // Vercel's Upstash integration may expose either naming scheme.
    const url = env.UPSTASH_REDIS_REST_URL ?? env.KV_REST_API_URL;
    const token = env.UPSTASH_REDIS_REST_TOKEN ?? env.KV_REST_API_TOKEN;
    if (!url || !token) return null;
    // Keep raw strings: answers are encoded by the domain layer, not JSON.
    return new RedisAnswerStore(new Redis({ url, token, automaticDeserialization: false }));
  }

  async saveAnswer({ sessionId, questionId, value, durationMs }: SaveAnswerInput): Promise<void> {
    const tx = this.redis.multi();
    tx.sadd(keys.sessions, sessionId);
    tx.hset(keys.answers(questionId), { [sessionId]: value });
    if (durationMs === null) tx.hdel(keys.durations(questionId), sessionId);
    else tx.hset(keys.durations(questionId), { [sessionId]: String(durationMs) });
    await tx.exec();
  }

  async snapshot(): Promise<RawSnapshot> {
    // One HTTP round trip for the whole snapshot.
    const pipe = this.redis.pipeline();
    pipe.smembers(keys.sessions);
    for (const q of QUESTION_IDS) {
      pipe.hgetall(keys.answers(q));
      pipe.hgetall(keys.durations(q));
    }
    const [sessions, ...hashes] = await pipe.exec<[string[], ...HashReply[]]>();

    const answers = {} as Record<QuestionId, Record<string, string>>;
    const durations = {} as Record<QuestionId, Record<string, number>>;
    QUESTION_IDS.forEach((q, i) => {
      answers[q] = toRecord(hashes[i * 2]);
      const rawDurations = toRecord(hashes[i * 2 + 1]);
      durations[q] = Object.fromEntries(
        Object.entries(rawDurations).map(([sid, ms]) => [sid, Number(ms)] as const).filter(([, ms]) => Number.isFinite(ms)),
      );
    });
    return { sessions: sessions ?? [], answers, durations };
  }

  async reset(): Promise<void> {
    await this.redis.del(keys.sessions, ...QUESTION_IDS.flatMap((q) => [keys.answers(q), keys.durations(q)]));
  }

  async getLive(): Promise<LiveState | null> {
    const raw = await this.redis.get<string>(keys.live);
    if (!raw) return null;
    try {
      return parseLiveState(JSON.parse(raw));
    } catch {
      return null;
    }
  }

  async setLive(state: LiveState | null): Promise<void> {
    if (state) await this.redis.set(keys.live, JSON.stringify(state), { ex: LIVE_TTL_SEC });
    else await this.redis.del(keys.live);
  }

  async hit(key: string, windowSec: number): Promise<number> {
    const redisKey = keys.counter(key);
    const count = await this.redis.incr(redisKey);
    if (count === 1) await this.redis.expire(redisKey, windowSec);
    return count;
  }
}
