import Stripe from 'stripe'

// eslint-disable-next-line node/prefer-global/process
export const stripe = new Stripe(process.env.NUXT_STRIPE_SECRET_KEY!)
