import { readonly } from 'vue'
import { useElementsOrCheckoutContextWithUseCase } from '../checkout/components/CheckoutContext'

/**
 * The useStripe composable returns a reference to the [Stripe](https://docs.stripe.com/js/initializing)
 * instance passed to the Elements, CheckoutElementsProvider, or CheckoutFormProvider.
 */
export function useStripe() {
  const { stripe } = useElementsOrCheckoutContextWithUseCase('calls useStripe()')
  return readonly(stripe)
}
