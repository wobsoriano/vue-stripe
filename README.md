# vue-stripe

Vue components for [Stripe.js and Elements](https://stripe.com/docs/stripe-js) with full TypeScript support.

> [!NOTE]
> The aim of this module is to have [`@stripe/react-stripe-js`](https://github.com/stripe/react-stripe-js) for Vue with feature parity. You should be able to follow the [React docs](https://stripe.com/docs/stripe-js/react) and examples using this module.

## Getting started

- [Add Vue Stripe.js to your Vue app](https://www.vue-stripe.com/getting-started/embedded-components/#installation)
- [Try it out using CodeSandbox](https://codesandbox.io/p/devbox/vue-stripe-demo-nds3jv)

## Installation

```bash
npm install vue-stripe @stripe/stripe-js
```

## Minimal example

An example `CheckoutForm` component:

```vue
<script setup>
import {
  PaymentElement,
  useElements,
  useStripe,
} from 'vue-stripe'

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

  const { error } = await stripe.value.confirmPayment({
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
import { Elements } from 'vue-stripe'
import CheckoutForm from './CheckoutForm.vue'

const stripe = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx')

const options = {
  mode: 'payment',
  amount: 1099,
  currency: 'usd',
  // Fully customizable with appearance API.
  appearance: {
    /* ... */
  },
}
</script>

<template>
  <Elements :stripe="stripe" :options="options">
    <CheckoutForm />
  </Elements>
</template>
```

To listen for events, use the `@eventname` directive:

```vue
<PaymentElement @loaderstart="onLoaderStart">
```

## Acknowledgements

This project builds upon the foundation laid by several Vue Stripe integration libraries:

- [vue-stripe](https://github.com/matfish2/vue-stripe) - Vue.js 2 Stripe checkout component. Special thanks to [@matfish2](https://github.com/matfish2) for graciously transferring the `vue-stripe` package name to enable this project.
- [vuestripe.com](https://vuestripe.com) - Stripe Checkout & Elements for Vue.js (verified partner of Stripe)
- [vue-stripe-js](https://www.npmjs.com/package/vue-stripe-js) - Vue 3 components for Stripe

While these libraries provide valuable solutions, this project aims to deliver a comprehensive 1:1 equivalent to the [React Stripe SDK](https://github.com/stripe/react-stripe-js) with complete tests.

## License

MIT
