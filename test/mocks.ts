import { vi, type Mock } from 'vite-plus/test'

type MockedFn<T extends (...args: any[]) => any> = Mock<T>

export interface MockElement {
  mount: MockedFn<() => void>
  destroy: MockedFn<() => void>
  on: MockedFn<(...args: any[]) => void>
  update: MockedFn<(...args: any[]) => void>
}

export interface MockElements {
  create: MockedFn<(type: string) => MockElement>
  getElement: MockedFn<(type: string) => MockElement | null>
  update: MockedFn<(...args: any[]) => void>
}

export interface MockCheckoutSession {
  lineItems: never[]
  currency: string
  shippingOptions: never[]
  total: {
    subtotal: number
    taxExclusive: number
    taxInclusive: number
    shippingRate: number
    discount: number
    total: number
  }
  confirmationRequirements: never[]
  canConfirm: boolean
}

export interface MockCheckoutActions {
  getSession: MockedFn<() => MockCheckoutSession>
  applyPromotionCode: MockedFn<(...args: any[]) => void>
  removePromotionCode: MockedFn<(...args: any[]) => void>
  updateShippingAddress: MockedFn<(...args: any[]) => void>
  updateBillingAddress: MockedFn<(...args: any[]) => void>
  updatePhoneNumber: MockedFn<(...args: any[]) => void>
  updateEmail: MockedFn<(...args: any[]) => void>
  updateLineItemQuantity: MockedFn<(...args: any[]) => void>
  updateShippingOption: MockedFn<(...args: any[]) => void>
  confirm: MockedFn<(...args: any[]) => void>
}

export interface MockCheckoutSdk {
  changeAppearance: MockedFn<(...args: any[]) => void>
  loadFonts: MockedFn<(...args: any[]) => void>
  createPaymentElement: MockedFn<() => MockElement>
  createPaymentFormElement: MockedFn<() => MockElement>
  createBillingAddressElement: MockedFn<() => MockElement>
  createShippingAddressElement: MockedFn<() => MockElement>
  createExpressCheckoutElement: MockedFn<() => MockElement>
  getPaymentElement: MockedFn<() => MockElement | null>
  getBillingAddressElement: MockedFn<() => MockElement | null>
  getShippingAddressElement: MockedFn<() => MockElement | null>
  getExpressCheckoutElement: MockedFn<() => MockElement | null>
  on: MockedFn<(event: string, callback: (session: MockCheckoutSession) => void) => void>
  loadActions: MockedFn<() => Promise<{ type: 'success'; actions: MockCheckoutActions }>>
}

export interface MockEmbeddedCheckout {
  mount: MockedFn<(...args: any[]) => void>
  unmount: MockedFn<(...args: any[]) => void>
  destroy: MockedFn<(...args: any[]) => void>
}

export interface MockStripe {
  elements: MockedFn<() => MockElements>
  createToken: MockedFn<(...args: any[]) => void>
  createSource: MockedFn<(...args: any[]) => void>
  createPaymentMethod: MockedFn<(...args: any[]) => void>
  confirmCardPayment: MockedFn<(...args: any[]) => void>
  confirmCardSetup: MockedFn<(...args: any[]) => void>
  paymentRequest: MockedFn<(...args: any[]) => void>
  registerAppInfo: MockedFn<(...args: any[]) => void>
  _registerWrapper: MockedFn<(...args: any[]) => void>
  initCheckout: MockedFn<() => MockCheckoutSdk>
  initEmbeddedCheckout: MockedFn<() => Promise<MockEmbeddedCheckout>>
}

export function mockElement(): MockElement {
  return {
    mount: vi.fn(),
    destroy: vi.fn(),
    on: vi.fn(),
    update: vi.fn(),
  }
}

export function mockElements(): MockElements {
  const elements: Record<string, MockElement> = {}
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

export function mockCheckoutSession(): MockCheckoutSession {
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

export function mockCheckoutActions(): MockCheckoutActions {
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

export function mockCheckoutSdk(): MockCheckoutSdk {
  const elements: Record<string, MockElement> = {}

  return {
    changeAppearance: vi.fn(),
    loadFonts: vi.fn(),
    createPaymentElement: vi.fn(() => {
      elements.payment = mockElement()
      return elements.payment
    }),
    createPaymentFormElement: vi.fn(() => {
      elements.paymentForm = mockElement()
      return elements.paymentForm
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

export function mockEmbeddedCheckout(): MockEmbeddedCheckout {
  return {
    mount: vi.fn(),
    unmount: vi.fn(),
    destroy: vi.fn(),
  }
}

export function mockStripe(): MockStripe {
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
    initEmbeddedCheckout: vi.fn(() => Promise.resolve(mockEmbeddedCheckout())),
  }
}
