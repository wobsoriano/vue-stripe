<script setup lang="ts">
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from 'vue-stripe'
import CreditCardForm from './CreditCardForm.vue'

const stripePromise = loadStripe(import.meta.env.PUBLIC_STRIPE_PUBLIC_KEY as string)
</script>

<template>
  <Elements :stripe="stripePromise">
    <CreditCardForm />
  </Elements>
</template>
