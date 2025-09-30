---
"vue-stripe": major
---

Splits EwCS specific imports into its own `/checkout` path.

For Elements with Checkout Sessions integrations and only Elements with Checkout Sessions integrations, these elements should now be imported via `'vue-stripe/checkout'`:

- CurrencySelectorElement
- PaymentElement
- ExpressCheckoutElement
- TaxIdElement
- BillingAddressElement
- ShippingAddressElement

`useCheckout` and `CheckoutProvider` are also under this new path
