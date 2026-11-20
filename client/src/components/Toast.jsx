import React from 'react';
import toast from 'react-hot-toast';

export default function ToastDemo() {
  const handleClick = () => {
    toast.success('Service added to bag!');
  };

  return (
    <button onClick={handleClick} className="btn-primary px-4 py-2 text-sm">
      Show Toast
    </button>
  );
}

