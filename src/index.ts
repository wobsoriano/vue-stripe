import type * as stripeJs from '@stripe/stripe-js'
import type { ComponentInstance } from 'vue'
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
  ShippingAddressElementEmits,
  ShippingAddressElementProps,
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
export const ShippingAddressElement = createElementComponent<ShippingAddressElementProps, ShippingAddressElementEmits>('shippingAddress')
export const PaymentMethodMessagingElement = createElementComponent<PaymentMethodMessagingElementProps, PaymentMethodMessagingElementEmits>('paymentMethodMessaging')
export const AffirmMessageElement = createElementComponent<AffirmMessageElementProps, AffirmMessageElementEmits>('affirmMessage')
export const AfterpayClearpayMessageElement = createElementComponent<AfterpayClearpayMessageElementProps, AfterpayClearpayMessageElementEmits>('afterpayClearpayMessage')

type AuBankAccountElementComponent = ComponentInstance<typeof AuBankAccountElement>
type CardElementComponent = ComponentInstance<typeof CardElement>
type CardNumberElementComponent = ComponentInstance<typeof CardNumberElement>
type CardExpiryElementComponent = ComponentInstance<typeof CardExpiryElement>
type CardCvcElementComponent = ComponentInstance<typeof CardCvcElement>
type FpxBankElementComponent = ComponentInstance<typeof FpxBankElement>
type IbanElementComponent = ComponentInstance<typeof IbanElement>
type IdealBankElementComponent = ComponentInstance<typeof IdealBankElement>
type P24BankElementComponent = ComponentInstance<typeof P24BankElement>
type EpsBankElementComponent = ComponentInstance<typeof EpsBankElement>
type LinkAuthenticationElementComponent = ComponentInstance<typeof LinkAuthenticationElement>
type PaymentElementComponent = ComponentInstance<typeof PaymentElement>
type ExpressCheckoutElementComponent = ComponentInstance<typeof ExpressCheckoutElement>
type PaymentRequestButtonElementComponent = ComponentInstance<typeof PaymentRequestButtonElement>
type AddressElementComponent = ComponentInstance<typeof AddressElement>
type ShippingAddressElementComponent = ComponentInstance<typeof ShippingAddressElement>
type PaymentMethodMessagingElementComponent = ComponentInstance<typeof PaymentMethodMessagingElement>
type AffirmMessageElementComponent = ComponentInstance<typeof AffirmMessageElement>
type AfterpayClearpayMessageElementComponent = ComponentInstance<typeof AfterpayClearpayMessageElement>

declare module '@stripe/stripe-js' {
  interface StripeElements {
    getElement(component: AuBankAccountElementComponent): stripeJs.StripeAuBankAccountElement | null
    getElement(component: CardElementComponent): stripeJs.StripeCardElement | null
    getElement(component: CardNumberElementComponent): stripeJs.StripeCardNumberElement | null
    getElement(component: CardExpiryElementComponent): stripeJs.StripeCardExpiryElement | null
    getElement(component: CardCvcElementComponent): stripeJs.StripeCardCvcElement | null
    getElement(component: FpxBankElementComponent): stripeJs.StripeFpxBankElement | null
    getElement(component: IbanElementComponent): stripeJs.StripeIbanElement | null
    getElement(component: IdealBankElementComponent): stripeJs.StripeIdealBankElement | null
    getElement(component: P24BankElementComponent): stripeJs.StripeP24BankElement | null
    getElement(component: EpsBankElementComponent): stripeJs.StripeEpsBankElement | null
    getElement(component: LinkAuthenticationElementComponent): stripeJs.StripeLinkAuthenticationElement | null
    getElement(component: PaymentElementComponent): stripeJs.StripePaymentElement | null
    getElement(component: ExpressCheckoutElementComponent): stripeJs.StripeExpressCheckoutElement | null
    getElement(component: PaymentRequestButtonElementComponent): stripeJs.StripePaymentRequestButtonElement | null
    getElement(component: AddressElementComponent): stripeJs.StripeAddressElement | null
    getElement(component: ShippingAddressElementComponent): stripeJs.StripeShippingAddressElement | null
    getElement(component: PaymentMethodMessagingElementComponent): stripeJs.StripePaymentMethodMessagingElement | null
    getElement(component: AffirmMessageElementComponent): stripeJs.StripeAffirmMessageElement | null
    getElement(component: AfterpayClearpayMessageElementComponent): stripeJs.StripeAfterpayClearpayMessageElement | null
  }
}

export {
  CustomCheckoutProvider,
  useCustomCheckout,
} from './components/CustomCheckout'

export {
  Elements,
  useElements,
} from './components/Elements'

export {
  useStripe,
} from './components/useStripe'
