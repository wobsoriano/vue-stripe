<script setup lang="ts">
import { loadStripe, type Stripe } from '@stripe/stripe-js'
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from 'stripe-vue'

const stripe = ref<Stripe | null>(null)
const clientSecret = ref<string | null>(null)

const runtimeConfig = useRuntimeConfig()

onMounted(async () => {
  stripe.value = await loadStripe(runtimeConfig.public.stripePublicKey)
  clientSecret.value = await $fetch('/api/create-checkout-session', {
    method: 'POST'
  })
})
</script>

<template>
  <EmbeddedCheckoutProvider
    :stripe="stripe"
    :options="{ clientSecret }"
  >
    <EmbeddedCheckout />
  </EmbeddedCheckoutProvider>
</template>
