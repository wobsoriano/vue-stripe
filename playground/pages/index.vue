<script setup lang="ts">
import { loadStripe, type Stripe, type StripeElementsOptions } from '@stripe/stripe-js'
import { Elements } from 'stripe-vue'
import CheckoutForm from '~/components/CheckoutForm.vue'

const stripe = ref<Stripe | null>(null)

const runtimeConfig = useRuntimeConfig()

onMounted(async () => {
  stripe.value = await loadStripe(runtimeConfig.public.stripePublicKey)
})

const options: StripeElementsOptions = {
  mode: 'payment',
  amount: 1099,
  currency: 'usd',
  appearance: {},
}
</script>

<template>
  <Elements :stripe="stripe" :options="options">
    <CheckoutForm />
  </Elements>
</template>
