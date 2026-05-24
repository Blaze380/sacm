import { defineConfig } from '@kubb/core'
import { pluginOas } from '@kubb/plugin-oas'
import { pluginTs } from '@kubb/plugin-ts'
import { pluginClient } from '@kubb/plugin-client'
import { pluginZod } from '@kubb/plugin-zod'

export default defineConfig({
  root: '.',
  input: {
    path: './openapi.yaml',
  },
  output: {
    path: './src/gen',
    clean: true,
  },
  plugins: [
    pluginOas(),
    pluginTs({
      output: { path: 'models' },
    }),
    pluginClient({
      output: { path: 'clients' },
      baseURL: 'http://localhost:8000',
    }),
    pluginZod({
      output: { path: 'zod' },
    }),
  ],
})
