import { ArkosRouter } from 'arkos'
import triageController from "./triage.controller"
import { RouterConfig } from 'arkos'
import ApproveTriageDto from './dtos/approve-triage.dto'
import RejectTriageDto from './dtos/reject-triage.dto'

export const config: RouterConfig<"prisma"> = { }

const triageRouter = ArkosRouter()

triageRouter.post(
  {
    path: "/:id/approve",
    authentication: true,
    validation: { body: ApproveTriageDto },
    experimental: {
      openapi: {
        summary: "Approve and refer triage",
        tags: ["Triages"],
      },
    },
  },
  triageController.approve,
)

triageRouter.post(
  {
    path: "/:id/reject",
    authentication: true,
    validation: { body: RejectTriageDto },
    experimental: {
      openapi: {
        summary: "Reject triage",
        tags: ["Triages"],
      },
    },
  },
  triageController.reject,
)

triageRouter.patch(
  {
    path: "/:id/start-review",
    authentication: true,
    validation: {},
    experimental: {
      openapi: {
        summary: "Mark triage as under review",
        tags: ["Triages"],
      },
    },
  },
  triageController.startReview,
)

export default triageRouter
