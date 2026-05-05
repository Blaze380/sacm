import { ArkosRouter } from 'arkos'
import notificationController from "./notification.controller"
import { RouterConfig } from 'arkos'

export const config: RouterConfig<"prisma"> = { }

const notificationRouter = ArkosRouter()

notificationRouter.get(
  {
    path: "/custom-endpoint",
    authentication: { action: "CustomAction", resource: "notification" },
    validation: {},
    experimental: {
      openapi: {},
      // uploads: {}
    }
  },
  notificationController.someHandler
)

export default notificationRouter
