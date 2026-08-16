import {
  addComponent,
  addImports,
  addServerImportsDir,
  createResolver,
  defineNuxtModule,
} from '@nuxt/kit'

export interface ModuleOptions {
  /**
   * Your Stripe publishable key. Exposed to the client through
   * `runtimeConfig.public.stripe.publishableKey`.
   */
  publishableKey?: string
  /**
   * Your Stripe secret key. Kept on the private runtime config branch and
   * never sent to the client.
   */
  secretKey?: string
  /**
   * Stripe API version passed to the server-side Stripe Node client.
   */
  apiVersion?: string
  server?: {
    enabled?: boolean
    options?: Record<string, unknown>
  }
  components?: boolean | { prefix?: string }
  composables?: boolean
}

const ROOT_COMPONENTS = [
  'Elements',
  'EmbeddedCheckout',
  'EmbeddedCheckoutProvider',
  'FinancialAccountDisclosure',
  'IssuingDisclosure',
  'AddressElement',
  'AuBankAccountElement',
  'CardCvcElement',
  'CardElement',
  'CardExpiryElement',
  'CardNumberElement',
  'ContactDetailsElement',
  'CurrencySelectorElement',
  'ExpressCheckoutElement',
  'IbanElement',
  'IssuingCardCopyButtonElement',
  'IssuingCardCvcDisplayElement',
  'IssuingCardExpiryDisplayElement',
  'IssuingCardNumberDisplayElement',
  'IssuingCardPinDisplayElement',
  'LinkAuthenticationElement',
  'PaymentElement',
  'PaymentMethodMessagingElement',
  'PaymentRequestButtonElement',
  'ShippingAddressElement',
  'TaxIdElement',
  'TermsElement',
]

/**
 * Tuples of [export name in vue-stripe/checkout, registered component name].
 * Seven of these collide with root exports, and ShippingAddressElement differs
 * at runtime between the two entry points, so all of them take a Checkout prefix.
 */
const CHECKOUT_COMPONENTS: Array<[string, string]> = [
  ['CheckoutElementsProvider', 'CheckoutElementsProvider'],
  ['CheckoutFormProvider', 'CheckoutFormProvider'],
  ['CheckoutForm', 'CheckoutForm'],
  ['BillingAddressElement', 'CheckoutBillingAddressElement'],
  ['ContactDetailsElement', 'CheckoutContactDetailsElement'],
  ['CurrencySelectorElement', 'CheckoutCurrencySelectorElement'],
  ['ExpressCheckoutElement', 'CheckoutExpressCheckoutElement'],
  ['PaymentElement', 'CheckoutPaymentElement'],
  ['ShippingAddressElement', 'CheckoutShippingAddressElement'],
  ['TaxIdElement', 'CheckoutTaxIdElement'],
  ['TermsElement', 'CheckoutTermsElement'],
]

const ROOT_COMPOSABLES = ['useStripe', 'useElements']
const CHECKOUT_COMPOSABLES = ['useCheckout', 'useCheckoutElements', 'useCheckoutForm']

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'vue-stripe',
    configKey: 'stripe',
    compatibility: {
      nuxt: '>=4.0.0',
    },
  },
  defaults: {
    server: { enabled: true },
    components: true,
    composables: true,
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    const serverEnabled = options.server?.enabled !== false

    const publicConfig = nuxt.options.runtimeConfig.public as Record<string, unknown>
    publicConfig.stripe = {
      publishableKey: options.publishableKey ?? '',
      ...(publicConfig.stripe as Record<string, unknown> | undefined),
    }

    const privateConfig = nuxt.options.runtimeConfig as Record<string, unknown>
    privateConfig.stripe = {
      secretKey: options.secretKey ?? '',
      apiVersion: options.apiVersion ?? '',
      options: options.server?.options ?? {},
      ...(privateConfig.stripe as Record<string, unknown> | undefined),
    }

    if (!options.publishableKey) {
      console.warn(
        '[vue-stripe] No publishable key configured. Set `stripe.publishableKey` in nuxt.config or provide NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY at runtime.',
      )
    }

    const componentsEnabled = options.components !== false
    const prefix = typeof options.components === 'object' ? options.components.prefix ?? '' : ''

    if (componentsEnabled) {
      for (const name of ROOT_COMPONENTS) {
        addComponent({
          name: `${prefix}${name}`,
          export: name,
          filePath: 'vue-stripe',
        })
      }

      for (const [exportName, componentName] of CHECKOUT_COMPONENTS) {
        addComponent({
          name: `${prefix}${componentName}`,
          export: exportName,
          filePath: 'vue-stripe/checkout',
        })
      }
    }

    if (options.composables !== false) {
      addImports(ROOT_COMPOSABLES.map(name => ({ name, from: 'vue-stripe' })))
      addImports(CHECKOUT_COMPOSABLES.map(name => ({ name, from: 'vue-stripe/checkout' })))
    }

    if (serverEnabled) {
      addServerImportsDir(resolver.resolve('./runtime/server/utils'))
    }
  },
})
