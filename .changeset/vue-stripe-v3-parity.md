---
"vue-stripe": major
---

Sync with `@stripe/react-stripe-js@6.8.1` and upgrade to `@stripe/stripe-js` v9.

**Breaking changes**

- The `@stripe/stripe-js` peer dependency is now `>=9.5.0 <10.0.0`. Stripe.js v9 removed
  `stripe.initCheckout()`, so this upgrade is required rather than optional.
- `CheckoutProvider` is removed. Use `CheckoutElementsProvider` for the Elements based
  checkout flow, or `CheckoutFormProvider` for the form based flow.
- `PaymentFormElement` is removed from both entry points, root and `vue-stripe/checkout`.
  Use `CheckoutForm` from `vue-stripe/checkout` instead. Its `elementType` is now reported
  as `checkoutForm`. The component's internal `__elementType` still reports `'paymentForm'`.
  These are two different axes, `elementType` is the public event field, `__elementType` is
  the internal tag used for `getElement()` lookups, so one does not contradict the other.
- `useCheckout()` still works under both providers and still returns the Elements shaped
  result, but is deprecated. Prefer `useCheckoutElements()` or `useCheckoutForm()`.
- The checkout provider's missing-context error changed. It used to read
  `Could not find CheckoutProvider context; ...`. It now reads `Could not find checkout
  context; You need to wrap the part of your app that ... in a <CheckoutElementsProvider>
  or <CheckoutFormProvider> provider.`
- `createElementComponent`'s error for an unsupported element rendered inside a checkout
  provider changed wording entirely. It now reads `<X> is not supported inside a checkout
  provider. Use an <Elements> provider instead.`

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
