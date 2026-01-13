// Stripe configuration - commented out for future use
// import Stripe from 'stripe';

// if (!process.env.STRIPE_SECRET_KEY) {
//   throw new Error('STRIPE_SECRET_KEY environment variable is not set');
// }

// export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
//   apiVersion: '2023-10-16',
//   typescript: true,
// });

// Temporary stub to prevent import errors
export const stripe = null as any;
