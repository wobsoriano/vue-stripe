/* eslint-disable ts/method-signature-style */
import type * as stripeJs from '@stripe/stripe-js'
import type {
  AddressElementEmits,
  AddressElementProps,
  AffirmMessageElementEmits,
  AffirmMessageElementProps,
  AfterpayClearpayMessageElementEmits,
  AfterpayClearpayMessageElementProps,
  AuBankAccountElementEmits,
  AuBankAccountElementProps,
  CardCvcElementEmits,
  CardCvcElementProps,
  CardElementEmits,
  CardElementProps,
  CardExpiryElementEmits,
  CardExpiryElementProps,
  CardNumberElementEmits,
  CardNumberElementProps,
  CurrencySelectorElementEmits,
  CurrencySelectorElementProps,
  EpsBankElementEmits,
  EpsBankElementProps,
  ExpressCheckoutElementEmits,
  ExpressCheckoutElementProps,
  FpxBankElementEmits,
  FpxBankElementProps,
  IbanElementEmits,
  IbanElementProps,
  IdealBankElementEmits,
  IdealBankElementProps,
  LinkAuthenticationElementEmits,
  LinkAuthenticationElementProps,
  P24BankElementEmits,
  P24BankElementProps,
  PaymentElementEmits,
  PaymentElementProps,
  PaymentMethodMessagingElementEmits,
  PaymentMethodMessagingElementProps,
  PaymentRequestButtonElementEmits,
  PaymentRequestButtonElementProps,
  TaxIdElementEmits,
  TaxIdElementProps,
} from './types'
import { createElementComponent } from './components/createElementComponent'

/**
 * Requires beta access:
 * Contact [Stripe support](https://support.stripe.com/) for more information.
 *
 * @docs https://www.vue-stripe.com/getting-started/embedded-components/#elements-components
 */
export const AuBankAccountElement = createElementComponent<AuBankAccountElementProps, AuBankAccountElementEmits>('auBankAccount')

/**
 * @docs https://www.vue-stripe.com/getting-started/embedded-components/#elements-components
 */
export const CardElement = createElementComponent<CardElementProps, CardElementEmits>('card')

/**
 * @docs https://www.vue-stripe.com/getting-started/embedded-components/#elements-components
 */
export const CardNumberElement = createElementComponent<CardNumberElementProps, CardNumberElementEmits>('cardNumber')

/**
 * @docs https://www.vue-stripe.com/getting-started/embedded-components/#elements-components
 */
export const CardExpiryElement = createElementComponent<CardExpiryElementProps, CardExpiryElementEmits>('cardExpiry')

/**
 * @docs https://www.vue-stripe.com/getting-started/embedded-components/#elements-components
 */
export const CardCvcElement = createElementComponent<CardCvcElementProps, CardCvcElementEmits>('cardCvc')

/**
 * @docs https://www.vue-stripe.com/getting-started/embedded-components/#elements-components
 */
export const FpxBankElement = createElementComponent<FpxBankElementProps, FpxBankElementEmits>('fpxBank')

/**
 * @docs https://www.vue-stripe.com/getting-started/embedded-components/#elements-components
 */
export const IbanElement = createElementComponent<IbanElementProps, IbanElementEmits>('iban')

/**
 * @docs https://www.vue-stripe.com/getting-started/embedded-components/#elements-components
 */
export const IdealBankElement = createElementComponent<IdealBankElementProps, IdealBankElementEmits>('idealBank')

/**
 * @docs https://www.vue-stripe.com/getting-started/embedded-components/#elements-components
 */
export const P24BankElement = createElementComponent<P24BankElementProps, P24BankElementEmits>('p24Bank')

/**
 * @docs https://www.vue-stripe.com/getting-started/embedded-components/#elements-components
 */
export const EpsBankElement = createElementComponent<EpsBankElementProps, EpsBankElementEmits>('epsBank')

/**
 * @docs https://www.vue-stripe.com/getting-started/embedded-components/#elements-components
 */
export const LinkAuthenticationElement = createElementComponent<LinkAuthenticationElementProps, LinkAuthenticationElementEmits>('linkAuthentication')

export const PaymentElement = createElementComponent<PaymentElementProps, PaymentElementEmits>('payment')

/**
 * @docs https://www.vue-stripe.com/getting-started/embedded-components/#elements-components
 */
export const ExpressCheckoutElement = createElementComponent<ExpressCheckoutElementProps, ExpressCheckoutElementEmits>('expressCheckout')

/**
 * Requires beta access:
 * Contact [Stripe support](https://support.stripe.com/) for more information.
 */
export const CurrencySelectorElement = createElementComponent<CurrencySelectorElementProps, CurrencySelectorElementEmits>('currencySelector')

/**
 * @docs https://www.vue-stripe.com/getting-started/embedded-components/#elements-components
 */
export const PaymentRequestButtonElement = createElementComponent<PaymentRequestButtonElementProps, PaymentRequestButtonElementEmits>('paymentRequestButton')

/**
 * @docs https://www.vue-stripe.com/getting-started/embedded-components/#elements-components
 */
