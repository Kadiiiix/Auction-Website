import React, { useState, useEffect } from "react";

function Timer({ closingDate }) {
  const [remainingTime, setRemainingTime] = useState("");

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentDate = new Date();
      const targetDate = new Date(closingDate);
      
      const differenceInTime = new Date(targetDate - currentDate);
      if (differenceInTime > 0) {
        const days = Math.floor(differenceInTime / (1000 * 3600 * 24));
        const hours = Math.floor(
          (differenceInTime % (1000 * 3600 * 24)) / (1000 * 3600)
        );
        const minutes = Math.floor(
          (differenceInTime % (1000 * 3600)) / (1000 * 60)
        );
        const seconds = Math.floor((differenceInTime % (1000 * 60)) / 1000);

        setRemainingTime(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      } else {
        setRemainingTime("Auction closed");
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [closingDate]);

  return remainingTime;
}

export default Timer;
