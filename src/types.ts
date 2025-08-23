import type * as stripeJs from '@stripe/stripe-js'

type ElementProps = {
  id?: string
  class?: string
}

export type WithElementProps<T extends object> = T & ElementProps

export type BaseElementEmits = {
  blur: (event: { elementType: stripeJs.StripeElementType }) => void
  focus: (event: { elementType: stripeJs.StripeElementType }) => void
}

export type AuBankAccountElementProps = WithElementProps<{
  options?: stripeJs.StripeAuBankAccountElementOptions
}>

export type AuBankAccountElementEmits = BaseElementEmits & {
  change: (event: stripeJs.StripeAuBankAccountElementChangeEvent) => void
  ready: (element: stripeJs.StripeAuBankAccountElement) => void
  escape: () => void
}

export type CardElementProps = WithElementProps<{
  options?: stripeJs.StripeCardElementOptions
}>

export type CardElementEmits = BaseElementEmits & {
  change: (event: stripeJs.StripeCardElementChangeEvent) => void
  ready: (element: stripeJs.StripeCardElement) => void
  escape: () => void
  networkschange: (event: { elementType: 'card' }) => void
  loaderror: (event: { elementType: 'card', error: stripeJs.StripeError }) => void
}

export type CardNumberElementProps = WithElementProps<{
  options?: stripeJs.StripeCardNumberElementOptions
}>

export type CardNumberElementEmits = BaseElementEmits & {
  change: (event: stripeJs.StripeCardNumberElementChangeEvent) => void
  ready: (element: stripeJs.StripeCardNumberElement) => void
  escape: () => void
  networkschange: (event: { elementType: 'cardNumber' }) => void
  loaderror: (event: { elementType: 'cardNumber', error: stripeJs.StripeError }) => void
}

export type CardExpiryElementProps = WithElementProps<{
  options?: stripeJs.StripeCardExpiryElementOptions
}>

export type CardExpiryElementEmits = BaseElementEmits & {
  change: (event: stripeJs.StripeCardExpiryElementChangeEvent) => void
  ready: (element: stripeJs.StripeCardExpiryElement) => void
  escape: () => void
}

export type CardCvcElementProps = WithElementProps<{
  options?: stripeJs.StripeCardCvcElementOptions
}>

export type CardCvcElementEmits = BaseElementEmits & {
  change: (event: stripeJs.StripeCardCvcElementChangeEvent) => void
  ready: (element: stripeJs.StripeCardCvcElement) => void
  escape: () => void
}

export type FpxBankElementProps = WithElementProps<{
  options?: stripeJs.StripeFpxBankElementOptions
}>

export type FpxBankElementEmits = BaseElementEmits & {
  change: (event: stripeJs.StripeFpxBankElementChangeEvent) => void
  ready: (element: stripeJs.StripeFpxBankElement) => void
  escape: () => void
}

export type IbanElementProps = WithElementProps<{
  options?: stripeJs.StripeIbanElementOptions
}>

export type IbanElementEmits = BaseElementEmits & {
  change: (event: stripeJs.StripeIbanElementChangeEvent) => void
  ready: (element: stripeJs.StripeIbanElement) => void
  escape: () => void
}

export type IdealBankElementProps = WithElementProps<{
  options?: stripeJs.StripeIdealBankElementOptions
}>

export type IdealBankElementEmits = BaseElementEmits & {
  change: (event: stripeJs.StripeIdealBankElementChangeEvent) => void
  ready: (element: stripeJs.StripeIdealBankElement) => void
  escape: () => void
}

export type P24BankElementProps = WithElementProps<{
  options?: stripeJs.StripeP24BankElementOptions
}>

export type P24BankElementEmits = BaseElementEmits & {
  change: (event: stripeJs.StripeP24BankElementChangeEvent) => void
  ready: (element: stripeJs.StripeP24BankElement) => void
  escape: () => void
}

export type LinkAuthenticationElementProps = WithElementProps<{
  options?: stripeJs.StripeLinkAuthenticationElementOptions
}>

export type LinkAuthenticationElementEmits = BaseElementEmits & {
  change: (event: stripeJs.StripeLinkAuthenticationElementChangeEvent) => void
  ready: (element: stripeJs.StripeLinkAuthenticationElement) => void
  escape: () => void
  loaderror: (event: { elementType: 'linkAuthentication', error: stripeJs.StripeError }) => void
  loaderstart: (event: { elementType: 'linkAuthentication' }) => void
}

export type EpsBankElementProps = WithElementProps<{
  options?: stripeJs.StripeEpsBankElementOptions
}>

export type EpsBankElementEmits = BaseElementEmits & {
  change: (event: stripeJs.StripeEpsBankElementChangeEvent) => void
  ready: (element: stripeJs.StripeEpsBankElement) => void
  escape: () => void
}

export type PaymentElementProps = WithElementProps<{
  options?: stripeJs.StripePaymentElementOptions
}>

