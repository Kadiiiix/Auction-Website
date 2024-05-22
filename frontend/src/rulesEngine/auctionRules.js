// src/validators.js
import moment from 'moment';

const minDays = 2; // Define the minimum number of days for the auction

export const validateClosingDate = () => {
  return (_, value) => {
    if (!value) {
      console.log('No value selected');
      return Promise.resolve();
    }

    // Parse the value as a Date object
    const closingDate = moment(value);

    // Calculate the minimum date allowed
    const minDate = moment().add(minDays, 'days');

    console.log('Closing Date:', closingDate.format('YYYY-MM-DD'));
    console.log('Minimum Date Allowed:', minDate.format('YYYY-MM-DD'));

    // Compare the closing date with the minimum date allowed
    if (closingDate.isSameOrAfter(minDate, 'day')) {
      console.log('Validation Passed');
      return Promise.resolve();
    }
    
    console.log('Validation Failed');
    return Promise.reject(new Error(`Closing date must be at least ${minDays} days from today`));
  };
};
