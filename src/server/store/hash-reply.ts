/** Raw HGETALL reply: an object when the client deserializes, a flat [field, value, ...] array when it doesn't. */
export type HashReply = Record<string, string> | readonly string[] | null | undefined;

/**
 * With `automaticDeserialization: false`, @upstash/redis returns HGETALL as a flat
 * array. Reading that array as an object would turn its indexes into session ids.
 */
export function toRecord(reply: HashReply): Record<string, string> {
  if (!reply) return {};
  if (!Array.isArray(reply)) return { ...(reply as Record<string, string>) };
  const out: Record<string, string> = {};
  for (let i = 0; i + 1 < reply.length; i += 2) {
    out[reply[i] as string] = reply[i + 1] as string;
  }
  return out;
}
