"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import styles from './CheckoutPage.module.css';
import TipsSection from './TipsSection'; // Import TipsSection

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

const CheckoutForm = () => {
  const [tableNumber, setTableNumber] = useState(null);
  const [articles, setArticles] = useState([]);
  const [tip, setTip] = useState(0);
  const [customTip, setCustomTip] = useState('');
  const [amountDue, setAmountDue] = useState(0);
  
  // const stripe = useStripe();
  // const elements = useElements();

  // const sampleArticles = [
  //   { quantity: 2, name: "Water", price: 4.00 },      // Total for this item: 8 EUR
  //   { quantity: 1, name: "Burger", price: 12.50 },    // Total for this item: 12.50 EUR
  //   { quantity: 3, name: "Fries", price: 3.50 },      // Total for this item: 10.50 EUR
  //   { quantity: 1, name: "Coke", price: 2.50 },       // Total for this item: 2.50 EUR
  //   { quantity: 2, name: "Salad", price: 6.00 }       // Total for this item: 12 EUR
  // ];
  
  // Example of calculating the total amount due
  const totalAmountDue = articles.reduce((total, article) => {
    return total + article.quantity * article.price;
  }, 0);
  
  console.log(`Total Amount Due: ${totalAmountDue} EUR`); // Output: Total Amount Due: 45.5 EUR
  
  
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('https://192.168.178.31:8008/order/1/1/1');
        // setTableNumber(response.data.tableNumber);
        setTableNumber(1);
        setArticles(response.data.items);

        const totalAmount = response.data.items.reduce((sum, article) => sum + article.itemPrice * article.quantity, 0);
        setAmountDue(totalAmount);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, []);

  const handleCustomTip = (e) => {
    setCustomTip(e.target.value);
    setTip(0);
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      console.error('Stripe has not loaded yet.');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    const paymentResult = await stripe.createToken(cardElement);

    if (paymentResult.error) {
      console.error('Payment error:', paymentResult.error.message);
    } else {
      console.log('Payment successful:', paymentResult.token);
      // Send token to backend for processing
    }
  };

  const handleTipSelection = (tip) => {
    setSelectedTip(tip);
  };

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <div className={styles.title}>Table {tableNumber}</div>
        <div className={styles.tableBody}>
          {articles.map((article, index) => (
            <React.Fragment key={index}>
              <div>{article.quantity}x</div>
              <div>{article.itemName}</div>
              <div>{article.itemPrice} EUR</div>
            </React.Fragment>
          ))}
        </div>
        <div className={styles.tableFooter}>Amount Due: {amountDue} EUR</div>
      </div>

      <TipsSection onSelectTip={handleTipSelection} />

      <div className={styles.section}>
        <h3>Payment Details</h3>
        <a href="/paymentsuccess">Pay</a>
        {/* <form onSubmit={handlePayment}>
          <CardElement />
          <button type="submit" disabled={!stripe}>Pay</button>
        </form> */}
      </div>
    </div>
  );
};

const CheckoutPage = () => (
  // <Elements>
    <CheckoutForm />
  // </Elements>
);

export default CheckoutPage;
