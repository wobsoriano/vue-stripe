import type * as stripeJs from '@stripe/stripe-js'
import type { StripeError } from '@stripe/stripe-js'
import type {
  BaseElementProps,
  ExpressCheckoutElementEmits as RootExpressCheckoutElementEmits,
  ExpressCheckoutElementProps as RootExpressCheckoutElementProps,
  LinkSignupElementEmits as RootLinkSignupElementEmits,
  LinkSignupElementProps as RootLinkSignupElementProps,
  PaymentElementProps as RootPaymentElementProps,
  WithBaseElementEmits,
  WithBaseElementProps,
} from '../../types'

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
  /**
   * Triggered when the [loader](https://stripe.com/docs/js/elements_object/create#stripe_elements-options-loader) UI is mounted to the DOM and ready to be displayed.
   */
  loaderstart: (event: { elementType: 'currencySelector' }) => void
}>

export type ExpressCheckoutElementProps = Omit<
  RootExpressCheckoutElementProps,
  'options'
> & { options?: stripeJs.StripeCheckoutExpressCheckoutElementOptions }

export type ExpressCheckoutElementEmits = Omit<
  RootExpressCheckoutElementEmits,
  'click' | 'cancel' | 'shippingaddresschange' | 'shippingratechange'
>

export interface TaxIdElementProps extends BaseElementProps {
  options: stripeJs.StripeTaxIdElementOptions
}

export type TaxIdElementEmits = WithBaseElementEmits<{
  change: (event: stripeJs.StripeTaxIdElementChangeEvent) => void
  ready: (element: stripeJs.StripeTaxIdElement) => void
  escape: () => void
  loaderror: (event: { elementType: 'taxId', error: StripeError }) => void
  loaderstart: (event: { elementType: 'taxId' }) => void
}>

export interface BillingAddressElementProps extends BaseElementProps {
  options?: stripeJs.StripeCheckoutAddressElementOptions
}

export type BillingAddressElementEmits = WithBaseElementEmits<{
  ready: (element: stripeJs.StripeAddressElement) => void
  escape: () => void
  loaderror: (event: { elementType: 'address', error: StripeError }) => void
  loaderstart?: (event: { elementType: 'address' }) => void
}>

export interface ShippingAddressElementProps extends BaseElementProps {
  options?: stripeJs.StripeCheckoutAddressElementOptions
}

export type ShippingAddressElementEmits = WithBaseElementEmits<{
  ready: (element: stripeJs.StripeAddressElement) => void
  escape: () => void
  loaderror: (event: { elementType: 'address', error: StripeError }) => void
  loaderstart?: (event: { elementType: 'address' }) => void
}>

export type PaymentElementProps = Omit<RootPaymentElementProps, 'options'> & {
  options?: stripeJs.StripeCheckoutPaymentElementOptions
}

export type CheckoutFormProps = WithBaseElementProps<{
  /**
   * An object containing Checkout form configuration options.
   *
   * Requires beta access:
   * Contact [Stripe support](https://support.stripe.com/) for more information.
   */
  options?: stripeJs.StripeCheckoutFormOptions
}>

export type CheckoutFormEmits = WithBaseElementEmits<{
  change: (event: stripeJs.StripeCheckoutFormChangeEvent) => void
  ready: (element: stripeJs.StripeCheckoutForm) => void
  escape: () => void
  loaderror: (event: { elementType: 'checkoutForm', error: stripeJs.StripeError }) => void
  loaderstart: (event: { elementType: 'checkoutForm' }) => void
  confirm: (event: stripeJs.StripeCheckoutFormConfirmEvent) => void
  cancel: (event: { elementType: 'checkoutForm' }) => void
}>

export type ContactDetailsElementProps = WithBaseElementProps<{
  options?: stripeJs.StripeContactDetailsElementOptions
}>

export type ContactDetailsElementEmits = WithBaseElementEmits<{
  change: (event: stripeJs.StripeContactDetailsElementChangeEvent) => void
  ready: (element: stripeJs.StripeContactDetailsElement) => void
  escape: () => void
  loaderror: (event: { elementType: 'contactDetails', error: stripeJs.StripeError }) => void
  loaderstart: (event: { elementType: 'contactDetails' }) => void
}>

export type LinkSignupElementProps = Omit<RootLinkSignupElementProps, 'options'> & {
  options?: stripeJs.StripeCheckoutLinkSignupElementOptions
}

export type LinkSignupElementEmits = RootLinkSignupElementEmits

export type TermsElementProps = WithBaseElementProps<{
  /**
   * Requires beta access:
   * Contact [Stripe support](https://support.stripe.com/) for more information.
   */
  options?: stripeJs.StripeCheckoutTermsElementOptions
}>

export type TermsElementEmits = WithBaseElementEmits<{
  ready: (element: stripeJs.StripeTermsElement) => void
  escape: () => void
  loaderror: (event: { elementType: 'terms', error: stripeJs.StripeError }) => void
  loaderstart: (event: { elementType: 'terms' }) => void
}>
