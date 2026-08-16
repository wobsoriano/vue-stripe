import { renderToString } from '@vue/server-renderer'
import { describe, expect, it } from 'vitest'
import { createSSRApp, defineComponent, h } from 'vue'
import * as mocks from '../test/mocks'
import { CheckoutFormProvider } from './checkout/components/CheckoutFormProvider'
import { CheckoutForm } from './checkout/index'
import { Elements } from './components/Elements'
import { PaymentElement } from './index'

describe('server rendering', () => {
  it('renders the container while stripe is still loading', async () => {
    const app = createSSRApp(defineComponent({
      setup: () => () => h(Elements, { stripe: null }, () => h(PaymentElement, { id: 'pay' })),
    }))
    const html = await renderToString(app)
    expect(html).toContain('id="pay"')
  })

  it('does not create an element on the server', async () => {
    const stripe: any = mocks.mockStripe()
    const app = createSSRApp(defineComponent({
      setup: () => () => h(Elements, { stripe }, () => h(PaymentElement)),
    }))
    await renderToString(app)
    const elements = stripe.elements.mock.results[0]?.value
    expect(elements?.create).not.toHaveBeenCalled()
  })

  it('still throws when an element is rendered with no provider', async () => {
    const app = createSSRApp(defineComponent({
      setup: () => () => h(PaymentElement),
    }))
    await expect(renderToString(app)).rejects.toThrow(/Could not find Elements context/)
  })

  it('renders a checkout form container inside its provider', async () => {
    const stripe: any = mocks.mockStripe()
    const app = createSSRApp(defineComponent({
      setup: () => () => h(
        CheckoutFormProvider,
        { stripe, options: { clientSecret: 'cs_123' } },
        () => h(CheckoutForm, { id: 'form' }),
      ),
    }))
    const html = await renderToString(app)
    expect(html).toContain('id="form"')
  })
})
