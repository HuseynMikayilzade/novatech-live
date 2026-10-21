import type { AnswerRequest, ApiErrorBody, ResetResponse, ResultsResponse } from "./api-types.ts";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const NETWORK_MESSAGE = "Şəbəkə ilə əlaqə yoxdur. İnterneti yoxlayıb yenidən cəhd edin.";

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(input, { ...init, headers: { "Content-Type": "application/json", ...init?.headers }, cache: "no-store" });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new ApiError(NETWORK_MESSAGE, 0);
  }
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ApiErrorBody | null;
    throw new ApiError(body?.error.message ?? `Gözlənilməz xəta (${response.status}).`, response.status, body?.error.code);
  }
  return (await response.json()) as T;
}

export function submitAnswer(answer: AnswerRequest): Promise<{ ok: true }> {
  return request("/api/answer", { method: "POST", body: JSON.stringify(answer) });
}

export function fetchResults(signal?: AbortSignal): Promise<ResultsResponse> {
  return request("/api/results", { signal });
}

export function resetResults(key: string): Promise<ResetResponse> {
  return request("/api/admin/reset", { method: "POST", body: JSON.stringify({ key }) });
}
