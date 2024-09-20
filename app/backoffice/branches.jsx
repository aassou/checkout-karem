// app/backoffice/branches.tsx or pages/branches.js
"use client"; // Add this at the top

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BranchTile from './BrancheTile';

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

  const handleEdit = (branch) => {
    alert(`Editing ${branch.name}`);
  };

  return (
    <div>
      {branches.map((branch, index) => (
        <BranchTile
          key={index}
          name={branch.name}
          address={branch.address}
          phone={branch.contactNumber}
          onEdit={() => handleEdit(branch)}
        />
      ))}
    </div>
  );
}

export default Branches;