export type PaymentElementEmits = BaseElementEmits & {
  change: (event: stripeJs.StripePaymentElementChangeEvent) => void
  ready: (element: stripeJs.StripePaymentElement) => void
  escape: () => void
  loaderror: (event: { elementType: 'payment', error: stripeJs.StripeError }) => void
  /**
   * Triggered when the [loader](https://stripe.com/docs/js/elements_object/create#stripe_elements-options-loader) UI is mounted to the DOM and ready to be displayed.
   */
  loaderstart: (event: { elementType: 'payment' }) => void
}

export type ExpressCheckoutElementProps = WithElementProps<{
  options?: stripeJs.StripeExpressCheckoutElementOptions
}>

export type ExpressCheckoutElementEmits = BaseElementEmits & {
  ready: (event: stripeJs.StripeExpressCheckoutElementReadyEvent) => void
  escape: () => void
  loaderror: (event: { elementType: 'expressCheckout', error: stripeJs.StripeError }) => void
  click: (event: stripeJs.StripeExpressCheckoutElementClickEvent) => void
  confirm: (event: stripeJs.StripeExpressCheckoutElementConfirmEvent) => void
  cancel: (event: { elementType: 'expressCheckout' }) => void
  shippingaddresschange: (event: stripeJs.StripeExpressCheckoutElementShippingAddressChangeEvent) => void
  shippingratechange: (event: stripeJs.StripeExpressCheckoutElementShippingRateChangeEvent) => void
}

export type CurrencySelectorElementProps = ElementProps

export type CurrencySelectorElementEmits = BaseElementEmits & {
  /**
   * Triggered when the Element is fully rendered and can accept imperative `element.focus()` calls.
   * Called with a reference to the underlying [Element instance](https://stripe.com/docs/js/element).
   */
  ready: (event: stripeJs.StripeCurrencySelectorElement) => void
  /**
   * Triggered when the escape key is pressed within the Element.
   */
  escape: () => void
  /**
   * Triggered when the Element fails to load.
   */
  loaderror: (event: { elementType: 'currencySelector', error: stripeJs.StripeError }) => void
}

export type PaymentRequestButtonElementProps = WithElementProps<{
  options?: stripeJs.StripePaymentRequestButtonElementOptions
}>

export type PaymentRequestButtonElementEmits = BaseElementEmits & {
  click: (event: stripeJs.StripePaymentRequestButtonElementClickEvent) => void
  ready: (element: stripeJs.StripePaymentRequestButtonElement) => void
}

export type AddressElementProps = WithElementProps<{
  options: stripeJs.StripeAddressElementOptions
}>

export type AddressElementEmits = BaseElementEmits & {
  change: (event: stripeJs.StripeAddressElementChangeEvent) => void
  ready: (element: stripeJs.StripeAddressElement) => void
  escape: () => void
  loaderror: (event: { elementType: 'address', error: stripeJs.StripeError }) => void
  loaderstart: (event: { elementType: 'address' }) => void
}

export type PaymentMethodMessagingElementProps = WithElementProps<{
  options?: stripeJs.StripePaymentMethodMessagingElementOptions
}>

export type PaymentMethodMessagingElementEmits = BaseElementEmits & {
  ready: (element: stripeJs.StripePaymentMethodMessagingElement) => void
}

export type AffirmMessageElementProps = WithElementProps<{
  options?: stripeJs.StripeAffirmMessageElementOptions
}>

export type AffirmMessageElementEmits = BaseElementEmits & {
  ready: (element: stripeJs.StripeAffirmMessageElement) => void
}

export type AfterpayClearpayMessageElementProps = WithElementProps<{
  options?: stripeJs.StripeAfterpayClearpayMessageElementOptions
}>

export type AfterpayClearpayMessageElementEmits = BaseElementEmits & {
  ready: (element: stripeJs.StripeAfterpayClearpayMessageElement) => void
}

export type TaxIdElementProps = WithElementProps<{
  /**
   * An object containing Element configuration options.
   */
  options?: stripeJs.StripeTaxIdElementOptions
}>

export type TaxIdElementEmits = BaseElementEmits & {
  /**
   * Triggered when data exposed by this Element is changed (e.g., when there is an error).
   */
  change: (event: stripeJs.StripeTaxIdElementChangeEvent) => void
  /**
   * Triggered when the Element is fully rendered and can accept imperative `element.focus()` calls.
   */
  ready: (element: stripeJs.StripeTaxIdElement) => void
  /**
   * Triggered when the escape key is pressed within the Element.
   */
  escape: () => void
  /**
   * Triggered when the Element fails to load.
   */
  loaderror: (event: { elementType: 'taxId', error: stripeJs.StripeError }) => void
  /**
   * Triggered when the [loader](https://stripe.com/docs/js/elements_object/create#stripe_elements-options-loader) UI is mounted to the DOM and ready to be displayed.
   */
  loaderstart: (event: { elementType: 'taxId' }) => void
}

export type UnknownOptions = { [k: string]: unknown }
