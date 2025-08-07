<script setup lang="ts">
import { loadStripe, type StripeElementsOptions } from '@stripe/stripe-js'
import { Elements } from 'stripe-vue'

const runtimeConfig = useRuntimeConfig()

const stripePromise = loadStripe(runtimeConfig.public.stripePublicKey)

const options: StripeElementsOptions = {
  mode: 'payment',
  amount: 1099,
  currency: 'usd',
  appearance: {},
}
</script>

<template>
  <Elements :stripe="stripePromise" :options>
    <CheckoutForm />
  </Elements>
</template>
