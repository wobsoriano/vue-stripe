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
} from './types'
import { createElementComponent } from './components/createElementComponent'

export const AuBankAccountElement = createElementComponent<AuBankAccountElementProps, AuBankAccountElementEmits>('auBankAccount')
export const CardElement = createElementComponent<CardElementProps, CardElementEmits>('card')
export const CardNumberElement = createElementComponent<CardNumberElementProps, CardNumberElementEmits>('cardNumber')
export const CardExpiryElement = createElementComponent<CardExpiryElementProps, CardExpiryElementEmits>('cardExpiry')
export const CardCvcElement = createElementComponent<CardCvcElementProps, CardCvcElementEmits>('cardCvc')
export const FpxBankElement = createElementComponent<FpxBankElementProps, FpxBankElementEmits>('fpxBank')
export const IbanElement = createElementComponent<IbanElementProps, IbanElementEmits>('iban')
export const IdealBankElement = createElementComponent<IdealBankElementProps, IdealBankElementEmits>('idealBank')
export const P24BankElement = createElementComponent<P24BankElementProps, P24BankElementEmits>('p24Bank')
export const EpsBankElement = createElementComponent<EpsBankElementProps, EpsBankElementEmits>('epsBank')
export const LinkAuthenticationElement = createElementComponent<LinkAuthenticationElementProps, LinkAuthenticationElementEmits>('linkAuthentication')
export const PaymentElement = createElementComponent<PaymentElementProps, PaymentElementEmits>('payment')
export const ExpressCheckoutElement = createElementComponent<ExpressCheckoutElementProps, ExpressCheckoutElementEmits>('expressCheckout')
export const PaymentRequestButtonElement = createElementComponent<PaymentRequestButtonElementProps, PaymentRequestButtonElementEmits>('paymentRequestButton')
export const AddressElement = createElementComponent<AddressElementProps, AddressElementEmits>('address')
export const PaymentMethodMessagingElement = createElementComponent<PaymentMethodMessagingElementProps, PaymentMethodMessagingElementEmits>('paymentMethodMessaging')
export const AffirmMessageElement = createElementComponent<AffirmMessageElementProps, AffirmMessageElementEmits>('affirmMessage')
export const AfterpayClearpayMessageElement = createElementComponent<AfterpayClearpayMessageElementProps, AfterpayClearpayMessageElementEmits>('afterpayClearpayMessage')

declare module '@stripe/stripe-js' {
  interface StripeElements {
    getElement(component: typeof AuBankAccountElement): stripeJs.StripeAuBankAccountElement | null
    getElement(component: typeof CardElement): stripeJs.StripeCardElement | null
    getElement(component: typeof CardNumberElement): stripeJs.StripeCardNumberElement | null
    getElement(component: typeof CardExpiryElement): stripeJs.StripeCardExpiryElement | null
    getElement(component: typeof CardCvcElement): stripeJs.StripeCardCvcElement | null
    getElement(component: typeof FpxBankElement): stripeJs.StripeFpxBankElement | null
    getElement(component: typeof IbanElement): stripeJs.StripeIbanElement | null
    getElement(component: typeof IdealBankElement): stripeJs.StripeIdealBankElement | null
    getElement(component: typeof P24BankElement): stripeJs.StripeP24BankElement | null
    getElement(component: typeof EpsBankElement): stripeJs.StripeEpsBankElement | null
    getElement(component: typeof LinkAuthenticationElement): stripeJs.StripeLinkAuthenticationElement | null
    getElement(component: typeof PaymentElement): stripeJs.StripePaymentElement | null
    getElement(component: typeof ExpressCheckoutElement): stripeJs.StripeExpressCheckoutElement | null
    getElement(component: typeof PaymentRequestButtonElement): stripeJs.StripePaymentRequestButtonElement | null
    getElement(component: typeof AddressElement): stripeJs.StripeAddressElement | null
    getElement(component: typeof PaymentMethodMessagingElement): stripeJs.StripePaymentMethodMessagingElement | null
    getElement(component: typeof AffirmMessageElement): stripeJs.StripeAffirmMessageElement | null
    getElement(component: typeof AfterpayClearpayMessageElement): stripeJs.StripeAfterpayClearpayMessageElement | null
  }
}

export { CheckoutProvider, useCheckout } from './components/CheckoutProvider'
export {
  Elements,
  useElements,
} from './components/Elements'
export { EmbeddedCheckout } from './components/EmbeddedCheckout'
export { EmbeddedCheckoutProvider } from './components/EmbeddedCheckoutProvider'
export { useStripe } from './components/useStripe'
