import { unwrapApiData } from "@/lib/api/unwrap";

export type PaginatedResponse<T> = {
  total?: number;
  results?: number;
  data?: T[];
};

function isPaginatedBody<T>(value: unknown): value is PaginatedResponse<T> {
  return (
    value !== null &&
    typeof value === "object" &&
    "data" in value &&
    Array.isArray((value as PaginatedResponse<T>).data)
  );
}

export function unwrapPaginated<T>(
  payload: PaginatedResponse<T> | { data: PaginatedResponse<T> | T[] },
): T[] {
  const unwrapped = unwrapApiData(
    payload as PaginatedResponse<T> | { data: PaginatedResponse<T> | T[] },
  );

  if (Array.isArray(unwrapped)) {
    return unwrapped;
  }

  if (isPaginatedBody<T>(unwrapped)) {
    return unwrapped.data ?? [];
  }

  return [];
}
