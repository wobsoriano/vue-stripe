import { beforeEach, describe, expect, it, vi } from 'vitest'

const runtimeConfig = vi.fn()

vi.mock('#imports', () => ({
  useRuntimeConfig: (...args: unknown[]) => runtimeConfig(...args),
}))

const stripeCtor = vi.fn()
vi.mock('stripe', () => ({
  default: class {
    constructor(...args: unknown[]) {
      stripeCtor(...args)
    }
  },
}))

const fakeEvent = {} as any

async function importFresh() {
  vi.resetModules()
  return (await import('./useServerStripe')).useServerStripe
}

describe('useServerStripe', () => {
  beforeEach(() => {
    stripeCtor.mockClear()
    runtimeConfig.mockReset()
  })

  it('constructs a client with the secret key', async () => {
    runtimeConfig.mockReturnValue({ stripe: { secretKey: 'sk_test_1' } })
    const useServerStripe = await importFresh()
    await useServerStripe(fakeEvent)
    expect(stripeCtor).toHaveBeenCalledWith('sk_test_1', expect.any(Object))
  })

  it('passes the event through to useRuntimeConfig', async () => {
    runtimeConfig.mockReturnValue({ stripe: { secretKey: 'sk_test_1' } })
    const useServerStripe = await importFresh()
    await useServerStripe(fakeEvent)
    expect(runtimeConfig).toHaveBeenCalledWith(fakeEvent)
  })

  it('forwards apiVersion and extra options', async () => {
    runtimeConfig.mockReturnValue({
      stripe: { secretKey: 'sk_test_1', apiVersion: '2025-01-01', options: { maxNetworkRetries: 3 } },
    })
    const useServerStripe = await importFresh()
    await useServerStripe(fakeEvent)
    expect(stripeCtor).toHaveBeenCalledWith('sk_test_1', expect.objectContaining({
      apiVersion: '2025-01-01',
      maxNetworkRetries: 3,
    }))
  })

  it('caches the client across calls', async () => {
    runtimeConfig.mockReturnValue({ stripe: { secretKey: 'sk_test_1' } })
    const useServerStripe = await importFresh()
    const a = await useServerStripe(fakeEvent)
    const b = await useServerStripe(fakeEvent)
    expect(a).toBe(b)
    expect(stripeCtor).toHaveBeenCalledTimes(1)
  })

  it('rebuilds the client when the secret key rotates', async () => {
    runtimeConfig.mockReturnValue({ stripe: { secretKey: 'sk_test_1' } })
    const useServerStripe = await importFresh()
    await useServerStripe(fakeEvent)
    runtimeConfig.mockReturnValue({ stripe: { secretKey: 'sk_test_2' } })
    await useServerStripe(fakeEvent)
    expect(stripeCtor).toHaveBeenCalledTimes(2)
  })

  it('throws a directed error when the secret key is missing', async () => {
    runtimeConfig.mockReturnValue({ stripe: {} })
    const useServerStripe = await importFresh()
    await expect(useServerStripe(fakeEvent)).rejects.toThrow(/NUXT_STRIPE_SECRET_KEY/)
  })

  it('throws a directed error when the stripe config block is absent', async () => {
    runtimeConfig.mockReturnValue({})
    const useServerStripe = await importFresh()
    await expect(useServerStripe(fakeEvent)).rejects.toThrow(/Missing Stripe secret key/)
  })

  it('throws a directed error naming the install command when the stripe package is not installed', async () => {
    runtimeConfig.mockReturnValue({ stripe: { secretKey: 'sk_test_1' } })
    vi.doMock('stripe', () => {
      throw new Error('Cannot find module \'stripe\'')
    })
    try {
      const useServerStripe = await importFresh()
      await expect(useServerStripe(fakeEvent)).rejects.toThrow(/npm install stripe/)
    }
    finally {
      vi.doUnmock('stripe')
    }
  })
})
