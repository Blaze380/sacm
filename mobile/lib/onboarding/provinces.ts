import type { GetMe200ProvinceEnumKey } from "@/gen/models/GetMe";

const PROVINCE_LABELS: Record<GetMe200ProvinceEnumKey, string> = {
  MAPUTO: "Maputo",
  XAI_XAI: "Gaza",
  INHAMBANE: "Inhambane",
  SOFALA: "Sofala",
  MANICA: "Manica",
  TETE: "Tete",
  ZAMBEZIA: "Zambézia",
  NAMPULA: "Nampula",
  NIASSA: "Niassa",
  CABO_DELGADO: "Cabo Delgado",
};

export const PROVINCE_OPTIONS = (
  Object.entries(PROVINCE_LABELS) as [GetMe200ProvinceEnumKey, string][]
).map(([value, label]) => ({ value, label }));

export function formatProvinceLabel(value: GetMe200ProvinceEnumKey): string {
  return PROVINCE_LABELS[value] ?? value;
}
