# vue-stripe

Vue components for [Stripe.js and Elements](https://stripe.com/docs/stripe-js) with full TypeScript support.

> [!NOTE]
> The aim of this module is to have [`@stripe/react-stripe-js`](https://github.com/stripe/react-stripe-js) for Vue with feature parity. You should be able to follow the [React docs](https://stripe.com/docs/stripe-js/react) and examples using this module. **Only use this library if you want parity with the React Stripe.js SDK.** Otherwise, consider using the [Stripe Partner Vue SDK](https://vuestripe.com).

## Getting started

- [Build a custom checkout page using the Checkout Sessions API](https://docs.stripe.com/payments/accept-a-payment?payment-ui=elements&api-integration=checkout)
- [Add Vue Stripe.js to your Vue app](https://vue-stripe.dev/getting-started/installation)
- [Try it out using CodeSandbox](https://codesandbox.io/p/devbox/vue-stripe-demo-nds3jv)

## Installation

```bash
npm install vue-stripe @stripe/stripe-js
```

> [!IMPORTANT]
> Vue Stripe requires `@stripe/stripe-js` v9.16 or newer, below v10. Upgrading
> from v2? See the [migration guide](https://vue-stripe.dev/migration/v2-to-v3).

## Build a custom checkout page

For a new custom checkout page, we recommend the
[Checkout Sessions API](https://docs.stripe.com/payments/accept-a-payment?payment-ui=elements&api-integration=checkout)
with `ui_mode: 'elements'`. You place Stripe Elements in your own Vue layout,
and the Checkout Session manages the checkout state. The lower-level
[Payment Intents API](https://docs.stripe.com/payments/accept-a-payment?payment-ui=elements&api-integration=payment-intents)
gives you control over every part of your checkout. It also takes much more code
to build and maintain. For a Payment Intents example in Vue, see the
[Payment Element docs](https://vue-stripe.dev/core-concepts/payment-element).

Create a Checkout Session on your server from trusted product and pricing data.
Then return its client secret.

```js
const session = await stripe.checkout.sessions.create({
  ui_mode: 'elements',
  mode: 'payment',
  return_url: 'https://example.com/order/123/complete',
  line_items: [
    {
      price_data: {
        currency: 'usd',
        product_data: { name: 'T-shirt' },
        unit_amount: 1099,
      },
      quantity: 1,
    },
  ],
})

if (!session.client_secret) {
  throw new Error('Checkout Session is missing a client secret.')
}

res.json({ clientSecret: session.client_secret })
```

On the client, import from `vue-stripe/checkout`. `useCheckoutElements()`
returns a computed ref holding a `loading`, `success`, or `error` result.

`CheckoutForm.vue`

```vue
<script setup>
import { ref } from 'vue'
import { PaymentElement, useCheckoutElements } from 'vue-stripe/checkout'

const result = useCheckoutElements()
const errorMessage = ref(null)
const isSubmitting = ref(false)

async function handleSubmit() {
  if (result.value.type !== 'success' || !result.value.checkout.canConfirm) {
    return
  }

  isSubmitting.value = true
  errorMessage.value = null

  try {
    const confirmResult = await result.value.checkout.confirm({
      returnUrl: 'https://example.com/order/123/complete',
    })

    if (confirmResult.type === 'error') {
      errorMessage.value = confirmResult.error.message
    }
  }
  catch (error) {
    errorMessage.value = error instanceof Error
      ? error.message
      : 'An unexpected error occurred.'
  }
  finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div v-if="result.type === 'loading'">
    Loading checkout...
  </div>
  <div v-else-if="result.type === 'error'">
    {{ result.error.message }}
  </div>
  <template v-else>
    <ul>
      <li v-for="lineItem in result.checkout.lineItems" :key="lineItem.id">
        {{ lineItem.name }}: {{ lineItem.total.amount }}
      </li>
    </ul>
    <p>Total: {{ result.checkout.total.total.amount }}</p>
    <form @submit.prevent="handleSubmit">
      <PaymentElement />
      <button type="submit" :disabled="!result.checkout.canConfirm || isSubmitting">
        {{ isSubmitting ? 'Processing...' : 'Pay' }}
      </button>
      <div v-if="errorMessage">
        {{ errorMessage }}
      </div>
    </form>
  </template>
</template>
```

`App.vue`

```vue
<script setup>
import { loadStripe } from '@stripe/stripe-js'
import { CheckoutElementsProvider } from 'vue-stripe/checkout'
import CheckoutForm from './CheckoutForm.vue'

const stripePromise = loadStripe('pk_test_...')

const clientSecretPromise = fetch('/create-checkout-session', {
  method: 'POST',
}).then(async (response) => {
  const body = await response.json()

  if (!response.ok) {
    throw new Error(body.error ?? 'Unable to create a Checkout Session.')
  }

  return body.clientSecret
})

const options = {
  clientSecret: clientSecretPromise,
  elementsOptions: {
    appearance: {
      theme: 'stripe',
    },
  },
}
</script>

<template>
  <CheckoutElementsProvider :stripe="stripePromise" :options="options">
    <CheckoutForm />
  </CheckoutElementsProvider>
</template>
```

## Acknowledgements

This project builds upon the foundation laid by several Vue Stripe integration libraries:

- [vue-stripe](https://github.com/matfish2/vue-stripe) - Vue.js 2 Stripe checkout component. Special thanks to [@matfish2](https://github.com/matfish2) for graciously transferring the `vue-stripe` package name to enable this project.
- [vuestripe.com](https://vuestripe.com) - Stripe Checkout & Elements for Vue.js (Stripe Verified Partner)
- [vue-stripe-js](https://github.com/ectoflow/vue-stripe-js) - Vue 3 components for Stripe

While these libraries provide valuable solutions, this project aims to deliver a comprehensive 1:1 equivalent to the [React Stripe SDK](https://github.com/stripe/react-stripe-js) with complete tests.

## License

MIT
