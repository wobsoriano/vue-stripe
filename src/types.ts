import type * as stripeJs from '@stripe/stripe-js'
import type { ObjectEmitsOptions } from 'vue'

export type BaseElementProps = {
  id?: string
  class?: string
}

export type WithBaseElementProps<T extends object> = T & BaseElementProps

export type BaseElementEmits = {
  blur: (event: { elementType: stripeJs.StripeElementType }) => void
  focus: (event: { elementType: stripeJs.StripeElementType }) => void
}

export type WithBaseElementEmits<T extends ObjectEmitsOptions> = T & BaseElementEmits

export type AuBankAccountElementProps = WithBaseElementProps<{
  options?: stripeJs.StripeAuBankAccountElementOptions
}>

export type AuBankAccountElementEmits = WithBaseElementEmits<{
  change: (event: stripeJs.StripeAuBankAccountElementChangeEvent) => void
  ready: (element: stripeJs.StripeAuBankAccountElement) => void
  escape: () => void
}>

export type CardElementProps = WithBaseElementProps<{
  options?: stripeJs.StripeCardElementOptions
}>

export type CardElementEmits = WithBaseElementEmits<{
  change: (event: stripeJs.StripeCardElementChangeEvent) => void
  ready: (element: stripeJs.StripeCardElement) => void
  escape: () => void
  networkschange: (event: { elementType: 'card' }) => void
  loaderror: (event: { elementType: 'card', error: stripeJs.StripeError }) => void
}>

export type CardNumberElementProps = WithBaseElementProps<{
  options?: stripeJs.StripeCardNumberElementOptions
}>

export type CardNumberElementEmits = WithBaseElementEmits<{
  change: (event: stripeJs.StripeCardNumberElementChangeEvent) => void
  ready: (element: stripeJs.StripeCardNumberElement) => void
  escape: () => void
  networkschange: (event: { elementType: 'cardNumber' }) => void
  loaderror: (event: { elementType: 'cardNumber', error: stripeJs.StripeError }) => void
}>

export type CardExpiryElementProps = WithBaseElementProps<{
  options?: stripeJs.StripeCardExpiryElementOptions
}>

export type CardExpiryElementEmits = WithBaseElementEmits<{
  change: (event: stripeJs.StripeCardExpiryElementChangeEvent) => void
  ready: (element: stripeJs.StripeCardExpiryElement) => void
  escape: () => void
}>

export type CardCvcElementProps = WithBaseElementProps<{
  options?: stripeJs.StripeCardCvcElementOptions
}>

export type CardCvcElementEmits = WithBaseElementEmits<{
  change: (event: stripeJs.StripeCardCvcElementChangeEvent) => void
  ready: (element: stripeJs.StripeCardCvcElement) => void
  escape: () => void
}>

export type FpxBankElementProps = WithBaseElementProps<{
  options?: stripeJs.StripeFpxBankElementOptions
}>

export type FpxBankElementEmits = WithBaseElementEmits<{
  change: (event: stripeJs.StripeFpxBankElementChangeEvent) => void
  ready: (element: stripeJs.StripeFpxBankElement) => void
  escape: () => void
}>

export type IbanElementProps = WithBaseElementProps<{
  options?: stripeJs.StripeIbanElementOptions
}>

export type IbanElementEmits = WithBaseElementEmits<{
  change: (event: stripeJs.StripeIbanElementChangeEvent) => void
  ready: (element: stripeJs.StripeIbanElement) => void
  escape: () => void
}>

export type IdealBankElementProps = WithBaseElementProps<{
  options?: stripeJs.StripeIdealBankElementOptions
}>

export type IdealBankElementEmits = WithBaseElementEmits<{
  change: (event: stripeJs.StripeIdealBankElementChangeEvent) => void
  ready: (element: stripeJs.StripeIdealBankElement) => void
  escape: () => void
}>

export type P24BankElementProps = WithBaseElementProps<{
  options?: stripeJs.StripeP24BankElementOptions
}>

export type P24BankElementEmits = WithBaseElementEmits<{
  change: (event: stripeJs.StripeP24BankElementChangeEvent) => void
  ready: (element: stripeJs.StripeP24BankElement) => void
  escape: () => void
}>

export type LinkAuthenticationElementProps = WithBaseElementProps<{
  options?: stripeJs.StripeLinkAuthenticationElementOptions
}>

