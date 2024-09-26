import { vi } from 'vitest'

export function mockElement() {
  return {
    mount: vi.fn(),
    destroy: vi.fn(),
    on: vi.fn(),
    update: vi.fn(),
  }
}

export function mockElements() {
  const elements: Record<string, ReturnType<typeof mockElement>> = {}
  return {
    create: vi.fn((type) => {
      elements[type] = mockElement()
      return elements[type]
    }),
    getElement: vi.fn((type) => {
      return elements[type] || null
    }),
    update: vi.fn(),
  }
}

export function mockCustomCheckoutSession() {
  return {
    lineItems: [],
    currency: 'usd',
    shippingOptions: [],
    total: {
      subtotal: 1099,
      taxExclusive: 0,
      taxInclusive: 0,
      shippingRate: 0,
      discount: 0,
      total: 1099,
    },
    confirmationRequirements: [],
    canConfirm: true,
  }
}

export function mockCustomCheckoutSdk() {
  const elements: Record<string, ReturnType<typeof mockElement>> = {}

  return {
    changeAppearance: vi.fn(),
    createElement: vi.fn((type) => {
      elements[type] = mockElement()
      return elements[type]
    }),
    getElement: vi.fn((type) => {
      return elements[type] || null
    }),
    session: vi.fn(() => mockCustomCheckoutSession()),
    applyPromotionCode: vi.fn(),
    removePromotionCode: vi.fn(),
    updateShippingAddress: vi.fn(),
    updateBillingAddress: vi.fn(),
    updatePhoneNumber: vi.fn(),
    updateEmail: vi.fn(),
    updateLineItemQuantity: vi.fn(),
    updateShippingOption: vi.fn(),
    confirm: vi.fn(),
    on: vi.fn(),
  }
}

export function mockEmbeddedCheckout() {
  return {
    mount: vi.fn(),
    unmount: vi.fn(),
    destroy: vi.fn(),
  }
}

export function mockStripe() {
  const customCheckoutSdk = mockCustomCheckoutSdk()
  return {
    elements: vi.fn(() => mockElements()),
    createToken: vi.fn(),
    createSource: vi.fn(),
    createPaymentMethod: vi.fn(),
    confirmCardPayment: vi.fn(),
    confirmCardSetup: vi.fn(),
    paymentRequest: vi.fn(),
    registerAppInfo: vi.fn(),
    _registerWrapper: vi.fn(),
    initCustomCheckout: vi.fn().mockResolvedValue(customCheckoutSdk),
    initEmbeddedCheckout: vi.fn(() =>
      Promise.resolve(mockEmbeddedCheckout()),
    ),
  }
}
