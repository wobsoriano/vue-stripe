import { describe, expect, it } from 'vitest'
import * as checkout from './checkout'
import * as root from './index'

const EXPECTED_ELEMENTS = [
  'AddressElement',
  'AuBankAccountElement',
  'CardCvcElement',
  'CardElement',
  'CardExpiryElement',
  'CardNumberElement',
  'ContactDetailsElement',
  'CurrencySelectorElement',
  'ExpressCheckoutElement',
  'IbanElement',
  'IssuingCardCopyButtonElement',
  'IssuingCardCvcDisplayElement',
  'IssuingCardExpiryDisplayElement',
  'IssuingCardNumberDisplayElement',
  'IssuingCardPinDisplayElement',
  'LinkAuthenticationElement',
  'PaymentElement',
  'PaymentMethodMessagingElement',
  'PaymentRequestButtonElement',
  'ShippingAddressElement',
  'TaxIdElement',
  'TermsElement',
]

const EXPECTED_PROVIDERS_AND_COMPOSABLES = [
  'Elements',
  'useElements',
  'useStripe',
  'EmbeddedCheckout',
  'EmbeddedCheckoutProvider',
  'FinancialAccountDisclosure',
  'IssuingDisclosure',
]

describe('root exports', () => {
  it('exports every element component react-stripe-js exports', () => {
    for (const name of EXPECTED_ELEMENTS) {
      expect(root, `missing export ${name}`).toHaveProperty(name)
    }
  })

  it('tags each element component with its stripe element type', () => {
    expect((root.CurrencySelectorElement as any).__elementType).toBe('currencySelector')
    expect((root.ContactDetailsElement as any).__elementType).toBe('contactDetails')
    expect((root.TermsElement as any).__elementType).toBe('terms')
    expect((root.ShippingAddressElement as any).__elementType).toBe('shippingAddress')
    expect((root.IssuingCardCopyButtonElement as any).__elementType).toBe('issuingCardCopyButton')
  })

  it('no longer exports PaymentFormElement', () => {
    expect(root).not.toHaveProperty('PaymentFormElement')
  })

  it('exports the providers and composables', () => {
    for (const name of EXPECTED_PROVIDERS_AND_COMPOSABLES) {
      expect(root, `missing export ${name}`).toHaveProperty(name)
    }
  })

  it('exports nothing beyond the documented surface', () => {
    const expected = [...EXPECTED_ELEMENTS, ...EXPECTED_PROVIDERS_AND_COMPOSABLES].sort()
    expect(Object.keys(root).sort()).toEqual(expected)
  })
})

const EXPECTED_CHECKOUT = [
  'BillingAddressElement',
  'CheckoutElementsProvider',
  'CheckoutForm',
  'CheckoutFormProvider',
  'ContactDetailsElement',
  'CurrencySelectorElement',
  'ExpressCheckoutElement',
  'PaymentElement',
  'ShippingAddressElement',
  'TaxIdElement',
  'TermsElement',
  'useCheckout',
  'useCheckoutElements',
  'useCheckoutForm',
]

describe('checkout exports', () => {
  it('exports every checkout symbol the plan specifies', () => {
    for (const name of EXPECTED_CHECKOUT) {
      expect(checkout, `missing export ${name}`).toHaveProperty(name)
    }
  })

  it('no longer exports the v8 checkout surface', () => {
    expect(checkout).not.toHaveProperty('CheckoutProvider')
    expect(checkout).not.toHaveProperty('PaymentFormElement')
  })

  it('tags the checkout-scoped element components correctly', () => {
    expect((checkout.CheckoutForm as any).__elementType).toBe('paymentForm')
    expect((checkout.ContactDetailsElement as any).__elementType).toBe('contactDetails')
    expect((checkout.TermsElement as any).__elementType).toBe('terms')
  })

  it('exports nothing beyond the documented surface', () => {
    expect(Object.keys(checkout).sort()).toEqual([...EXPECTED_CHECKOUT].sort())
  })
})
