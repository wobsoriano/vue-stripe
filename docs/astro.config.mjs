import starlight from '@astrojs/starlight'
import vercel from '@astrojs/vercel'
import vue from '@astrojs/vue'

// @ts-check
import { defineConfig } from 'astro/config'

import starlightThemeRapide from 'starlight-theme-rapide'

// https://astro.build/config
export default defineConfig({
  integrations: [starlight({
    plugins: [starlightThemeRapide()],
    title: 'vue-stripe',
    social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
    sidebar: [
      {
        label: 'Getting Started',
        items: [
          { label: 'Introduction', slug: 'getting-started/introduction' },
          { label: 'Embedded Components', slug: 'getting-started/embedded-components' },
          { label: 'Advanced Integration', slug: 'getting-started/advanced-integration' },
        ],
      },
      {
        label: 'Examples',
        items: [
          { label: 'Payment Element', slug: 'examples/payment-element' },
          { label: 'Express Checkout', slug: 'examples/express-checkout' },
          { label: 'Embedded Checkout', slug: 'examples/embedded-checkout' },
          { label: 'Credit Card', slug: 'examples/credit-card' },
        ],
      },
      {
        label: 'Reference',
        autogenerate: { directory: 'reference' },
      },
    ],
  }), vue()],

  adapter: vercel(),
})
