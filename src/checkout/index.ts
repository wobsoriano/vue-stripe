import type * as stripeJs from '@stripe/stripe-js'
import type { ExpressCheckoutElementEmits, PaymentElementEmits, PaymentElementProps as RootPaymentElementProps, TaxIdElementEmits } from '../types'
import type { ExpressCheckoutElementProps, TaxIdElementProps } from './types'
import { createElementComponent } from '../components/createElementComponent'

export {
  CheckoutProvider,
  useCheckout,
} from './components/CheckoutProvider'

export const PaymentElement = createElementComponent<Omit<RootPaymentElementProps, 'options'> & {
  options?: stripeJs.StripeCheckoutPaymentElementOptions
}, PaymentElementEmits>('payment')

/**
 * @docs https://www.vue-stripe.com/getting-started/embedded-components/#elements-components
 */
export const ExpressCheckoutElement = createElementComponent<ExpressCheckoutElementProps, ExpressCheckoutElementEmits>('expressCheckout')

export const TaxIdElement = createElementComponent<TaxIdElementProps, TaxIdElementEmits>('taxId')
