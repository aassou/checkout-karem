import { loadStripe } from '@stripe/stripe-js';

// Make sure to replace this with your actual public key from Stripe
const stripePromise = loadStripe("********");

export default stripePromise;