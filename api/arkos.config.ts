import { ArkosConfig } from 'arkos'

const config: ArkosConfig = {
  authentication: {
    mode: 'static',
    login: {
      allowedUsernames: ['email'],
    },
    enabled:false,
  },
  routers: {
    strict: "no-bulk"
  },
  validation: {
    resolver: 'class-validator'
  },
  swagger: {
    mode: 'class-validator',
    strict: false,
  },
  middlewares: {
    cors: {
      allowedOrigins: "*"
    },
  },
}

export default config
