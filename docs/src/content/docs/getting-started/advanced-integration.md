---
title: Advanced Integration
description: Learn about Vue components for Stripe.js and Stripe Elements.
---

Learn about Vue components for Stripe.js and Stripe Elements.

## Installation

```bash
npm install vue-stripe @stripe/stripe-js
```

## Elements provider

The `Elements` provider allows you to use [Element components](https://docs.stripe.com/sdks/stripejs-react?ui=elements#element-components) and access the [Stripe object](https://docs.stripe.com/js/initializing) in any nested component. Render an `Elements` provider at the root of your Vue app so that it is available everywhere you need it.

```vue
<script setup>
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from 'vue-stripe'

const stripePromise = loadStripe('pk_test_xxx')

const options = {
  // passing the client secret obtained from the server
  clientSecret: '{{CLIENT_SECRET}}',
}
</script>

<template>
  <Elements :stripe="stripePromise" :options>
    <CheckoutForm />
  </Elements>
</template>
```

| Prop    | Description                                                    |
|---------|----------------------------------------------------------------|
| `stripe`  | A [Stripe object](https://docs.stripe.com/js/initializing) or a `Promise` resolving to a Stripe object.<br><br>Can initially be `null` for SSR apps.     |
| `options` | Optional Elements configuration options. [See available options](https://docs.stripe.com/js/elements_object/create#stripe_elements-options). |

## Elements components

Element components provide a flexible way to securely collect payment information in your Vue app.

```vue [CheckoutForm.vue]
<script setup>
import { PaymentElement } from 'vue-stripe'
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
| `id`      | Passes through to the [Element’s container](https://docs.stripe.com/js/element/the_element_container).                                                                                                                      |
| `class`   | Passes through to the [Element’s container](https://docs.stripe.com/js/element/the_element_container).                                                                                                                      |
| `options` | An object containing Element configuration options. [See available options](https://docs.stripe.com/js/elements_object/create_payment_element#payment_element_create-options) for the Payment Element or [available options](https://docs.stripe.com/js/elements_object/create_element?type=card#elements_create-options) for individual payment method Elements. |

| Event       | Description                                                                                   |
|-------------|-----------------------------------------------------------------------------------------------|
| `@blur`        | Triggered when the Element loses focus.                                                       |
| `@change`      | Triggered when data exposed by this Element is changed (for example, when there is an error).                                                       |
| `@click`        | Triggered by the `<PaymentRequestButtonElement>` when it is clicked.                                                       |
| `@escape`      | Triggered when the escape key is pressed within an Element.                                   |
| `@focus`       | Triggered when the Element receives focus.                                                    |
| `@loadererror` | Triggered when the Element fails to load.<br><br>You only receive these events from the `payment`, `linkAuthentication`, `address`, and `expressCheckout` Elements.                                                     |
| `@loaderstart` | Triggered when the [loader](https://docs.stripe.com/js/elements_object/create#stripe_elements-options-loader) UI is mounted to the DOM and ready to be displayed.<br><br>You only receive these events from the `payment`, `linkAuthentication`, `address`, and `expressCheckout` Elements.                  |
| `@ready`       | Triggered when the Element is fully rendered and can accept imperative `element.focus()` calls. |

### Available Element components

There are many different kinds of Elements, useful for collecting different kinds of payment information. These are the available Elements today.

| Component                      | Usage                                                                                                                                                                      |
|--------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `AddressElement`                 | Collects address details for 236+ regional formats. See the [Address Element docs](https://docs.stripe.com/elements/address-element/collect-addresses?platform=web&client=react).                                                                                          |
| `AfterpayClearpayMessageElement` | Displays installments messaging for Afterpay payments.                                                                                                                     |
| `AuBankAccountElement`           | Collects Australian bank account information (BSB and account number) for use with BECS Direct Debit payments.                                                             |
| `CardCvcElement`                 | Collects the card‘s CVC number.                                                                                                                                            |
| `CardElement`                    | A flexible single-line input that collects all necessary card details.                                                                                                     |
| `CardExpiryElement`              | Collects the card‘s expiration date.                                                                                                                                       |
| `CardNumberElement`              | Collects the card number.                                                                                                                                                  |
| `ExpressCheckoutElement`         | Allows you to accept card or wallet payments through one or more payment buttons, including Apple Pay, Google Pay, Link, or PayPal. See the [Express Checkout Element](https://docs.stripe.com/elements/express-checkout-element) docs. |
| `IbanElement`                    | The International Bank Account Number (IBAN). Available for SEPA countries.                                                                                                |
| `LinkAuthenticationElement`      | Collects email addresses and allows users to log in to Link. See the Link Authentication Element docs.                                                                     |
| `PaymentElement`                 | Collects payment details for [25+ payment methods](https://docs.stripe.com/payments/payment-methods/integration-options) from around the globe. See the [Payment Element](https://docs.stripe.com/payments/accept-a-payment?platform=web&ui=elements&client=react) docs.                                                                      |
| `PaymentRequestButtonElement`    | An all-in-one checkout button backed by either Apple Pay or the Payment Request API. See the [Payment Request Button](https://docs.stripe.com/stripe-js/elements/payment-request-button) docs.                                                  |

## useElements composable

`useElements(): Readonly<Ref<Elements | null>>`{lang="ts-type"}

To safely pass the payment information collected by the Payment Element to the Stripe API, access the `Elements` instance so that you can use it with [`stripe.confirmPayment`](https://docs.stripe.com/js/payment_intents/confirm_payment).

```vue [CheckoutForm.vue]
<script setup>
import { PaymentElement, useElements, useStripe } from 'vue-stripe'

const stripe = useStripe()
const elements = useElements()

async function handleSubmit() {
  if (!stripe.value || !elements.value) {
    // Stripe.js hasn't yet loaded.
    // Make sure to disable form submission until Stripe.js has loaded.
    return
  }

  const result = await stripe.value.confirmPayment({
    // `Elements` instance that was used to create the Payment Element
    elements: elements.value,
    confirmParams: {
      return_url: 'https://example.com/order/123/complete',
    },
  })

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

## useStripe composable

`useStripe(): Readonly<Ref<Stripe | null>>`{lang="ts-type"}

The `useStripe` composable returns a reference to the [Stripe](https://docs.stripe.com/js/initializing) instance passed to the [Elements](#elements-provider) provider.

```vue [CheckoutForm.vue]
<script setup>
import { PaymentElement, useElements, useStripe } from 'vue-stripe'

const stripe = useStripe()
const elements = useElements()

async function handleSubmit() {
  if (!stripe.value || !elements.value) {
    // Stripe.js hasn't yet loaded.
    // Make sure to disable form submission until Stripe.js has loaded.
    return
  }

  const result = await stripe.value.confirmPayment({
    // `Elements` instance that was used to create the Payment Element
    elements: elements.value,
    confirmParams: {
      return_url: 'https://example.com/order/123/complete',
    },
  })

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
