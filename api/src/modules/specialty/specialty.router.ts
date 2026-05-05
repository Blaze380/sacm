import { ArkosRouter } from 'arkos'
import specialtyController from "./specialty.controller"
import { RouterConfig } from 'arkos'

export const config: RouterConfig<"prisma"> = { }

const specialtyRouter = ArkosRouter()

specialtyRouter.get(
  {
    path: "/custom-endpoint",
    authentication: { action: "CustomAction", resource: "specialty" },
    validation: {},
    experimental: {
      openapi: {},
      // uploads: {}
    }
  },
 // specialtyController.someHandler
)

export default specialtyRouter
