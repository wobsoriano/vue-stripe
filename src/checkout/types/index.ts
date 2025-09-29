import type * as stripeJs from '@stripe/stripe-js'
import type { StripeError } from '@stripe/stripe-js'
import type { BaseElementProps, ExpressCheckoutElementProps as RootExpressCheckoutElementProps } from '../../types'

export type CurrencySelectorElementProps = BaseElementProps

export type ExpressCheckoutElementProps = Omit<
  RootExpressCheckoutElementProps,
  | 'options'
  // | 'onClick'
  // | 'onCancel'
  // | 'onShippingAddressChange'
  // | 'onShippingRateChange'
> & { options?: stripeJs.StripeCheckoutExpressCheckoutElementOptions }

export interface TaxIdElementProps extends BaseElementProps {
  options: stripeJs.StripeTaxIdElementOptions
  onChange?: (event: stripeJs.StripeTaxIdElementChangeEvent) => any
  onReady?: (element: stripeJs.StripeTaxIdElement) => any
  onEscape?: () => any
  onLoadError?: (event: { elementType: 'taxId', error: StripeError }) => any
  onLoaderStart?: (event: { elementType: 'taxId' }) => any
}
