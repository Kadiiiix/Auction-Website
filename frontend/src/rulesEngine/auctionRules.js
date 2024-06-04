// src/validators.js
import moment from 'moment';

const minDays = 3; // Define the minimum number of days for the auction
const maxDays = 60;
const minBid = 1;
const extendDays = 3;

export const disabledDate = (current) => {
  const minDate = moment().add(minDays, 'days').startOf('day');
  const maxDate = moment().add(maxDays, 'days').endOf('day');

  return current && (current < minDate || current > maxDate);
};

export const validateStartingBid = (_, value) => {
  if (value < minBid) {
    return Promise.reject(new Error(`Starting bid must be at least ${minBid}`));
  }
  return Promise.resolve();
};

export const validateExtensionDays = (_, value) => {
  if (value && value > extendDays) {
    return Promise.reject(new Error(`You can only extend the auction for up to ${extendDays} days`));
  }
  return Promise.resolve();
};