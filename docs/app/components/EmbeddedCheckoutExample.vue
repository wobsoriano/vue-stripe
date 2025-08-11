<script setup lang="ts">
import { loadStripe } from '@stripe/stripe-js'
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from 'stripe-vue'

const runtimeConfig = useRuntimeConfig()

const stripePromise = loadStripe(runtimeConfig.public.stripePublicKey)

const { data } = await useFetch('/api/embedded-checkout')
</script>

<template>
  <EmbeddedCheckoutProvider :stripe="stripePromise" :options="{ clientSecret: data?.clientSecret! }">
    <EmbeddedCheckout />
  </EmbeddedCheckoutProvider>
</template>
