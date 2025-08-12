<script setup lang="ts">
import { loadStripe } from '@stripe/stripe-js'
import { onMounted, ref } from 'vue'
import { Elements } from 'vue-stripe'
import ExpressCheckoutForm from './ExpressCheckoutForm.vue'

const stripePromise = loadStripe(import.meta.env.PUBLIC_STRIPE_PUBLIC_KEY as string)

const clientSecret = ref<string>('')

onMounted(async () => {
  const resp = await fetch('/api/payment-element/payment-intent')
  const data = await resp.json() as { clientSecret: string }
  clientSecret.value = data.clientSecret
})
</script>

<template>
  <Elements v-if="clientSecret" :stripe="stripePromise" :options="{ clientSecret }">
    <ExpressCheckoutForm />
  </Elements>
</template>
