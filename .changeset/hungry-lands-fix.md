---
"vue-stripe": patch
---

Add stripe and elements values to slot content

```vue
<script setup>
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from 'vue-stripe'
import CheckoutForm from './CheckoutForm.vue'

const stripe = loadStripe('pk_xxx')

const options = {}
</script>

<template>
  <Elements :stripe="stripe" :options="{}" v-slot="slotProps">
    <CheckoutForm v-bind="slotProps" />
  </Elements>
</template>
```
