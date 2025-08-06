<script setup lang="ts">
import { PaymentElement, useElements, useStripe } from 'stripe-vue'

const stripe = useStripe()
const elements = useElements()

const errorMessage = ref<string | null>(null)

async function handleSubmit() {
  if (elements.value === null) {
    return
  }

  // Trigger form validation and wallet collection
  const { error: submitError } = await elements.value.submit()
  if (submitError) {
    // Show error to your customer
    errorMessage.value = submitError.message!
    return
  }

  // Create the PaymentIntent and obtain clientSecret from your server endpoint
  const { client_secret: clientSecret } = await $fetch('/api/create-intent', {
    method: 'POST',
    body: {
      amount: 1099,
      currency: 'usd',
    },
  })

  const { error } = await stripe.value!.confirmPayment({
    // `Elements` instance that was used to create the Payment Element
    elements: elements.value,
    clientSecret: clientSecret!,
    confirmParams: {
      return_url: 'https://example.com/order/123/complete',
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
  }
}

function loaderStart() {
  console.log('hello')
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <button type="submit" :disabled="!stripe || !elements">
      Pay
    </button>
    <PaymentElement @loaderstart="loaderStart" />
    <div v-if="errorMessage">
      {{ errorMessage }}
    </div>
  </form>
</template>
