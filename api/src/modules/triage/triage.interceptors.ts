import { UserRole } from '@prisma/client'
import { AppError } from 'arkos/error-handler'
import type { ArkosRequest } from 'arkos'
import { TriageService } from './triage.service'

const STAFF_ROLES = new Set<UserRole>([
  UserRole.ADMINISTRADOR,
  UserRole.RECEPCIONISTA,
])

function isStaff(req: ArkosRequest): boolean {
  const role = req.user?.role as UserRole | undefined
  return role != null && STAFF_ROLES.has(role)
}

export const beforeUpdateOne = [
  async (req: ArkosRequest) => {
    if (isStaff(req)) return

    const body = req.body ?? {}
    for (const key of Object.keys(body)) {
      if (TriageService.isStaffOnlyField(key)) {
        throw new AppError('You are not allowed to update this field', 403)
      }
      if (key === 'patient' || key === 'analyzedBy') {
        throw new AppError('You are not allowed to update this field', 403)
      }
    }
  },
]

export const beforeCreateOne = [
  // async (req: ArkosRequest) => {
  //   const body = req.body as Record<string, unknown> | undefined
  //   if (!body) return

//     const symptom =
//       typeof body.symptom === 'string'
//         ? body.symptom
//         : typeof body.symptomTaken === 'string'
//           ? body.symptomTaken
//           : undefined
// console.log(body);
//     if (symptom) {
//       body.symptom = symptom
//     }
//     delete body.symptomTaken
//   },
]

export const afterCreateOne = []

export const onCreateOneError = []

export const beforeFindOne = []

export const afterFindOne = []

export const onFindOneError = []

export const afterUpdateOne = []

export const onUpdateOneError = []

export const beforeDeleteOne = []

export const afterDeleteOne = []

export const onDeleteOneError = []

export const beforeCreateMany = []

export const afterCreateMany = []

export const onCreateManyError = []

export const beforeCount = []

export const afterCount = []

export const onCountError = []

export const beforeFindMany = []

export const afterFindMany = []

export const onFindManyError = []

export const beforeUpdateMany = []

export const afterUpdateMany = []

export const onUpdateManyError = []

export const beforeDeleteMany = []

export const afterDeleteMany = []

export const onDeleteManyError = []