export const AddressElement = createElementComponent<AddressElementProps, AddressElementEmits>('address')

/**
 * @docs https://www.vue-stripe.com/getting-started/embedded-components/#elements-components
 */
export const PaymentMethodMessagingElement = createElementComponent<PaymentMethodMessagingElementProps, PaymentMethodMessagingElementEmits>('paymentMethodMessaging')

/**
 * @docs https://www.vue-stripe.com/getting-started/embedded-components/#elements-components
 */
export const AffirmMessageElement = createElementComponent<AffirmMessageElementProps, AffirmMessageElementEmits>('affirmMessage')

/**
 * @docs https://www.vue-stripe.com/getting-started/embedded-components/#elements-components
 */
export const AfterpayClearpayMessageElement = createElementComponent<AfterpayClearpayMessageElementProps, AfterpayClearpayMessageElementEmits>('afterpayClearpayMessage')

/**
 * Requires beta access:
 * Contact [Stripe support](https://support.stripe.com/) for more information.
 */
export const TaxIdElement = createElementComponent<TaxIdElementProps, TaxIdElementEmits>('taxId')

declare module '@stripe/stripe-js' {
  interface StripeElements {
    /**
     * Requires beta access:
     * Contact [Stripe support](https://support.stripe.com/) for more information.
     *
     * Returns the underlying [element instance](https://stripe.com/docs/js/elements_object/create_element?type=auBankAccount) for the `AuBankAccountElement` component in the current [Elements](https://www.vue-stripe.com/getting-started/advanced-integration/#elements-provider) provider tree.
     * Returns `null` if no `AuBankAccountElement` is rendered in the current `Elements` provider tree.
     */
    getElement(
      component: typeof AuBankAccountElement
    ): stripeJs.StripeAuBankAccountElement | null

    /**
     * Returns the underlying [element instance](https://stripe.com/docs/js/elements_object/create_element?type=card) for the `CardElement` component in the current [Elements](https://www.vue-stripe.com/getting-started/advanced-integration/#elements-provider) provider tree.
     * Returns `null` if no `CardElement` is rendered in the current `Elements` provider tree.
     */
    getElement(
      component: typeof CardElement
    ): stripeJs.StripeCardElement | null

    /**
     * Returns the underlying [element instance](https://stripe.com/docs/js/elements_object/create_element?type=card) for the `CardNumberElement` component in the current [Elements](https://www.vue-stripe.com/getting-started/advanced-integration/#elements-provider) provider tree.
     * Returns `null` if no `CardNumberElement` is rendered in the current `Elements` provider tree.
     */
    getElement(
      component: typeof CardNumberElement
    ): stripeJs.StripeCardNumberElement | null

    /**
     * Returns the underlying [element instance](https://stripe.com/docs/js/elements_object/create_element?type=card) for the `CardCvcElement` component in the current [Elements](https://www.vue-stripe.com/getting-started/advanced-integration/#elements-provider) provider tree.
     * Returns `null` if no `CardCvcElement` is rendered in the current `Elements` provider tree.
     */
    getElement(
      component: typeof CardCvcElement
    ): stripeJs.StripeCardCvcElement | null

    /**
     * Returns the underlying [element instance](https://stripe.com/docs/js/elements_object/create_element?type=card) for the `CardExpiryElement` component in the current [Elements](https://www.vue-stripe.com/getting-started/advanced-integration/#elements-provider) provider tree.
     * Returns `null` if no `CardExpiryElement` is rendered in the current `Elements` provider tree.
     */
    getElement(
      component: typeof CardExpiryElement
    ): stripeJs.StripeCardExpiryElement | null

    /**
     * Returns the underlying [element instance](https://stripe.com/docs/js/elements_object/create_element?type=fpxBank) for the `FpxBankElement` component in the current [Elements](https://www.vue-stripe.com/getting-started/advanced-integration/#elements-provider) provider tree.
     * Returns `null` if no `FpxBankElement` is rendered in the current `Elements` provider tree.
     */
    getElement(
      component: typeof FpxBankElement
    ): stripeJs.StripeFpxBankElement | null

    /**
     * Returns the underlying [element instance](https://stripe.com/docs/js/elements_object/create_element?type=card) for the `IbanElement` component in the current [Elements](https://www.vue-stripe.com/getting-started/advanced-integration/#elements-provider) provider tree.
     * Returns `null` if no `IbanElement` is rendered in the current `Elements` provider tree.
     */
    getElement(
      component: typeof IbanElement
    ): stripeJs.StripeIbanElement | null

    /**
     * Returns the underlying [element instance](https://stripe.com/docs/js/elements_object/create_element?type=idealBank) for the `IdealBankElement` component in the current [Elements](https://www.vue-stripe.com/getting-started/advanced-integration/#elements-provider) provider tree.
     * Returns `null` if no `IdealBankElement` is rendered in the current `Elements` provider tree.
     */
    getElement(
      component: typeof IdealBankElement
    ): stripeJs.StripeIdealBankElement | null

