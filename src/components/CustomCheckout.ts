import type * as stripeJs from "@stripe/stripe-js";
import { computed, defineComponent, inject, onMounted, provide, ref, watchEffect } from "vue";
import { CustomCheckoutKey } from "../keys";

export const CustomCheckoutProvider = defineComponent((props: {
  stripe: stripeJs.Stripe | null
  options: stripeJs.StripeCustomCheckoutOptions
}, { slots }) => {
  const customCheckoutSdk = ref<stripeJs.StripeCustomCheckout | null>(null)
  const session = ref<stripeJs.StripeCustomCheckoutSession | null>(null)

  watchEffect(() => {
    if (props.stripe) {
      props.stripe.initCustomCheckout(props.options).then((value) => {
        if (customCheckoutSdk) {
          customCheckoutSdk.value = value
          customCheckoutSdk.value.on('change', (value) => {
            session.value = value
          });
        }
      })
    }
  })

  const customCheckoutContextValue = computed(() => extractCustomCheckoutContextValue(customCheckoutSdk.value, session.value))

  provide(CustomCheckoutKey, customCheckoutContextValue)

  return () => slots.default?.()
}, {
  props: ['stripe', 'options']
})

type StripeCustomCheckoutActions = Omit<
  Omit<stripeJs.StripeCustomCheckout, 'session'>,
  'on'
>;

export interface CustomCheckoutContextValue
  extends StripeCustomCheckoutActions,
    stripeJs.StripeCustomCheckoutSession {}

const extractCustomCheckoutContextValue = (
  customCheckoutSdk: stripeJs.StripeCustomCheckout | null,
  sessionState: stripeJs.StripeCustomCheckoutSession | null
): CustomCheckoutContextValue | null => {
  if (!customCheckoutSdk) {
    return null;
  }

  const {on: _on, session: _session, ...actions} = customCheckoutSdk;
  if (!sessionState) {
    return {...actions, ...customCheckoutSdk.session()};
  }

  return {...actions, ...sessionState};
}

export function useCustomCheckout() {
  const customCheckout = inject(CustomCheckoutKey);

  if (!customCheckout) {
    throw new Error(
      'Could not find CustomCheckout Context; You need to wrap the part of your app that calls useCustomCheckout() in an <CustomCheckoutProvider> provider.'
    );
  }

  return customCheckout
}
