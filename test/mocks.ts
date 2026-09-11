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
  const create = vi.fn<(type: string) => ReturnType<typeof mockElement>>(mockElement)
  return {
    create,
    getElement: vi.fn((componentOrType) => {
      const type = componentOrType.__elementType || componentOrType
      const index = create.mock.calls.findLastIndex(([createdType]) => createdType === type)
      return create.mock.results[index]?.value ?? null
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

export function mockCheckoutElementsSdk() {
  const elements: Record<string, ReturnType<typeof mockElement>> = {}

  const create = (key: string) => vi.fn(() => {
    elements[key] = mockElement()
    return elements[key]
  })

  return {
    changeAppearance: vi.fn(),
    loadFonts: vi.fn(),
    createPaymentElement: create('payment'),
    createBillingAddressElement: create('billingAddress'),
    createShippingAddressElement: create('shippingAddress'),
    createExpressCheckoutElement: create('expressCheckout'),
    createCurrencySelectorElement: create('currencySelector'),
    createTaxIdElement: create('taxId'),
    createContactDetailsElement: create('contactDetails'),
    createTermsElement: create('terms'),
    createLinkSignupElement: create('linkSignup'),
    getPaymentElement: vi.fn(() => elements.payment || null),
    getBillingAddressElement: vi.fn(() => elements.billingAddress || null),
    getShippingAddressElement: vi.fn(() => elements.shippingAddress || null),
    getExpressCheckoutElement: vi.fn(() => elements.expressCheckout || null),
    getCurrencySelectorElement: vi.fn(() => elements.currencySelector || null),
    getTaxIdElement: vi.fn(() => elements.taxId || null),
    getTermsElement: vi.fn(() => elements.terms || null),
    getLinkSignupElement: vi.fn(() => elements.linkSignup || null),
    on: vi.fn(),
    loadActions: vi.fn().mockResolvedValue({
      type: 'success',
      actions: mockCheckoutActions(),
    }),
  }
}

export function mockCheckoutFormSdk() {
  const elements: Record<string, ReturnType<typeof mockElement>> = {}

  const create = (key: string) => vi.fn(() => {
    elements[key] = mockElement()
    return elements[key]
  })

  return {
    changeAppearance: vi.fn(),
    loadFonts: vi.fn(),
    createForm: create('checkoutForm'),
    createCurrencySelectorElement: create('currencySelector'),
    getForm: vi.fn(() => elements.checkoutForm || null),
    getCurrencySelectorElement: vi.fn(() => elements.currencySelector || null),
    on: vi.fn(),
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
  const checkoutElementsSdk = mockCheckoutElementsSdk()
  const checkoutFormSdk = mockCheckoutFormSdk()

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
    initCheckoutElementsSdk: vi.fn(() => checkoutElementsSdk),
    initCheckoutFormSdk: vi.fn(() => checkoutFormSdk),
    createEmbeddedCheckoutPage: vi.fn(() => Promise.resolve(mockEmbeddedCheckout())),
  }
}
