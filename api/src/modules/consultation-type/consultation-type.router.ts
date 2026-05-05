import { ArkosRouter } from 'arkos'
import consultationTypeController from "./consultation-type.controller"
import { RouterConfig } from 'arkos'

export const config: RouterConfig<"prisma"> = { }

const consultationTypeRouter = ArkosRouter()

consultationTypeRouter.get(
  {
    path: "/custom-endpoint",
    authentication: { action: "CustomAction", resource: "consultation-type" },
    validation: {},
    experimental: {
      openapi: {},
      // uploads: {}
    }
  },
  // consultationTypeController.someHandler
)

export default consultationTypeRouter
