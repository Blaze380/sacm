import { ArkosRouter } from 'arkos'
import appointmentController from "./appointment.controller"
import { RouterConfig } from 'arkos'

export const config: RouterConfig<"prisma"> = { }

const appointmentRouter = ArkosRouter()

appointmentRouter.get(
  {
    path: "/custom-endpoint",
    authentication: { action: "CustomAction", resource: "appointment" },
    validation: {},
    experimental: {
      openapi: {},
      // uploads: {}
    }
  },
  appointmentController.someHandler
)

export default appointmentRouter
