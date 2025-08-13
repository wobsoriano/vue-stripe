# stripe-vue

## 1.0.2

### Patch Changes

- 74cd421: Add stripe and elements values to slot content

  ```vue
  <script setup>
  import { loadStripe } from "@stripe/stripe-js";
  import { Elements } from "vue-stripe";
  import CheckoutForm from "./CheckoutForm.vue";

  const stripe = loadStripe("pk_xxx");

  const options = {};
  </script>

  <template>
    <Elements :stripe="stripe" :options="{}" v-slot="slotProps">
      <CheckoutForm v-bind="slotProps" />
    </Elements>
  </template>
  ```

## 1.0.1

### Patch Changes

- d8b4512: Fix package info

## 1.0.0

### Major Changes

- 05f4431: Rename package to `vue-stripe`

  This major release marks the transition to the `vue-stripe` package name, graciously transferred by [@matfish2](https://github.com/matfish2), the original maintainer of the [Vue 2 vue-stripe](https://github.com/matfish2/vue-stripe) library. This project aims to deliver a comprehensive 1:1 equivalent to the [React Stripe SDK](https://github.com/stripe/react-stripe-js) with complete tests.

## 0.4.1

### Patch Changes

- a62290a: Fix element option types

## 0.4.0

### Minor Changes

- 35a34d5: Stripe 7 support

## 0.3.5

### Patch Changes

- 5dd55fd: Emit raw element
- 4cb7927: Fix `getElement` types

## 0.3.4

### Patch Changes

- 046f4be: Fix missing \_\_elementType

## 0.3.3

### Patch Changes

- 872a4a0: Add unit tests for Elements component

## 0.3.2

### Patch Changes

- 3966bf0: Fix undefined destructure props

## 0.3.1

### Patch Changes

- 3ed6f5a: Improve prop updates

## 0.3.0

### Minor Changes

- ce23cd0: Add embedded checkout
- 5944686: Remove deprecated `ShippingAddressElement` component

## 0.2.4

### Patch Changes

- 1e58790: Add acknowledgments section

## 0.2.3

### Patch Changes

- a671fe5: Add current features to README
- 7b31290: Remove rendered slot in element component

## 0.2.2

### Patch Changes

- f0c383d: Fix custom checkout and elements contextx

## 0.2.1

### Patch Changes

- 274b22d: Fix incorrect checkout sdk value check

## 0.2.0

### Minor Changes

- 407c228: Add CustomCheckoutProvider

## 0.1.3

### Patch Changes

- 4ab08f9: Update readme

## 0.1.2

### Patch Changes

- 27efada: Package info updates

## 0.1.1

### Patch Changes

- dcd2d3b: Add event usage

## 0.1.0

### Minor Changes

- 91f9df9: Initial publish
