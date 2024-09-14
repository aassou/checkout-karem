"use client";

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import MessageBox from '../../components/MessageBox/MessageBox';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import styles from './CheckoutPage.module.css';
import TipsSection from './TipsSection';

const CheckoutForm = () => {
  const [tableNumber, setTableNumber] = useState(null);
  const [paymentId, setPaymentId] = useState(0);
  const [articles, setArticles] = useState([]);
  const [tip, setTip] = useState(0);
  const [customTip, setCustomTip] = useState('');
  const [amountDue, setAmountDue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedTip, setSelectedTip] = useState(0);
  const webSocketRef = useRef(null);
  const stripe = useStripe();
  const elements = useElements();

  // Fetch articles when component mounts
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND_API_URL + '/order/1/1/1');
        setTableNumber(1);
        setArticles(response.data.items);
        setPaymentId(response.data.id);
        const totalAmount = response.data.items.reduce((sum, article) => sum + article.itemPrice * article.quantity, 0);
        setAmountDue(totalAmount);
        console.log("Fetched articles");
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };
    fetchArticles();
  }, []);

  // Set up WebSocket connection
  useEffect(() => {
    console.log("Setting up WebSocket");
    const socketUrl = process.env.NEXT_PUBLIC_BACKEND_WEBSOCKET_URL;

    webSocketRef.current = new WebSocket(socketUrl);

    webSocketRef.current.onopen = () => {
      console.log('WebSocket connection established');
    };

    webSocketRef.current.onmessage = (event) => {
      console.log('Received from server:', event.data);
    };

    webSocketRef.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    webSocketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.close();
      }
    };
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
  
    // Get the CardElement and ensure it's mounted
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      console.error('CardElement is not mounted.');
      return;
    }
  
    setLoading(true); // Start loading when payment starts
  
    try {
      const paymentResult = await stripe.createToken(cardElement);
  
      if (paymentResult.error) {
        console.error('Payment error:', paymentResult.error.message);
      } else {
        console.log('Payment successful:', paymentResult);
  
        try {
          const response = await axios.post(process.env.NEXT_PUBLIC_BACKEND_API_URL + '/payment/token', {
            paymentDetailsId: paymentId,
            token: paymentResult.token,
          }, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
  
          if (response.status === 200) {
            console.log('Payment processed successfully on backend:', response);
            setPaymentSuccess(true);
          } else {
            console.error('Backend error processing payment:', response.data);
          }
        } catch (backendError) {
          console.error('Error sending token to backend:', backendError);
        }
      }
    } catch (error) {
      console.error('Error creating Stripe token:', error);
    } finally {
      setLoading(false); // Stop loading after request is done
    }
  };

  const handleTipSelection = (tip) => {
    setSelectedTip(tip);
  };

  const totalAmountWithTip = (amountDue + selectedTip).toFixed(2);

  return (
    <div className={styles.container}>
      {/* Show spinner alongside the form, but keep form mounted */}
      {loading && <div className={styles.spinner}>Loading...</div>}
  
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
  
      <TipsSection 
        onSelectTip={handleTipSelection} 
        amountDue={amountDue} 
        webSocketRef={webSocketRef}  
      />
  
      <div className={styles.section}>
        <h3>Payment Details</h3>
        <form onSubmit={handlePayment} className={styles.paymentForm}>
          <div className={styles.cardElementWrapper}>
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '18px',
                    color: '#32325d',
                    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#fa755a',
                    iconColor: '#fa755a',
                  },
                },
              }}
            />
          </div>
          {!paymentSuccess ? (
            <button className={styles.submitButton} type="submit" disabled={!stripe || loading}>
              {loading ? 'Processing...' : 'Pay'}
            </button>
          ) : (
            <MessageBox type="success" message="Payment Successful!" />
          )}
        </form>
      </div>
    </div>
  );
  
};

const CheckoutPage = () => {
  const [stripePromise, setStripePromise] = useState(null);

  useEffect(() => {
    const fetchPublicKey = async () => {
      try {
        const response = await axios.post(process.env.NEXT_PUBLIC_BACKEND_API_URL + '/payment/key');
        const stripe = await loadStripe(response.data);
        setStripePromise(stripe);
      } catch (error) {
        console.log('Error fetching Public Key: ', error);
      }
    };

    fetchPublicKey();
  }, []);

  if (!stripePromise) {
    return <div>Loading payment gateway...</div>;
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default CheckoutPage;