export type LinkAuthenticationElementEmits = WithBaseElementEmits<{
  change: (event: stripeJs.StripeLinkAuthenticationElementChangeEvent) => void
  ready: (element: stripeJs.StripeLinkAuthenticationElement) => void
  escape: () => void
  loaderror: (event: { elementType: 'linkAuthentication', error: stripeJs.StripeError }) => void
  loaderstart: (event: { elementType: 'linkAuthentication' }) => void
}>

export type EpsBankElementProps = WithBaseElementProps<{
  options?: stripeJs.StripeEpsBankElementOptions
}>

export type EpsBankElementEmits = WithBaseElementEmits<{
  change: (event: stripeJs.StripeEpsBankElementChangeEvent) => void
  ready: (element: stripeJs.StripeEpsBankElement) => void
  escape: () => void
}>

export type PaymentElementProps = WithBaseElementProps<{
  options?: stripeJs.StripePaymentElementOptions
}>

export type PaymentElementEmits = WithBaseElementEmits<{
  change: (event: stripeJs.StripePaymentElementChangeEvent) => void
  ready: (element: stripeJs.StripePaymentElement) => void
  escape: () => void
  loaderror: (event: { elementType: 'payment', error: stripeJs.StripeError }) => void
  /**
   * Triggered when the [loader](https://stripe.com/docs/js/elements_object/create#stripe_elements-options-loader) UI is mounted to the DOM and ready to be displayed.
   */
  loaderstart: (event: { elementType: 'payment' }) => void
}>

export type ExpressCheckoutElementProps = WithBaseElementProps<{
  options?: stripeJs.StripeExpressCheckoutElementOptions
}>

export type ExpressCheckoutElementEmits = WithBaseElementEmits<{
  ready: (event: stripeJs.StripeExpressCheckoutElementReadyEvent) => void
  escape: () => void
  loaderror: (event: { elementType: 'expressCheckout', error: stripeJs.StripeError }) => void
  click: (event: stripeJs.StripeExpressCheckoutElementClickEvent) => void
  confirm: (event: stripeJs.StripeExpressCheckoutElementConfirmEvent) => void
  cancel: (event: { elementType: 'expressCheckout' }) => void
  shippingaddresschange: (event: stripeJs.StripeExpressCheckoutElementShippingAddressChangeEvent) => void
  shippingratechange: (event: stripeJs.StripeExpressCheckoutElementShippingRateChangeEvent) => void
}>

export type CurrencySelectorElementProps = BaseElementProps

export type CurrencySelectorElementEmits = WithBaseElementEmits<{
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
}>

export type PaymentRequestButtonElementProps = WithBaseElementProps<{
  options?: stripeJs.StripePaymentRequestButtonElementOptions
}>

export type PaymentRequestButtonElementEmits = WithBaseElementEmits<{
  click: (event: stripeJs.StripePaymentRequestButtonElementClickEvent) => void
  ready: (element: stripeJs.StripePaymentRequestButtonElement) => void
}>

export type AddressElementProps = WithBaseElementProps<{
  options: stripeJs.StripeAddressElementOptions
}>

export type AddressElementEmits = WithBaseElementEmits<{
  change: (event: stripeJs.StripeAddressElementChangeEvent) => void
  ready: (element: stripeJs.StripeAddressElement) => void
  escape: () => void
  loaderror: (event: { elementType: 'address', error: stripeJs.StripeError }) => void
  loaderstart: (event: { elementType: 'address' }) => void
}>

export type PaymentMethodMessagingElementProps = WithBaseElementProps<{
  options?: stripeJs.StripePaymentMethodMessagingElementOptions
}>

export type PaymentMethodMessagingElementEmits = WithBaseElementEmits<{
  ready: (element: stripeJs.StripePaymentMethodMessagingElement) => void
}>

export type AffirmMessageElementProps = WithBaseElementProps<{
  options?: stripeJs.StripeAffirmMessageElementOptions
}>

export type AffirmMessageElementEmits = WithBaseElementEmits<{
  ready: (element: stripeJs.StripeAffirmMessageElement) => void
}>

export type AfterpayClearpayMessageElementProps = WithBaseElementProps<{
  options?: stripeJs.StripeAfterpayClearpayMessageElementOptions
}>

export type AfterpayClearpayMessageElementEmits = WithBaseElementEmits<{
  ready: (element: stripeJs.StripeAfterpayClearpayMessageElement) => void
}>

export type TaxIdElementProps = WithBaseElementProps<{
  /**
   * An object containing Element configuration options.
   */
  options?: stripeJs.StripeTaxIdElementOptions
}>

export type TaxIdElementEmits = WithBaseElementEmits<{
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
}>

export type UnknownOptions = { [k: string]: unknown }
