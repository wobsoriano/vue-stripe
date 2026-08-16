declare module '#imports' {
  import type { H3Event } from 'h3'

  export function useRuntimeConfig(event?: H3Event): any
  export function useNuxtApp(): any
}

interface ImportMeta {
  server: boolean
}
