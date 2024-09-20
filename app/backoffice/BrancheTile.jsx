import React, { useState } from 'react';
import { BsThreeDots } from 'react-icons/bs'; // For the three dots icon

function BranchTile({ name, address, phone, onEdit }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative bg-white border shadow-lg rounded-lg w-50 h-50 p-4 flex flex-col justify-between">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">{name}</h3>
        {/* Three Dots Dropdown */}
        <div className="relative">
          <button onClick={toggleMenu}>
            <BsThreeDots className="text-gray-500" size={20} />
          </button>
          {isMenuOpen && (
            <ul className="absolute right-0 mt-2 w-24 bg-white border rounded shadow-lg">
              <li
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={onEdit}
              >
                Edit
              </li>
            </ul>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 mt-4">
        <p>{address}</p>
      </div>

      {/* Footer */}
      <div className="text-sm text-gray-600">
        <p>{phone}</p>
      </div>
    </div>
  );
}

export default BranchTile;
