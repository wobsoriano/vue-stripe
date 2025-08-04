import { useElementsOrCheckoutSdkContextWithUseCase } from './CheckoutProvider'

/**
 * The useStripe composable returns a reference to the [Stripe](https://docs.stripe.com/js/initializing)
 * instance passed to the Elements provider.
 */
export function useStripe() {
  const { stripe } = useElementsOrCheckoutSdkContextWithUseCase('calls useStripe()')
  return stripe
}
