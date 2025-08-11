<script setup lang="ts">
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from 'stripe-vue'

const runtimeConfig = useRuntimeConfig()

const stripePromise = loadStripe(runtimeConfig.public.stripePublicKey)
</script>

<template>
  <Elements :stripe="stripePromise">
    <CreditCardForm />
  </Elements>
</template>
