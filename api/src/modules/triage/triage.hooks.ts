import {
  beforeCreateOne as stripLegacySymptomField,
  beforeUpdateOne as guardPatientTriageUpdate,
} from "./triage.interceptors";

export const beforeFindOne = [];

export const afterFindOne = [];

export const onFindOneError = [];

export const beforeUpdateOne = guardPatientTriageUpdate;

export const afterUpdateOne = [];

export const onUpdateOneError = [];

/** Arkos carrega hooks.ts; normaliza body antes do Prisma (sem symptomTaken). */
export const beforeCreateOne = stripLegacySymptomField;

export const afterCreateOne = [];

export const onCreateOneError = [];

export const beforeCreateMany = [];

export const afterCreateMany = [];

export const onCreateManyError = [];

export const beforeCount = [];

export const afterCount = [];

export const onCountError = [];

export const beforeFindMany = [];

export const afterFindMany = [];

export const onFindManyError = [];

export const beforeUpdateMany = [];

export const afterUpdateMany = [];

export const onUpdateManyError = [];

export const beforeDeleteOne = [];

export const afterDeleteOne = [];

export const onDeleteOneError = [];

export const beforeDeleteMany = [];

export const afterDeleteMany = [];

export const onDeleteManyError = [];
