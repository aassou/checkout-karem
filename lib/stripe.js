import { loadStripe } from '@stripe/stripe-js';

// Make sure to replace this with your actual public key from Stripe
const stripePromise = loadStripe("pk_test_51PbwTd2LZ12I9JYYcx8AcOkRpmmZyze4G2AXDTCkBP4V3XxDnoffgvSuGDURk4NI4bhvJtlFb4TbxU6GDf5tevhv00Z9d5wJHx");

export default stripePromise;