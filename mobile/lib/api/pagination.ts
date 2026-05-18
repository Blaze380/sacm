import { unwrapApiData } from "@/lib/api/unwrap";

export type PaginatedResponse<T> = {
  total?: number;
  results?: number;
  data?: T[];
};

export function unwrapPaginated<T>(
  payload: PaginatedResponse<T> | { data: PaginatedResponse<T> },
): T[] {
  const page = unwrapApiData(payload as PaginatedResponse<T>);
  return page.data ?? [];
}
