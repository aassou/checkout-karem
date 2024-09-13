// app/checkout/TipsSection.js

import React, { useState } from 'react';
import styles from './TipsSection.module.css';
import { FaEdit } from 'react-icons/fa';

const TipsSection = ({ onSelectTip, amountDue, webSocketRef }) => {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customTipValue, setCustomTipValue] = useState('');
  const [selectedTip, setSelectedTip] = useState(null);

  const percentages = [0, 5, 10, 15];
  const amounts = percentages.reduce((acc, percentage) => {
    acc[percentage] = ((percentage / 100) * amountDue).toFixed(2);
    return acc;
  }, {});

  const sendTipToBackend = (tipAmount) => {
    if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
      const data = JSON.stringify({
        type: 'TIP_SELECTED',
        tipAmount: parseFloat(tipAmount),
      });
      webSocketRef.current.send(data);
    }
  };

  const handleTipSelection = (percentage) => {
    setShowCustomInput(false);
    setCustomTipValue('');
    setSelectedTip(percentage);
    const tipAmount = ((percentage / 100) * amountDue).toFixed(2);
    onSelectTip(parseFloat(tipAmount));

    // Send tip amount to backend
    sendTipToBackend(tipAmount);
  };

  const handleCustomTipClick = () => {
    setShowCustomInput(true);
    setSelectedTip('custom');
    onSelectTip(0);
  };

  const handleCustomTipChange = (e) => {
    const value = e.target.value;
    setCustomTipValue(value);
    const tipAmount = parseFloat(value) || 0;
    onSelectTip(tipAmount);

    // Send custom tip amount to backend
    sendTipToBackend(tipAmount);
  };

  return (
    <div className={styles.tipsSection}>
      <div className={styles.tipsTitle}>Would you like to add a tip?</div>
      <div className={styles.tipsGrid}>
        {percentages.map((percentage) => (
          <div
            key={percentage}
            className={`${styles.tipCard} ${
              selectedTip === percentage ? styles.selected : ''
            }`}
            onClick={() => handleTipSelection(percentage)}
          >
            <div className={styles.tipPercentage}>{percentage}%</div>
            <div className={styles.tipAmount}>{amounts[percentage]} EUR</div>
          </div>
        ))}
        <div
          className={`${styles.customTipCard} ${
            selectedTip === 'custom' ? styles.selected : ''
          }`}
        >
          {showCustomInput ? (
            <input
              type="number"
              placeholder="Enter amount"
              value={customTipValue}
              onChange={handleCustomTipChange}
              className={styles.customTipInput}
            />
          ) : (
            <div onClick={handleCustomTipClick}>
              <FaEdit className={styles.editIcon} />
              <div className={styles.customText}>Custom</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TipsSection;
