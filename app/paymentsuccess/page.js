// pages/checkout.js
import React from 'react';

const PaymentSuccess = () => {
  return (
    <div>
      Payment Success
      <form id="payment-form">
          <div id="card-element"></div>
          <button type="submit">Submit Payment</button>
      </form>
    </div>
  );
};

export default PaymentSuccess;
