---
"vue-stripe": major
---

Sync with `@stripe/react-stripe-js@6.8.1` and upgrade to `@stripe/stripe-js` v9.

Stripe.js v9 removed `stripe.initCheckout()`, so upgrading is required rather than optional. Full walkthrough in the [migration guide](https://vue-stripe.dev/migration/v2-to-v3).

**Breaking**

- `@stripe/stripe-js` peer is now `>=9.5.0 <10.0.0`.
- `CheckoutProvider` is removed. Use `CheckoutElementsProvider` to build a checkout from individual Elements, or `CheckoutFormProvider` for Stripe's prebuilt form.
- `PaymentFormElement` is removed from both entry points. Use `CheckoutForm` from `vue-stripe/checkout`. Its `elementType` is now `checkoutForm`.
- `CheckoutFormProvider` takes `appearance` and `fonts` at the top level of `options`, where `CheckoutElementsProvider` nests them under `options.elementsOptions`.
- `useCheckout()` is deprecated. It still works under both providers. Prefer `useCheckoutElements()` or `useCheckoutForm()`.
- Two error messages changed wording: the checkout provider's missing-context error, and the error for an unsupported element inside a checkout provider.

**New**

- `CheckoutElementsProvider`, `CheckoutFormProvider`, `useCheckoutElements()`, `useCheckoutForm()`.
- Root elements: `CurrencySelectorElement`, `ContactDetailsElement`, `ShippingAddressElement`, `TermsElement`, and the five Issuing card display elements.
- Checkout elements: `CheckoutForm`, `ContactDetailsElement`, `TermsElement`.
- Elements emit `availablepaymentmethodschange`.
- Prop and emit types are now exported from the root entry point.

**Fixed**

Two Stripe.js v9 renames that silently broke features on v9:

- The checkout form called `createPaymentFormElement`, now `createForm`.
- Embedded Checkout called `initEmbeddedCheckout`, now `createEmbeddedCheckoutPage`.
