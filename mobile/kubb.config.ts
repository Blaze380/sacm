import { defineConfig } from '@kubb/core'
import { pluginOas } from '@kubb/plugin-oas'
import { pluginTs } from '@kubb/plugin-ts'
import { pluginClient } from '@kubb/plugin-client'
import { pluginZod } from '@kubb/plugin-zod'

export default defineConfig({
  root: '.',
  input: {
    path: './api-1.yaml',
  },
  output: {
    path: './gen',
    clean: true,
  },
  plugins: [
    pluginOas(),
    pluginTs({
      output: { path: 'models' },
    }),
    pluginClient({
      output: { path: 'clients' },
      baseURL: process.env.EXPO_PUBLIC_API_URL ?? 'http://kami-no-notebook:8000',
    }),
    pluginZod({
      output: { path: 'zod' },
    }),
  ],
})
