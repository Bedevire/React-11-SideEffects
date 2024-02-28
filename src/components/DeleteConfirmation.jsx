import { useEffect } from 'react'
import ProgresBar from './ProgressBar';

const TIMER = 3000;
const refreshTime = 10;

export default function DeleteConfirmation({ onConfirm, onCancel }) {

  useEffect(() => {
    console.log('DeleteConfirmation module - useEffect - starting timer');
    const timer = setTimeout(() => {
      console.log('DeleteConfirmation - Timer timed out - Closing modal');
      onConfirm(); 
    }, TIMER);
    
    return () => {
      console.log('DeleteConfirmation - Modal cleanup - clearing timer');
      clearTimeout(timer);
    }
  }, [onConfirm]);

  return (
    <div id="delete-confirmation">
      <h2>Are you sure?</h2>
      <p>Do you really want to remove this place?</p>
      <div id="confirmation-actions">
        <button onClick={onCancel} className="button-text">
          No
        </button>
        <button onClick={onConfirm} className="button">
          Yes
        </button>
      </div>
      <ProgresBar duration={TIMER} refreshTime={refreshTime} />
    </div>
  );
}
