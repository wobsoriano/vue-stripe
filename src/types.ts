import type * as stripeJs from '@stripe/stripe-js'

export interface ElementProps {
  id?: string
  class?: string
}

export interface BaseElementEmits {
  (e: 'blur', event: { elementType: stripeJs.StripeElementType }): void
  (e: 'focus', event: { elementType: stripeJs.StripeElementType }): void
}

export interface AuBankAccountElementProps extends ElementProps {
  options?: stripeJs.StripeAuBankAccountElementOptions
}

export interface AuBankAccountElementEmits extends BaseElementEmits {
  (e: 'change', event: stripeJs.StripeAuBankAccountElementChangeEvent): void
  (e: 'ready', element: stripeJs.StripeAuBankAccountElement): void
  (e: 'escape'): void
}

export interface CardElementProps extends ElementProps {
  options?: stripeJs.StripeCardElementOptions
}

export interface CardElementEmits extends BaseElementEmits {
  (e: 'change', event: stripeJs.StripeCardElementChangeEvent): void
  (e: 'ready', element: stripeJs.StripeCardElement): void
  (e: 'escape'): void
  (e: 'networkschange', event: { elementType: 'card' }): void
  (e: 'loaderror', event: { elementType: 'card', error: stripeJs.StripeError }): void
}

export interface CardNumberElementProps extends ElementProps {
  options?: stripeJs.StripeCardNumberElementOptions
}

export interface CardNumberElementEmits extends BaseElementEmits {
  (e: 'change', event: stripeJs.StripeCardNumberElementChangeEvent): void
  (e: 'ready', element: stripeJs.StripeCardNumberElement): void
  (e: 'escape'): void
  (e: 'networkschange', event: { elementType: 'cardNumber' }): void
  (e: 'loaderror', event: { elementType: 'cardNumber', error: stripeJs.StripeError }): void
}

export interface CardExpiryElementProps extends ElementProps {
  options?: stripeJs.StripeCardExpiryElementOptions
}

export interface CardExpiryElementEmits extends BaseElementEmits {
  (e: 'change', event: stripeJs.StripeCardExpiryElementChangeEvent): void
  (e: 'ready', element: stripeJs.StripeCardExpiryElement): void
  (e: 'escape'): void
}

export interface CardCvcElementProps extends ElementProps {
  options?: stripeJs.StripeCardCvcElementOptions
}

export interface CardCvcElementEmits extends BaseElementEmits {
  (e: 'change', event: stripeJs.StripeCardCvcElementChangeEvent): void
  (e: 'ready', element: stripeJs.StripeCardCvcElement): void
  (e: 'escape'): void
}

export interface FpxBankElementProps extends ElementProps {
  options?: stripeJs.StripeFpxBankElementOptions
}

export interface FpxBankElementEmits extends BaseElementEmits {
  (e: 'change', event: stripeJs.StripeFpxBankElementChangeEvent): void
  (e: 'ready', element: stripeJs.StripeFpxBankElement): void
  (e: 'escape'): void
}

export interface IbanElementProps extends ElementProps {
  options?: stripeJs.StripeIbanElementOptions
}

export interface IbanElementEmits extends BaseElementEmits {
  (e: 'change', event: stripeJs.StripeIbanElementChangeEvent): void
  (e: 'ready', element: stripeJs.StripeIbanElement): void
  (e: 'escape'): void
}

export interface IdealBankElementProps extends ElementProps {
  options?: stripeJs.StripeIdealBankElementOptions
}

export interface IdealBankElementEmits extends BaseElementEmits {
  (e: 'change', event: stripeJs.StripeIdealBankElementChangeEvent): void
  (e: 'ready', element: stripeJs.StripeIdealBankElement): void
  (e: 'escape'): void
}

export interface P24BankElementProps extends ElementProps {
  options?: stripeJs.StripeP24BankElementOptions
}

export interface P24BankElementEmits extends BaseElementEmits {
  (e: 'change', event: stripeJs.StripeP24BankElementChangeEvent): void
  (e: 'ready', element: stripeJs.StripeP24BankElement): void
  (e: 'escape'): void
}

export interface LinkAuthenticationElementProps extends ElementProps {
  options?: stripeJs.StripeLinkAuthenticationElementOptions
}

export interface LinkAuthenticationElementEmits extends BaseElementEmits {
  (e: 'change', event: stripeJs.StripeLinkAuthenticationElementChangeEvent): void
  (e: 'ready', element: stripeJs.StripeLinkAuthenticationElement): void
  (e: 'escape'): void
  (e: 'loaderror', event: { elementType: 'linkAuthentication', error: stripeJs.StripeError }): void
  (e: 'loaderstart', event: { elementType: 'linkAuthentication' }): void
}

export interface EpsBankElementProps extends ElementProps {
  options?: stripeJs.StripeEpsBankElementOptions
}

export interface EpsBankElementEmits extends BaseElementEmits {
  (e: 'change', event: stripeJs.StripeEpsBankElementChangeEvent): void
  (e: 'ready', element: stripeJs.StripeEpsBankElement): void
  (e: 'escape'): void
}

export interface PaymentElementProps extends ElementProps {
  options?: stripeJs.StripePaymentElementOptions
}

