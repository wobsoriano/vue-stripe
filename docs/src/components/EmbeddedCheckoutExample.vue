<script setup lang="ts">
import { loadStripe } from '@stripe/stripe-js'
import { onMounted, ref } from 'vue'
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from 'vue-stripe'

const stripePromise = loadStripe(import.meta.env.PUBLIC_STRIPE_PUBLIC_KEY as string)

const clientSecret = ref<string>('')

onMounted(async () => {
  const resp = await fetch('/api/embedded-checkout')
  const data = await resp.json() as { clientSecret: string }
  clientSecret.value = data.clientSecret
})
</script>

<template>
  <EmbeddedCheckoutProvider :stripe="stripePromise" :options="{ clientSecret }">
    <EmbeddedCheckout />
  </EmbeddedCheckoutProvider>
</template>
