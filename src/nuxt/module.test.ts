import { beforeEach, describe, expect, it, vi } from 'vitest'

const added = {
  components: [] as any[],
  imports: [] as any[],
  serverDirs: [] as string[],
}

vi.mock('@nuxt/kit', () => ({
  defineNuxtModule: (def: any) => def,
  createResolver: () => ({ resolve: (p: string) => `/resolved/${p.replace(/^\.\//, '')}` }),
  addComponent: (c: any) => added.components.push(c),
  addImports: (i: any) => added.imports.push(...(Array.isArray(i) ? i : [i])),
  addServerImportsDir: (d: string) => added.serverDirs.push(d),
}))

async function run(options: any = {}) {
  added.components = []
  added.imports = []
  added.serverDirs = []
  vi.resetModules()
  const mod = (await import('./module')).default as any
  const nuxt = { options: { runtimeConfig: { public: {} } } }
  const merged = { ...mod.defaults, ...options }
  await mod.setup(merged, nuxt)
  return { nuxt, added }
}

describe('nuxt module', () => {
  beforeEach(() => vi.clearAllMocks())

  it('writes the publishable key to public runtime config', async () => {
    const { nuxt } = await run({ publishableKey: 'pk_test_1' })
    expect((nuxt.options.runtimeConfig.public as any).stripe.publishableKey).toBe('pk_test_1')
  })

  it('keeps the secret key off the public branch', async () => {
    const { nuxt } = await run({ publishableKey: 'pk_1', secretKey: 'sk_1' })
    expect((nuxt.options.runtimeConfig as any).stripe.secretKey).toBe('sk_1')
    expect(JSON.stringify(nuxt.options.runtimeConfig.public)).not.toContain('sk_1')
  })

  it('registers root components under their bare names', async () => {
    const { added } = await run()
    const names = added.components.map(c => c.name)
    expect(names).toContain('Elements')
    expect(names).toContain('PaymentElement')
    expect(names).toContain('IssuingCardCopyButtonElement')
  })

  it('registers checkout components under a Checkout prefix', async () => {
    const { added } = await run()
    const names = added.components.map(c => c.name)
    expect(names).toContain('CheckoutPaymentElement')
    expect(names).toContain('CheckoutShippingAddressElement')
    expect(names).toContain('CheckoutForm')
    expect(names).toContain('CheckoutElementsProvider')
  })

  it('never registers the same component name twice', async () => {
    const { added } = await run()
    const names = added.components.map(c => c.name)
    expect(new Set(names).size).toBe(names.length)
  })

  it('maps checkout components back to their real export names', async () => {
    const { added } = await run()
    const entry = added.components.find(c => c.name === 'CheckoutPaymentElement')
    expect(entry.export).toBe('PaymentElement')
    expect(entry.filePath).toBe('vue-stripe/checkout')
  })

  it('applies a global prefix on top of the checkout prefix', async () => {
    const { added } = await run({ components: { prefix: 'Stripe' } })
    const names = added.components.map(c => c.name)
    expect(names).toContain('StripePaymentElement')
    expect(names).toContain('StripeCheckoutPaymentElement')
  })

  it('skips component registration when disabled', async () => {
    const { added } = await run({ components: false })
    expect(added.components).toHaveLength(0)
  })

  it('registers the composables', async () => {
    const { added } = await run()
    const names = added.imports.map(i => i.name)
    expect(names).toEqual(expect.arrayContaining([
      'useStripe',
      'useElements',
      'useCheckout',
      'useCheckoutElements',
      'useCheckoutForm',
    ]))
  })

  it('does not register a client stripe composable', async () => {
    const { added } = await run()
    expect(added.imports.map(i => i.name)).not.toContain('useClientStripe')
  })

  it('skips composable registration when disabled', async () => {
    const { added } = await run({ composables: false })
    expect(added.imports).toHaveLength(0)
  })

  it('registers the server utils directory', async () => {
    const { added } = await run()
    expect(added.serverDirs).toHaveLength(1)
    expect(added.serverDirs[0]).toContain('runtime/server/utils')
  })

  it('skips the server half when disabled', async () => {
    const { added } = await run({ server: { enabled: false } })
    expect(added.serverDirs).toHaveLength(0)
  })
})