    /**
     * Returns the underlying [element instance](https://stripe.com/docs/js/elements_object/create_element?type=p24Bank) for the `P24BankElement` component in the current [Elements](https://www.vue-stripe.com/getting-started/advanced-integration/#elements-provider) provider tree.
     * Returns `null` if no `P24BankElement` is rendered in the current `Elements` provider tree.
     */
    getElement(
      component: typeof P24BankElement
    ): stripeJs.StripeP24BankElement | null

    /**
     * Returns the underlying [element instance](https://stripe.com/docs/js/elements_object/create_element?type=epsBank) for the `EpsBankElement` component in the current [Elements](https://www.vue-stripe.com/getting-started/advanced-integration/#elements-provider) provider tree.
     * Returns `null` if no `EpsBankElement` is rendered in the current `Elements` provider tree.
     */
    getElement(
      component: typeof EpsBankElement
    ): stripeJs.StripeEpsBankElement | null

    /**
     * Returns the underlying [element instance](https://stripe.com/docs/js/elements_object/create_link_authentication_element) for the `LinkAuthenticationElement` component in the current [Elements](https://www.vue-stripe.com/getting-started/advanced-integration/#elements-provider) provider tree.
     * Returns `null` if no `LinkAuthenticationElement` is rendered in the current `Elements` provider tree.
     */
    getElement(
      component: typeof LinkAuthenticationElement
    ): stripeJs.StripeLinkAuthenticationElement | null

    /**
     * Returns the underlying [element instance](https://stripe.com/docs/js/elements_object/create_payment_element) for the `PaymentElement` component in the current [Elements](https://www.vue-stripe.com/getting-started/advanced-integration/#elements-provider) provider tree.
     * Returns `null` if no `PaymentElement` is rendered in the current `Elements` provider tree.
     */
    getElement(
      component: typeof PaymentElement
    ): stripeJs.StripeElement | null

    /**
     * Returns the underlying [element instance](https://stripe.com/docs/js/elements_object/create_express_checkout_element) for the `ExpressCheckoutElement` component in the current [Elements](https://www.vue-stripe.com/getting-started/advanced-integration/#elements-provider) provider tree.
     * Returns `null` if no `ExpressCheckoutElement` is rendered in the current `Elements` provider tree.
     */
    getElement(
      component: typeof ExpressCheckoutElement
    ): stripeJs.StripeElement | null

    /**
     * Returns the underlying [element instance](https://stripe.com/docs/js/elements_object/create_element?type=card) for the `PaymentRequestButtonElement` component in the current [Elements](https://www.vue-stripe.com/getting-started/advanced-integration/#elements-provider) provider tree.
     * Returns `null` if no `PaymentRequestButtonElement` is rendered in the current `Elements` provider tree.
     */
    getElement(
      component: typeof PaymentRequestButtonElement
    ): stripeJs.StripePaymentRequestButtonElement | null

    /**
     * Returns the underlying [element instance](https://stripe.com/docs/js/elements_object/create_address_element) for the `AddressElement` component in the current [Elements](https://www.vue-stripe.com/getting-started/advanced-integration/#elements-provider) provider tree.
     * Returns `null` if no `AddressElement` is rendered in the current `Elements` provider tree.
     */
    getElement(
      component: typeof AddressElement
    ): stripeJs.StripeAddressElement | null

    /**
     * Returns the underlying [element instance](https://stripe.com/docs/js/elements_object/create_element?type=paymentMethodMessaging) for the `PaymentMethodMessagingElement` component in the current [Elements](https://www.vue-stripe.com/getting-started/advanced-integration/#elements-provider) provider tree.
     * Returns `null` if no `PaymentMethodMessagingElement` is rendered in the current `Elements` provider tree.
     */
    getElement(
      component: typeof PaymentMethodMessagingElement
    ): stripeJs.StripePaymentMethodMessagingElement | null

    /**
     * Returns the underlying [element instance](https://stripe.com/docs/js/elements_object/create_element?type=card) for the `AffirmMessageElement` component in the current [Elements](https://www.vue-stripe.com/getting-started/advanced-integration/#elements-provider) provider tree.
     * Returns `null` if no `AffirmMessageElement` is rendered in the current `Elements` provider tree.
     */
    getElement(
      component: typeof AffirmMessageElement
    ): stripeJs.StripeAffirmMessageElement | null

    /**
     * Returns the underlying [element instance](https://stripe.com/docs/js/elements_object/create_element?type=card) for the `AfterpayClearpayMessageElement` component in the current [Elements](https://www.vue-stripe.com/getting-started/advanced-integration/#elements-provider) provider tree.
     * Returns `null` if no `AfterpayClearpayMessageElement` is rendered in the current `Elements` provider tree.
     */
    getElement(
      component: typeof AfterpayClearpayMessageElement
    ): stripeJs.StripeAfterpayClearpayMessageElement | null
  }
}

export {
  Elements,
  useElements,
} from './components/Elements'
export { EmbeddedCheckout } from './components/EmbeddedCheckout'
export { EmbeddedCheckoutProvider } from './components/EmbeddedCheckoutProvider'
export { useStripe } from './components/useStripe'
