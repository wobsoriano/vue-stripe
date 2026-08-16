import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

const nuxtApp: Record<string, unknown> = {}
const runtimeConfig = vi.fn()

vi.mock('#imports', () => ({
  useNuxtApp: () => nuxtApp,
  useRuntimeConfig: () => runtimeConfig(),
}))

const loadStripe = Object.assign(vi.fn(), { setLoadParameters: vi.fn() })
vi.mock('@stripe/stripe-js/pure', () => ({ loadStripe }))

async function importFresh() {
  vi.resetModules()
  return (await import('./useClientStripe')).useClientStripe
}

describe('useClientStripe', () => {
  beforeEach(() => {
    for (const key of Object.keys(nuxtApp)) {
      delete nuxtApp[key]
    }
    loadStripe.mockReset()
    loadStripe.setLoadParameters.mockReset()
    runtimeConfig.mockReturnValue({ public: { stripe: { publishableKey: 'pk_test_1' } } })
  })

  it('starts as null and resolves to the loaded instance', async () => {
    const instance = { id: 'stripe' }
    loadStripe.mockResolvedValue(instance)
    const useClientStripe = await importFresh()

    const stripe = useClientStripe()
    expect(stripe.value).toBeNull()

    await nextTick()
    await Promise.resolve()
    expect(stripe.value).toBe(instance)
  })

  it('loads Stripe.js only once across callers', async () => {
    loadStripe.mockResolvedValue({ id: 'stripe' })
    const useClientStripe = await importFresh()

    useClientStripe()
    useClientStripe()
    useClientStripe()

    expect(loadStripe).toHaveBeenCalledTimes(1)
  })

  it('passes the publishable key and options through', async () => {
    loadStripe.mockResolvedValue({ id: 'stripe' })
    runtimeConfig.mockReturnValue({
      public: { stripe: { publishableKey: 'pk_test_2', options: { locale: 'fr' } } },
    })
    const useClientStripe = await importFresh()

    useClientStripe()
    expect(loadStripe).toHaveBeenCalledWith('pk_test_2', { locale: 'fr' })
  })

  it('disables advanced fraud signals when configured', async () => {
    loadStripe.mockResolvedValue({ id: 'stripe' })
    runtimeConfig.mockReturnValue({
      public: { stripe: { publishableKey: 'pk_test_1', advancedFraudSignals: false } },
    })
    const useClientStripe = await importFresh()

    useClientStripe()
    expect(loadStripe.setLoadParameters).toHaveBeenCalledWith({ advancedFraudSignals: false })
  })

  it('does not touch load parameters by default', async () => {
    loadStripe.mockResolvedValue({ id: 'stripe' })
    const useClientStripe = await importFresh()

    useClientStripe()
    expect(loadStripe.setLoadParameters).not.toHaveBeenCalled()
  })

  it('throws a directed error when the publishable key is missing', async () => {
    runtimeConfig.mockReturnValue({ public: { stripe: {} } })
    const useClientStripe = await importFresh()

    expect(() => useClientStripe()).toThrow(/NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY/)
  })
})
