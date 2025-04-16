import React from 'react';
import Navbar from '@/components/Navbar';
import ApiKeySetup from '@/components/ApiKeySetup';

const Account = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
        <div className="space-y-6">
          <ApiKeySetup />
          {/* Add more account settings components here */}
        </div>
      </div>
    </div>
  );
};

export default Account;
