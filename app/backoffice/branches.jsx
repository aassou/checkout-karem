// app/backoffice/branches.tsx or pages/branches.js
"use client"; // Add this at the top

import React, { useState, useEffect } from 'react';

function Branches({companyId}) {
  const [branches, setBranches] = useState([]);
  const [branchName, setBranchName] = useState('');
  const [branchLocation, setBranchLocation] = useState('');

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND_API_URL + '/api/branch/' + companyId);
        console.log(response);
        setBranches(response.data);
        console.log("Fetched branches");
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    };
    fetchBranches();
  }, []);

  const handleAddBranch = () => {
    const newBranch = { name: branchName, location: branchLocation };
    setBranches([...branches, newBranch]);
    setBranchName('');
    setBranchLocation('');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Branches</h2>
      {/* Branch List */}
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Branch Name</th>
            <th className="py-2">Location</th>
          </tr>
        </thead>
        <tbody>
          {branches.map((branch, index) => (
            <tr key={index}>
              <td className="py-2">{branch.name}</td>
              <td className="py-2">{branch.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Branches;
