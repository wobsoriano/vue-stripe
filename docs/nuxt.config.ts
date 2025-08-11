// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  imports: {
    autoImport: true,
  },
  runtimeConfig: {
    public: {
      // eslint-disable-next-line node/prefer-global/process
      stripePublicKey: process.env.NUXT_PUBLIC_STRIPE_PUBLIC_KEY,
    },
    // eslint-disable-next-line node/prefer-global/process
    stripeSecretKey: process.env.NUXT_STRIPE_SECRET_KEY,
  },
})
