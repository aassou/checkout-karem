// app/backoffice/page.tsx or pages/backoffice.js
"use client"; // Add this at the top

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Branches from './branches';
import Tables from './tables';

export default function BackofficePage() {
  const [selectedPage, setSelectedPage] = useState('branches'); // Page state to switch between different sections
  const [company, setCompany] = useState({});

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND_API_URL + '/api/company/1');
        console.log(response);
        setCompany(response.data);
        console.log("Fetched articles");
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };
    fetchCompany();
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-4 text-2xl font-bold">Admin Panel</div>
        <nav className="mt-6">
          <ul>
            <li className="px-4 py-2 cursor-pointer hover:bg-gray-700" onClick={() => setSelectedPage('branches')}>
              Manage Companies
            </li>
            <li className="px-4 py-2 cursor-pointer hover:bg-gray-700" onClick={() => setSelectedPage('branches')}>
              Manage Branches
            </li>
            <li className="px-4 py-2 cursor-pointer hover:bg-gray-700" onClick={() => setSelectedPage('tables')}>
              Manage Tables
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100">
        <h2 className="text-2xl font-bold mb-4">Company: {company.name}</h2>
        {selectedPage === 'branches' && <Branches />}
        {selectedPage === 'tables' && <Tables />}
      </div>
    </div>
  );
}
