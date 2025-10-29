---
"vue-stripe": major
---

Changed the <CheckoutProvider /> to use https://js.stripe.com/clover/stripe.js

The options changed from `fetchClientSecret: () => Promise<string>;` to `clientSecret: string | Promise<string>`