export interface PaymentElementEmits extends BaseElementEmits {
  (e: 'change', event: stripeJs.StripePaymentElementChangeEvent): void
  (e: 'ready', element: stripeJs.StripePaymentElement): void
  (e: 'escape'): void
  (e: 'loaderror', event: { elementType: 'payment', error: stripeJs.StripeError }): void
  /**
   * Triggered when the [loader](https://stripe.com/docs/js/elements_object/create#stripe_elements-options-loader) UI is mounted to the DOM and ready to be displayed.
   */
  (e: 'loaderstart', event: { elementType: 'payment' }): void
}

export interface ExpressCheckoutElementProps extends ElementProps {
  options?: stripeJs.StripeExpressCheckoutElementOptions
}

export interface ExpressCheckoutElementEmits extends BaseElementEmits {
  (e: 'ready', event: stripeJs.StripeExpressCheckoutElementReadyEvent): void
  (e: 'escape'): void
  (e: 'loaderror', event: { elementType: 'expressCheckout', error: stripeJs.StripeError }): void
  (e: 'click', event: stripeJs.StripeExpressCheckoutElementClickEvent): void
  (e: 'confirm', event: stripeJs.StripeExpressCheckoutElementConfirmEvent): void
  (e: 'cancel', event: { elementType: 'expressCheckout' }): void
  (e: 'shippingaddresschange', event: stripeJs.StripeExpressCheckoutElementShippingAddressChangeEvent): void
  (e: 'shippingratechange', event: stripeJs.StripeExpressCheckoutElementShippingRateChangeEvent): void
}

export interface CurrencySelectorElementProps extends ElementProps {}

export interface CurrencySelectorElementEmits extends BaseElementEmits {
  /**
   * Triggered when the Element is fully rendered and can accept imperative `element.focus()` calls.
   * Called with a reference to the underlying [Element instance](https://stripe.com/docs/js/element).
   */
  (e: 'ready', event: stripeJs.StripeCurrencySelectorElement): void
  /**
   * Triggered when the escape key is pressed within the Element.
   */
  (e: 'escape'): void
  /**
   * Triggered when the Element fails to load.
   */
  (e: 'loaderror', event: { elementType: 'currencySelector', error: stripeJs.StripeError }): void
}

export interface PaymentRequestButtonElementProps extends ElementProps {
  options?: stripeJs.StripePaymentRequestButtonElementOptions
}

export interface PaymentRequestButtonElementEmits extends BaseElementEmits {
  (e: 'click', event: stripeJs.StripePaymentRequestButtonElementClickEvent): void
  (e: 'ready', element: stripeJs.StripePaymentRequestButtonElement): void
}

export interface AddressElementProps extends ElementProps {
  options: stripeJs.StripeAddressElementOptions
}

export interface AddressElementEmits extends BaseElementEmits {
  (e: 'change', event: stripeJs.StripeAddressElementChangeEvent): void
  (e: 'ready', element: stripeJs.StripeAddressElement): void
  (e: 'escape'): void
  (e: 'loaderror', event: { elementType: 'address', error: stripeJs.StripeError }): void
  (e: 'loaderstart', event: { elementType: 'address' }): void
}

export interface PaymentMethodMessagingElementProps extends ElementProps {
  options?: stripeJs.StripePaymentMethodMessagingElementOptions
}

export interface PaymentMethodMessagingElementEmits extends BaseElementEmits {
  (e: 'ready', element: stripeJs.StripePaymentMethodMessagingElement): void
}

export interface AffirmMessageElementProps extends ElementProps {
  options?: stripeJs.StripeAffirmMessageElementOptions
}

export interface AffirmMessageElementEmits extends BaseElementEmits {
  (e: 'ready', element: stripeJs.StripeAffirmMessageElement): void
}

export interface AfterpayClearpayMessageElementProps extends ElementProps {
  options?: stripeJs.StripeAfterpayClearpayMessageElementOptions
}

export interface AfterpayClearpayMessageElementEmits extends BaseElementEmits {
  (e: 'ready', element: stripeJs.StripeAfterpayClearpayMessageElement): void
}

export interface TaxIdElementProps extends ElementProps {
  /**
   * An object containing Element configuration options.
   */
  options?: stripeJs.StripeTaxIdElementOptions
}

export interface TaxIdElementEmits extends BaseElementEmits {
  /**
   * Triggered when data exposed by this Element is changed (e.g., when there is an error).
   */
  (e: 'change', event: stripeJs.StripeTaxIdElementChangeEvent): void
  /**
   * Triggered when the Element is fully rendered and can accept imperative `element.focus()` calls.
   */
  (e: 'ready', element: stripeJs.StripeTaxIdElement): void
  /**
   * Triggered when the escape key is pressed within the Element.
   */
  (e: 'escape'): void
  /**
   * Triggered when the Element fails to load.
   */
  (e: 'loaderror', event: { elementType: 'taxId', error: stripeJs.StripeError }): void
  /**
   * Triggered when the [loader](https://stripe.com/docs/js/elements_object/create#stripe_elements-options-loader) UI is mounted to the DOM and ready to be displayed.
   */
  (e: 'loaderstart', event: { elementType: 'taxId' }): void
}

export interface UnknownOptions { [k: string]: unknown }
