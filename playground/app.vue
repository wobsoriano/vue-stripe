<script setup lang="ts">
import { loadStripe } from '@stripe/stripe-js'

const config = useRuntimeConfig()
const stripe = await loadStripe(config.public.stripe.publishableKey)

const options = {
  mode: 'payment' as const,
  amount: 1099,
  currency: 'usd',
}
</script>

<template>
  <div>
    <p>Stripe loaded: {{ Boolean(stripe) }}</p>
    <Elements :stripe="stripe" :options="options">
      <PaymentElement />
    </Elements>
  </div>
</template>
