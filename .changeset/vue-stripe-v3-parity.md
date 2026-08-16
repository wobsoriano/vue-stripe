---
"vue-stripe": major
---

Sync with `@stripe/react-stripe-js@6.8.1` and upgrade to `@stripe/stripe-js` v9.

**Breaking changes**

- The `@stripe/stripe-js` peer dependency is now `>=9.5.0 <10.0.0`. Stripe.js v9 removed
  `stripe.initCheckout()`, so this upgrade is required rather than optional.
- `CheckoutProvider` is removed. Use `CheckoutElementsProvider` for the Elements based
  checkout flow, or `CheckoutFormProvider` for the form based flow.
- `PaymentFormElement` is removed from the root entry point. Use `CheckoutForm` from
  `vue-stripe/checkout` instead. Its `elementType` is now reported as `checkoutForm`.
- `useCheckout()` still works under both providers and still returns the Elements shaped
  result, but is deprecated. Prefer `useCheckoutElements()` or `useCheckoutForm()`.

**New**

- `CheckoutElementsProvider`, `CheckoutFormProvider`, `useCheckoutElements`, `useCheckoutForm`.
- Root elements `CurrencySelectorElement`, `ContactDetailsElement`, `ShippingAddressElement`,
  `TermsElement`, and the five Issuing card display elements.
- Checkout elements `CheckoutForm`, `ContactDetailsElement`, `TermsElement`.
- Elements now emit `availablepaymentmethodschange`.

**Fixed**

- The checkout form element called `createPaymentFormElement`, which Stripe.js v9 renamed
  to `createForm`. It now calls the correct method.
- Embedded Checkout called `initEmbeddedCheckout`, which Stripe.js v9 renamed to
  `createEmbeddedCheckoutPage`. It now calls the correct method. This was silently broken
  on v9 until now.
