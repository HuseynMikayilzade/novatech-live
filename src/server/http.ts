import type { ApiErrorBody, ApiErrorCode } from "@/lib/api-types.ts";

export type { ApiErrorCode };

export function jsonError(status: number, code: ApiErrorCode, message: string, headers?: HeadersInit): Response {
  const body: ApiErrorBody = { error: { code, message } };
  return Response.json(body, { status, headers });
}

/** Parses a small JSON body, rejecting oversized payloads before reading them. */
export async function readJsonBody(request: Request, maxBytes: number): Promise<{ ok: true; data: unknown } | { ok: false; response: Response }> {
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > maxBytes) {
    return { ok: false, response: jsonError(413, "payload_too_large", "Sorğu həcmi çox böyükdür.") };
  }
  const text = await request.text();
  if (text.length > maxBytes) {
    return { ok: false, response: jsonError(413, "payload_too_large", "Sorğu həcmi çox böyükdür.") };
  }
  try {
    return { ok: true, data: JSON.parse(text) };
  } catch {
    return { ok: false, response: jsonError(400, "invalid_json", "Sorğunun formatı düzgün deyil.") };
  }
}
