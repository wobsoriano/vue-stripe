<script setup lang="ts">
import { CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from 'stripe-vue'

const stripe = useStripe()
const elements = useElements()

const errorMessage = ref<string | null>(null)
const router = useRouter()
const name = ref('')

const { data, execute: createPaymentIntent } = await useFetch('/api/credit-card/payment-intent', {
  immediate: false,
})

async function handleSubmit() {
  if (!stripe.value || !elements.value) {
    return
  }

  await createPaymentIntent()

  const clientSecret = data.value!.clientSecret!
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
    router.push('/success')
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
