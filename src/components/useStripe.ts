import { useElementsOrCheckoutContextWithUseCase } from '../checkout/components/CheckoutProvider'

/**
 * The useStripe composable returns a reference to the [Stripe](https://docs.stripe.com/js/initializing)
 * instance passed to the Elements provider.
 */
export function useStripe() {
  const { stripe } = useElementsOrCheckoutContextWithUseCase('calls useStripe()')
  return stripe
}
