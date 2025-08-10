<script setup lang="ts">
import { ExpressCheckoutElement, useElements, useStripe } from 'stripe-vue'

const stripe = useStripe()
const elements = useElements()

const errorMessage = ref<string | null>(null)
const router = useRouter()

async function confirm() {
  if (!stripe.value || !elements.value) {
    return
  }

  // Trigger form validation and wallet collection
  const { error: submitError } = await elements.value.submit()
  if (submitError) {
    // Show error to your customer
    errorMessage.value = submitError.message!
    return
  }

  const { error } = await stripe.value.confirmPayment({
    elements: elements.value,
    confirmParams: {
      return_url: 'http://localhost:3000/success'
    }
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
    router.push('/success')
  }
}
</script>

<template>
  <div v-if="errorMessage">
    {{ errorMessage }}
  </div>
  <ExpressCheckoutElement @confirm="confirm" />
</template>
