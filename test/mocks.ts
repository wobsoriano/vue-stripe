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

export function mockCheckoutSession() {
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

export function mockCheckoutActions() {
  return {
    getSession: vi.fn(() => mockCheckoutSession()),
    applyPromotionCode: vi.fn(),
    removePromotionCode: vi.fn(),
    updateShippingAddress: vi.fn(),
    updateBillingAddress: vi.fn(),
    updatePhoneNumber: vi.fn(),
    updateEmail: vi.fn(),
    updateLineItemQuantity: vi.fn(),
    updateShippingOption: vi.fn(),
    confirm: vi.fn(),
  }
}

export function mockCheckoutSdk() {
  const elements: Record<string, ReturnType<typeof mockElement>> = {}

  return {
    changeAppearance: vi.fn(),
    loadFonts: vi.fn(),
    createPaymentElement: vi.fn(() => {
      elements.payment = mockElement()
      return elements.payment
    }),
    createBillingAddressElement: vi.fn(() => {
      elements.billingAddress = mockElement()
      return elements.billingAddress
    }),
    createShippingAddressElement: vi.fn(() => {
      elements.shippingAddress = mockElement()
      return elements.shippingAddress
    }),
    createExpressCheckoutElement: vi.fn(() => {
      elements.expressCheckout = mockElement()
      return elements.expressCheckout
    }),
    getPaymentElement: vi.fn(() => {
      return elements.payment || null
    }),
    getBillingAddressElement: vi.fn(() => {
      return elements.billingAddress || null
    }),
    getShippingAddressElement: vi.fn(() => {
      return elements.shippingAddress || null
    }),
    getExpressCheckoutElement: vi.fn(() => {
      return elements.expressCheckout || null
    }),

    on: vi.fn((event, callback) => {
      if (event === 'change') {
        // Simulate initial session call
        setTimeout(() => callback(mockCheckoutSession()), 0)
      }
    }),
    loadActions: vi.fn().mockResolvedValue({
      type: 'success',
      actions: mockCheckoutActions(),
    }),
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
  const checkoutSdk = mockCheckoutSdk()

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
    initCheckout: vi.fn(() => checkoutSdk),
    initEmbeddedCheckout: vi.fn(() =>
      Promise.resolve(mockEmbeddedCheckout()),
    ),
  }
}
