<script setup lang="ts">
import { ref } from 'vue'
import { CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from 'vue-stripe'

const stripe = useStripe()
const elements = useElements()

const errorMessage = ref<string | null>(null)
const name = ref('')

async function createPaymentIntent(): Promise<string> {
  const response = await fetch('/api/credit-card/payment-intent')
  if (!response.ok) {
    throw new Error('Failed to create payment intent')
  }
  const { clientSecret } = await response.json()
  return clientSecret
}

async function handleSubmit() {
  if (!stripe.value || !elements.value) {
    return
  }

  const clientSecret = await createPaymentIntent()

  const cardElement = elements.value.getElement(CardNumberElement)!

  const { error } = await stripe.value.confirmCardPayment(clientSecret, {
    payment_method: {
      card: cardElement,
      billing_details: {
        name: name.value,
      },
    },
  })

  if (error) {
    // This point will only be reached if there is an immediate error when
    // confirming the payment. Show error to your customer (for example, payment
    // details incomplete)
    errorMessage.value = error.message!
  }
  else {
    // Your customer will be redirected to your `return_url`. For some payment
    // methods like iDEAL, your customer will be redirected to an intermediate
    // site first to authorize the payment, then redirected to the `return_url`.
    // router.push('/success')
  }
}
</script>

<template>
  <div v-if="errorMessage">
    {{ errorMessage }}
  </div>
  <form @submit.prevent="handleSubmit">
    <input v-model="name" name="name" placeholder="Your name">
    <CardNumberElement />
    <CardExpiryElement />
    <CardCvcElement />
    <button type="submit">
      Pay
    </button>
  </form>
</template>
