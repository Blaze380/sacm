import { ArkosRouter } from 'arkos'
import triageController from "./triage.controller"
import { RouterConfig } from 'arkos'

export const config: RouterConfig<"prisma"> = { }

const triageRouter = ArkosRouter()

triageRouter.get(
  {
    path: "/custom-endpoint",
    authentication: { action: "CustomAction", resource: "triage" },
    validation: {},
    experimental: {
      openapi: {},
      // uploads: {}
    }
  },
  triageController.someHandler
)

export default triageRouter
