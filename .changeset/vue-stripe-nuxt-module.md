---
"vue-stripe": minor
---

Add an optional Nuxt 4 module at `vue-stripe/nuxt`.

- Auto-imports every component and composable from `vue-stripe` and `vue-stripe/checkout`. Checkout components are registered under a `Checkout` prefix because seven names collide between the two entry points, and one of them, `ShippingAddressElement`, genuinely differs in behavior between the two.
- `useServerStripe(event)` is auto-imported in `server/` and lazily constructs a cached Stripe Node client from the private runtime config.
- `@nuxt/kit` and `stripe` are optional peer dependencies, so client-only projects install neither.
- The module does not load Stripe.js and does not manage SSR safety for you. Call `loadStripe` yourself, the same way you would with `@stripe/react-stripe-js`, and pass the resolved instance to the components.

Configure with the `stripe` key in `nuxt.config` (`publishableKey`, `secretKey`, `apiVersion`, `server.enabled`, `server.options`, `components`, `composables`), or through `NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and `NUXT_STRIPE_SECRET_KEY`.
