// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  runtimeConfig: {
    public: {
      // eslint-disable-next-line node/prefer-global/process
      stripePublicKey: process.env.NUXT_PUBLIC_STRIPE_PUBLIC_KEY,
    },
  },
})
