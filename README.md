# stripe-vue

Vue components for [Stripe.js and Elements](https://stripe.com/docs/stripe-js) with full TypeScript support.

> [!NOTE]
> The aim of this module is to have [`@stripe/react-stripe-js`](https://github.com/stripe/react-stripe-js) for Vue with feature parity. You should be able to follow the [React docs](https://stripe.com/docs/stripe-js/react) and examples using this module.

## Features

- All [Stripe Web Elements](https://docs.stripe.com/payments/elements) components
- [Custom Checkout](https://docs.stripe.com/checkout/custom-checkout/overview) with the [`<CustomCheckoutProvider>`](https://docs.stripe.com/js/custom_checkout/react/custom_checkout_provider) component and [`useCustomCheckout()`](https://docs.stripe.com/js/custom_checkout/react/use_custom_checkout) composable.
- [Embedded Checkout](https://docs.stripe.com/checkout/embedded/quickstart) with the [`<EmbeddedCheckoutProvider>`](https://docs.stripe.com/checkout/embedded/quickstart?client=react) and `<EmbeddedCheckout>` components.

## Installation

```bash
npm install stripe-vue @stripe/stripe-js
```

## Minimal example

An example `CheckoutForm` component:

```vue
<script setup>
import {
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
import { Elements } from 'stripe-vue'
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

Do this

```vue
<PaymentElement @loaderstart="onLoaderStart">
```

Don't do this

```vue
<PaymentElement :onLoaderStart="onLoaderStart">
```

## Acknowledgements

This project builds upon the foundation laid by several Vue Stripe integration libraries:

- [vuestripe.com](https://vuestripe.com) - Vue 2 Stripe solution
- [vue-stripe-js](https://www.npmjs.com/package/vue-stripe-js) - Vue 3 components for Stripe

While these libraries provide valuable solutions, this project aims to deliver a comprehensive 1:1 equivalent to the [React Stripe SDK](https://github.com/stripe/react-stripe-js).

## License

MIT
