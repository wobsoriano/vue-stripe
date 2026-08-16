<script setup lang="ts">
import { loadStripe } from '@stripe/stripe-js'

const config = useRuntimeConfig()
const stripe = await loadStripe(config.public.stripe.publishableKey)

const options = {
  mode: 'payment' as const,
  amount: 1099,
  currency: 'usd',
}

const checkoutOptions = {
  clientSecret: 'cs_test_placeholder',
}
</script>

<template>
  <div>
    <p>Stripe loaded: {{ Boolean(stripe) }}</p>
    <Elements :stripe="stripe" :options="options">
      <PaymentElement />
      <StripeStatus />
    </Elements>
    <CheckoutElementsProvider :stripe="stripe" :options="checkoutOptions">
      <CheckoutPaymentElement />
    </CheckoutElementsProvider>
  </div>
</template>
