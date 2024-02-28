import { useState, useEffect } from 'react'

export default function ProgresBar({duration, refreshTime}){

    const [remainingTime, setRemainingTime] = useState(duration);

    useEffect(() => {
        const interval = setInterval(() => {
            setRemainingTime((prevTime) => {
              const newRemTime = prevTime - refreshTime;
              console.log('Setting remaining time to ' + newRemTime);
              return newRemTime;
            });
        }, refreshTime);
    
        return () => {
          console.log('Clearing the interval');
          clearInterval(interval);
        }
      }, []);

    return(
        <progress value={remainingTime} max={duration}></progress>
    )
}