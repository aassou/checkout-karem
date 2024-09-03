"use client";

import React from 'react';
import styles from './TipsSection.module.css';
import { FaEdit } from 'react-icons/fa'; // Import the edit icon from react-icons/fa

const TipsSection = ({ onSelectTip }) => {
  // Dummy amounts based on a total amount for calculation
  const amounts = {
    10: 7.40,
    15: 11.10,
    20: 14.80,
  };

  return (
    <div className={styles.tipsSection}>
      <div className={styles.tipsTitle}>Would you like to add a tip?</div>
      <div className={styles.tipsGrid}>
        {Object.keys(amounts).map((percentage) => (
          <div
            key={percentage}
            className={styles.tipCard}
            onClick={() => onSelectTip(percentage)}
          >
            <div className={styles.tipPercentage}>{percentage}%</div>
            <div className={styles.tipAmount}>{amounts[percentage]} EUR</div>
          </div>
        ))}
        <div
          className={styles.customTipCard}
          onClick={() => onSelectTip('custom')}
        >
          <FaEdit className={styles.editIcon} />
          <div className={styles.customText}>Custom</div>
        </div>
      </div>
    </div>
  );
};

export default TipsSection;
