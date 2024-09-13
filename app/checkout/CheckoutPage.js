"use client";

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
// import stripePromise from '../../lib/stripe';
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
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedTip, setSelectedTip] = useState(0);
  const webSocketRef = useRef(null);
  // const stripePromise = null;
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND_API_URL + '/order/1/1/1');
        // setTableNumber(response.data.tableNumber);
        setTableNumber(1);
        setArticles(response.data.items);
        setPaymentId(response.data.id);
        const totalAmount = response.data.items.reduce((sum, article) => sum + article.itemPrice * article.quantity, 0);
        setAmountDue(totalAmount);
        // setAmountDue(response.data.totalAmount);
        console.log("useEffect Fetch");
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, []);

  // Set up WebSocket connection
  useEffect(() => {
    console.log("useEffect Socket");
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

    const cardElement = elements.getElement(CardElement);
    const paymentResult = await stripe.createToken(cardElement);

    if (paymentResult.error) {
      console.error('Payment error:', paymentResult.error.message);
    } else {
      console.log('Payment successful:', paymentResult);
      
      try {
        const response = await axios.post(process.env.NEXT_PUBLIC_BACKEND_API_URL + '/payment/token', {
          "paymentDetailsId": paymentId,
          "token": paymentResult.token
        }, {
          headers: {
            'Content-Type': 'application/json'
          },
        });
  
        console.log(response);
        if (response.status === 200) {
          console.log('Payment processed successfully on backend:', response.data);
          setPaymentSuccess(true);
        } else {
          console.error('Backend error processing payment:', response.data);
        }
      } catch (backendError) {
        console.error('Error sending token to backend:', backendError);
      }
    }
  };

  const handleTipSelection = (tip) => {
    setSelectedTip(tip);
  };

  const totalAmountWithTip = (amountDue + selectedTip).toFixed(2);

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
                    padding: '10px',
                    height: '60px',
                    lineHeight: '2.5',
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
            <button className={styles.submitButton} type="submit" disabled={!stripe}>Pay</button>
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
        const response = await axios.post(process.env.NEXT_PUBLIC_BACKEND_API_URL + '/payment/public-key');
        console.log("********** Fetch Public Key **********");
        console.log(response.data);
        const stripe = await loadStripe(response.data);
        setStripePromise(stripe);
      } catch (error) {
        console.log('Error fetching Public Key: ', error);
      }
    };

    fetchPublicKey();
  }, []);

  if (!stripePromise) {
    const stripe = loadStripe("pk_test_51JkDBCD8CM9vn1bFEZIIDSHGcntRE60KvzWDyTsDdJiXtyLvilMJGniyYXGbMEsIKVNcXSuvbRUYCeaR77hkVEbs00kYpMww0Y");
    setStripePromise(stripe);
    console.log(process.env.NODE_ENV);
    return <div>Loading payment gateway ... </div>;
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default CheckoutPage;
