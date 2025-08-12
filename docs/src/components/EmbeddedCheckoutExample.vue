<script setup lang="ts">
import { loadStripe } from '@stripe/stripe-js'
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from 'vue-stripe'

const stripePromise = loadStripe(import.meta.env.PUBLIC_STRIPE_PUBLIC_KEY as string)

async function fetchClientSecret() {
  const resp = await fetch('/api/embedded-checkout')
  const data = await resp.json() as { clientSecret: string }
  return data.clientSecret
}
</script>

<template>
  <EmbeddedCheckoutProvider :stripe="stripePromise" :options="{ fetchClientSecret }">
    <EmbeddedCheckout />
  </EmbeddedCheckoutProvider>
</template>
