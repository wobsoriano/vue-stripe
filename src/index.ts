/* eslint-disable ts/method-signature-style */
import type * as stripeJs from '@stripe/stripe-js'
import type {
  AddressElementEmits,
  AddressElementProps,
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
  ContactDetailsElementEmits,
  ContactDetailsElementProps,
  CurrencySelectorElementEmits,
  CurrencySelectorElementProps,
  ExpressCheckoutElementEmits,
  ExpressCheckoutElementProps,
  IbanElementEmits,
  IbanElementProps,
  IssuingCardCopyButtonElementEmits,
  IssuingCardCopyButtonElementProps,
  IssuingCardCvcDisplayElementEmits,
  IssuingCardCvcDisplayElementProps,
  IssuingCardExpiryDisplayElementEmits,
  IssuingCardExpiryDisplayElementProps,
  IssuingCardNumberDisplayElementEmits,
  IssuingCardNumberDisplayElementProps,
  IssuingCardPinDisplayElementEmits,
  IssuingCardPinDisplayElementProps,
  LinkAuthenticationElementEmits,
  LinkAuthenticationElementProps,
  PaymentElementEmits,
  PaymentElementProps,
  PaymentMethodMessagingElementEmits,
  PaymentMethodMessagingElementProps,
  PaymentRequestButtonElementEmits,
  PaymentRequestButtonElementProps,
  ShippingAddressElementEmits,
  ShippingAddressElementProps,
  TaxIdElementEmits,
  TaxIdElementProps,
  TermsElementEmits,
  TermsElementProps,
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
export const IbanElement = createElementComponent<IbanElementProps, IbanElementEmits>('iban')

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
 * Requires beta access:
 * Contact [Stripe support](https://support.stripe.com/) for more information.
 */
export const TaxIdElement = createElementComponent<TaxIdElementProps, TaxIdElementEmits>('taxId')

/**
 * Requires beta access:
 * Contact [Stripe support](https://support.stripe.com/) for more information.
 */
export const CurrencySelectorElement = createElementComponent<CurrencySelectorElementProps, CurrencySelectorElementEmits>('currencySelector')

export const ContactDetailsElement = createElementComponent<ContactDetailsElementProps, ContactDetailsElementEmits>('contactDetails')

/**
 * @deprecated Use `AddressElement` instead.
 */
export const ShippingAddressElement = createElementComponent<ShippingAddressElementProps, ShippingAddressElementEmits>('shippingAddress')

/**
 * Requires beta access:
 * Contact [Stripe support](https://support.stripe.com/) for more information.
 */
export const TermsElement = createElementComponent<TermsElementProps, TermsElementEmits>('terms')

/**
 * @docs https://stripe.com/docs/issuing/elements
 */
export const IssuingCardNumberDisplayElement = createElementComponent<IssuingCardNumberDisplayElementProps, IssuingCardNumberDisplayElementEmits>('issuingCardNumberDisplay')

/**
 * @docs https://stripe.com/docs/issuing/elements
 */
export const IssuingCardCvcDisplayElement = createElementComponent<IssuingCardCvcDisplayElementProps, IssuingCardCvcDisplayElementEmits>('issuingCardCvcDisplay')

/**
 * @docs https://stripe.com/docs/issuing/elements
 */
export const IssuingCardExpiryDisplayElement = createElementComponent<IssuingCardExpiryDisplayElementProps, IssuingCardExpiryDisplayElementEmits>('issuingCardExpiryDisplay')

/**
 * @docs https://stripe.com/docs/issuing/elements
 */
export const IssuingCardPinDisplayElement = createElementComponent<IssuingCardPinDisplayElementProps, IssuingCardPinDisplayElementEmits>('issuingCardPinDisplay')

/**
 * @docs https://stripe.com/docs/issuing/elements
 */
export const IssuingCardCopyButtonElement = createElementComponent<IssuingCardCopyButtonElementProps, IssuingCardCopyButtonElementEmits>('issuingCardCopyButton')

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
     * Returns the underlying [element instance](https://stripe.com/docs/js/elements_object/create_element?type=card) for the `IbanElement` component in the current [Elements](https://www.vue-stripe.com/getting-started/advanced-integration/#elements-provider) provider tree.
     * Returns `null` if no `IbanElement` is rendered in the current `Elements` provider tree.
     */
    getElement(
      component: typeof IbanElement
    ): stripeJs.StripeIbanElement | null

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
     * Returns the underlying element instance for the `CurrencySelectorElement` component
     * in the current `Elements` provider tree, or `null` if none is rendered.
     */
    getElement(
      component: typeof CurrencySelectorElement
    ): stripeJs.StripeCurrencySelectorElement | null

    /**
     * Returns the underlying element instance for the `ContactDetailsElement` component
     * in the current `Elements` provider tree, or `null` if none is rendered.
     */
    getElement(
      component: typeof ContactDetailsElement
    ): stripeJs.StripeContactDetailsElement | null

    /**
     * Returns the underlying element instance for the `ShippingAddressElement` component
     * in the current `Elements` provider tree, or `null` if none is rendered.
     */
    getElement(
      component: typeof ShippingAddressElement
    ): stripeJs.StripeShippingAddressElement | null

    /**
     * Returns the underlying element instance for the `TermsElement` component
     * in the current `Elements` provider tree, or `null` if none is rendered.
     */
    getElement(
      component: typeof TermsElement
    ): stripeJs.StripeTermsElement | null

    /**
     * Returns the underlying element instance for the `IssuingCardNumberDisplayElement`
     * component in the current `Elements` provider tree, or `null` if none is rendered.
     */
    getElement(
      component: typeof IssuingCardNumberDisplayElement
    ): stripeJs.StripeIssuingCardNumberDisplayElement | null

    /**
     * Returns the underlying element instance for the `IssuingCardCvcDisplayElement`
     * component in the current `Elements` provider tree, or `null` if none is rendered.
     */
    getElement(
      component: typeof IssuingCardCvcDisplayElement
    ): stripeJs.StripeIssuingCardCvcDisplayElement | null

    /**
     * Returns the underlying element instance for the `IssuingCardExpiryDisplayElement`
     * component in the current `Elements` provider tree, or `null` if none is rendered.
     */
    getElement(
      component: typeof IssuingCardExpiryDisplayElement
    ): stripeJs.StripeIssuingCardExpiryDisplayElement | null

    /**
     * Returns the underlying element instance for the `IssuingCardPinDisplayElement`
     * component in the current `Elements` provider tree, or `null` if none is rendered.
     */
    getElement(
      component: typeof IssuingCardPinDisplayElement
    ): stripeJs.StripeIssuingCardPinDisplayElement | null

    /**
     * Returns the underlying element instance for the `IssuingCardCopyButtonElement`
     * component in the current `Elements` provider tree, or `null` if none is rendered.
     */
    getElement(
      component: typeof IssuingCardCopyButtonElement
    ): stripeJs.StripeIssuingCardCopyButtonElement | null
  }
}

export {
  Elements,
  useElements,
} from './components/Elements'
export { EmbeddedCheckout } from './components/EmbeddedCheckout'
export { EmbeddedCheckoutProvider } from './components/EmbeddedCheckoutProvider'
export { FinancialAccountDisclosure } from './components/FinancialAccountDisclosure'
export { IssuingDisclosure } from './components/IssuingDisclosure'
export { useStripe } from './components/useStripe'
export type * from './types'
