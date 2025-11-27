import type * as stripeJs from '@stripe/stripe-js'
import type { PropType } from 'vue'
import { computed, defineComponent, h, ref, shallowRef, watch, watchEffect } from 'vue'
import { parseStripeProp } from '../utils/parseStripeProp'

export const IssuingDisclosure = defineComponent({
  inheritAttrs: false,
  name: 'IssuingDisclosure',
  props: {
    stripe: {
      type: [Object, null] as PropType<PromiseLike<stripeJs.Stripe | null> | stripeJs.Stripe | null>,
      required: true,
    },
    options: {
      type: Object as PropType<{
        issuingProgramID?: string
        publicCardProgramName?: string
        learnMoreLink?: string
      }>,
      required: false,
    },
  },
  emits: ['load', 'error'],
  setup(props, { emit }) {
    const containerRef = ref<HTMLDivElement | null>(null)
    const parsed = computed(() => parseStripeProp(props.stripe))
    const stripeState = shallowRef<stripeJs.Stripe | null>(
      parsed.value.tag === 'sync' ? parsed.value.stripe : null,
    )

    const issuingProgramID = computed(() => props.options?.issuingProgramID)
    const publicCardProgramName = computed(() => props.options?.publicCardProgramName)
    const learnMoreLink = computed(() => props.options?.learnMoreLink)

    // Handle async stripe prop
    watchEffect(() => {
      if (parsed.value.tag === 'async') {
        parsed.value.stripePromise.then((stripePromise: stripeJs.Stripe | null) => {
          if (stripePromise) {
            stripeState.value = stripePromise
          }
        })
      }
      else if (parsed.value.tag === 'sync') {
        stripeState.value = parsed.value.stripe
      }
    })

    // Warn on changes to stripe prop
    watch(() => props.stripe, (_, prevStripe) => {
      if (prevStripe !== null && prevStripe !== props.stripe) {
        console.warn(
          'Unsupported prop change on IssuingDisclosure: You cannot change the `stripe` prop after setting it.',
        )
      }
    })

    // Create disclosure
    watchEffect((onInvalidate) => {
      const createDisclosure = async () => {
        if (!stripeState.value || !containerRef.value) {
          return
        }

        const {
          htmlElement: disclosureContent,
          error,
        } = await (stripeState.value as any).createIssuingDisclosure({
          issuingProgramID: issuingProgramID.value,
          publicCardProgramName: publicCardProgramName.value,
          learnMoreLink: learnMoreLink.value,
        })

        if (error) {
          emit('error', error)
        }
        else if (disclosureContent && containerRef.value) {
          const container = containerRef.value
          container.innerHTML = ''
          container.appendChild(disclosureContent)
          emit('load')
        }
      }

      createDisclosure()

      onInvalidate(() => {
        if (containerRef.value) {
          try {
            containerRef.value.innerHTML = ''
          }
          catch {
            // Do nothing - element may already be removed
          }
        }
      })
    })

    return () => h('div', {
      ref: containerRef,
    })
  },
})
