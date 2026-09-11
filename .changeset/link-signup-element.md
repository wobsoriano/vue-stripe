---
"vue-stripe": minor
---

Sync with `@stripe/react-stripe-js@6.10.0`.

- Add `LinkSignupElement` to `vue-stripe` and `vue-stripe/checkout`. It requires beta access. The checkout version works only inside `CheckoutElementsProvider` and throws inside `CheckoutFormProvider`.
- Raise the `@stripe/stripe-js` peer range to `>=9.16.0 <10.0.0`. Stripe.js 9.16.0 is the first release with the Link Signup Element types.
