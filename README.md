# stripe-vue

Vue components for [Stripe.js and Elements](https://stripe.com/docs/stripe-js).

> [!NOTE]
> The aim of this module is to have `@stripe/react-stripe-js` for vue with feature parity. You should be able to follow the react docs and examples using this module.

## Installation

```bash
npm install stripe-vue @stripe/stripe-js
```

## Usage

An example `CheckoutForm` component:

```vue
<script setup>
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from 'stripe-vue'

const stripe = useStripe()
const elements = useElements()

const errorMessage = ref(null)

async function handleSubmit() {
  if (elements.value === null) {
    return
  }

  // Trigger form validation and wallet collection
  const { error: submitError } = await elements.value.submit()
  if (submitError) {
    // Show error to your customer
    errorMessage.value = submitError.message
    return
  }

  // Create the PaymentIntent and obtain clientSecret from your server endpoint
  const res = await fetch('/create-intent', {
    method: 'POST',
  })
  const { client_secret: clientSecret } = await res.json()

  const { error } = await stripe.confirmPayment({
    // `Elements` instance that was used to create the Payment Element
    elements: elements.value,
    clientSecret,
    confirmParams: {
      return_url: 'https://example.com/order/123/complete',
    },
  })

  if (error) {
    // This point will only be reached if there is an immediate error when
    // confirming the payment. Show error to your customer (for example, payment
    // details incomplete)
    errorMessage.value = error.message
  }
  else {
    // Your customer will be redirected to your `return_url`. For some payment
    // methods like iDEAL, your customer will be redirected to an intermediate
    // site first to authorize the payment, then redirected to the `return_url`.
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <PaymentElement />
    <button type="submit" :disabled="!stripe || !elements">
      Pay
    </button>
    <div v-if="errorMessage">
      {{ errorMessage }}
    </div>
  </form>
</template>
```

```vue
<script setup>
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from 'stripe-vue'
import CheckoutForm from './CheckoutForm.vue'

const stripe = ref(null)

onMount(async () => {
  stripe.value = await loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx')
})
</script>

<template>
  <Elements :stripe="stripe">
    <CheckoutForm />
  </Elements>
</template>
```

## License

MIT
