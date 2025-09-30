---
title: Embedded Components
description: Learn about Vue components for Stripe.js and Stripe Elements.
---

Learn about Vue components for Stripe.js and Stripe Elements.

## Installation

```bash
npm install vue-stripe @stripe/stripe-js
```

## Checkout provider

The `Elements` provider allows you to use [Element components](https://docs.stripe.com/sdks/stripejs-react?ui=elements#element-components) and access the [Stripe object](https://docs.stripe.com/js/initializing) in any nested component. Render a `CheckoutProvider` at the root of your Vue app so that it’s available everywhere you need it.

```vue
<script setup>
import { loadStripe } from '@stripe/stripe-js'
import { CheckoutProvider } from 'vue-stripe/checkout'

const stripePromise = loadStripe('pk_test_xxx')

function fetchClientSecret() {
  return fetch('/create-checkout-session', { method: 'POST' })
    .then(response => response.json())
    .then(json => json.checkoutSessionClientSecret)
}
</script>

<template>
  <CheckoutProvider :stripe="stripePromise" :options="{ fetchClientSecret }">
    <CheckoutForm />
  </CheckoutProvider>
</template>
```

| Prop    | Description                                                    |
|---------|----------------------------------------------------------------|
| `stripe`  | A [Stripe object](https://docs.stripe.com/js/initializing) or a `Promise` resolving to a Stripe object.<br><br>Can initially be `null` for SSR apps.     |
| `options` | CheckoutProvider configuration options. [See available options](https://docs.stripe.com/js/custom_checkout/react/checkout_provider#custom_checkout_react_checkout_provider-options). You must provide the `fetchClientSecret` function that returns the client secret of the created Checkout Session. |

## Elements components

Element components provide a flexible way to securely collect payment information in your Vue app.

You can mount individual Element components inside of your `CheckoutProvider` tree. You can only mount one of each type of Element in a single `<CheckoutProvider>`.

```vue [CheckoutForm.vue]
<script setup>
import { PaymentElement } from 'vue-stripe/checkout'
</script>

<template>
  <form>
    <PaymentElement />
    <button>Submit</button>
  </form>
</template>
```

| Prop    | Description                                                                                                                                                    |
|---------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `options` | An object containing Element configuration options. [See available options](https://docs.stripe.com/js/custom_checkout/create_payment_element) for the Payment Element. |

| Event       | Description                                                                                   |
|-------------|-----------------------------------------------------------------------------------------------|
| `@blur`        | Triggered when the Element loses focus.                                                       |
| `@change`      | Triggered when data exposed by this Element is changed (for example, when there is an error).                                                       |
| `@click`        | Triggered by the `<PaymentRequestButtonElement>` when it is clicked.                                                       |
| `@escape`      | Triggered when the escape key is pressed within an Element.                                   |
| `@focus`       | Triggered when the Element receives focus.                                                    |
| `@loadererror` | Triggered when the Element fails to load.<br><br>You only receive these events from the `payment`and `address`  Elements.                                                     |
| `@loaderstart` | Triggered when the [loader](https://docs.stripe.com/js/custom_checkout/init#custom_checkout_init-options-elementsOptions-loader) UI is mounted to the DOM and ready to be displayed.<br><br>You only receive these events from the `payment`and `address`  Elements.                  |
| `@ready`       | Triggered when the Element is fully rendered and can accept imperative `element.focus()` calls. |

### Available Element components

You can use several different kinds of Elements for collecting information on your checkout page. These are the available Elements:

| Component                      | Usage                                                                                                                                                                      |
|--------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `AddressElement`                 | Collects address details for 236+ regional formats. See the [Address Element docs](https://docs.stripe.com/elements/address-element/collect-addresses?platform=web&client=react).                                                                                          |
| `ExpressCheckoutElement`         | Allows you to accept card or wallet payments through one or more payment buttons, including Apple Pay, Google Pay, Link, or PayPal. See the [Express Checkout Element](https://docs.stripe.com/elements/express-checkout-element) docs. |
| `PaymentElement`                 | Collects payment details for [25+ payment methods](https://docs.stripe.com/payments/payment-methods/integration-options) from around the globe. See the [Payment Element](https://docs.stripe.com/payments/accept-a-payment?platform=web&ui=elements&client=react) docs.                                                                      |

## useCheckout composable

`useCheckout(): ComputedRefRef<CheckoutContextValue | null>`{lang="ts-type"}

Use the `useCheckout` composable in your components to get the [Checkout object](https://docs.stripe.com/js/custom_checkout/checkout_object), which contains data from the Checkout Session, and methods to update and confirm the Session.

```vue [CheckoutForm.vue]
<script setup>
import { PaymentElement, useCheckout } from 'vue-stripe/checkout'

const checkout = useCheckout()

async function handleSubmit() {
  const result = await checkout.value.confirm()

  if (result.error) {
    // Show error to your customer (for example, payment details incomplete)
    console.log(result.error.message)
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
    <button :disabled="!stripe">
      Submit
    </button>
  </form>
</template>
```
