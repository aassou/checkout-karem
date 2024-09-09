import React from 'react';
import styles from './MessageBox.module.css';

const MessageBox = ({ type, message }) => {
  // Set different styles based on the type of the message
  const backgroundColor = type === 'success' ? 'green' : 'red';
  const textColor = 'white';

  return (
    <div
      className={styles.messageBox}
      style={{
        backgroundColor: backgroundColor,
        color: textColor,
      }}
    >
      {message}
    </div>
  );
};

export default MessageBox;
