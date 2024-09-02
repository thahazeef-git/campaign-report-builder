import React, { useState, useEffect } from 'react';

const OptionsModal = ({ isOpen, onClose, onSubmit, children }) => {
  const [displayType, setDisplayType] = useState('bar');
  const [color, setColor] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setDisplayType('bar');
      setColor('#1d4ed8');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(displayType, color);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <button className="text-gray-500 text-xl hover:text-gray-700 float-right" onClick={onClose}>
          &times;
        </button>
        <div className="text-xl font-semibold mb-4">Select Display Options</div>
        <div className="mb-4">
          {children}
          <div className="mb-4">
            <label className="block text-gray-700">Display Type:</label>
            <select
              value={displayType}
              onChange={(e) => setDisplayType(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
            >
              <option value="bar">Bar Chart</option>
              <option value="line">Line Chart</option>
              <option value="card">Card</option>
            </select>
          </div>
          {(displayType === 'bar' || displayType === 'line') && (
            <div className="mb-4">
              <label className="block text-gray-700">Color:</label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="Enter the color"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              />
            </div>
          )}
        </div>
        <div className="flex justify-end">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default OptionsModal;