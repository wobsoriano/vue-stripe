<script setup lang="ts">
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from 'stripe-vue'

const runtimeConfig = useRuntimeConfig()

const stripePromise = loadStripe(runtimeConfig.public.stripePublicKey)

const { data } = await useFetch('/api/payment-element/payment-intent')
</script>

<template>
  <Elements :stripe="stripePromise" :options="{ clientSecret: data?.clientSecret! }">
    <PaymentElementCheckoutForm />
  </Elements>
</template>
