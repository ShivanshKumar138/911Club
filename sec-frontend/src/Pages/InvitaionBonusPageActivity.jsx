import React from 'react';
import Mobile from '../Components/Mobile';
import { useNavigate } from 'react-router-dom';
const InvitationRewardRules = () => {
    const navigate=useNavigate();
  const rewardData = [
    { people: '1People', deposit: '₹500.00', bonus: '₹55.00' },
    { people: '3People', deposit: '₹500.00', bonus: '₹155.00' },
    { people: '10People', deposit: '₹500.00', bonus: '₹555.00' },
    { people: '30People', deposit: '₹500.00', bonus: '₹1555.00' },
    { people: '60People', deposit: '₹500.00', bonus: '₹2955.00' },
    { people: '100People', deposit: '₹500.00', bonus: '₹5655.00' },
    { people: '200People', deposit: '₹500.00', bonus: '₹11555.00' },
    { people: '500People', deposit: '₹500.00', bonus: '₹28555.00' },
    { people: '1000People', deposit: '₹500.00', bonus: '₹58555.00' },
    { people: '5000People', deposit: '₹500.00', bonus: '₹365555.00' },
    { people: '10000People', deposit: '₹500.00', bonus: '₹765555.00' },
    { people: '20000People', deposit: '₹500.00', bonus: '₹1655555.00' },
    { people: '50000People', deposit: '₹500.00', bonus: '₹3655555.00' }
  ];

  const rules = [
    'Only when the number of invited accounts is reached and each account can meet the recharge amount can you receive the bonus.',
    'The invitation account meets the requirements, but the recharge amount of the account does not meet the requirements, and the bonus cannot be claimed.',
    'Please claim the event bonus within the event period. all bonuses will be cleared after the event expires.',
    'Please complete the task within the event period. after the event expires, the invitation record will be cleared.'
  ];

  return (
    <Mobile>
    <div className="flex flex-col w-full bg-purple-100">
      {/* Header */}
      <div className="bg-white p-4 flex items-center">
        <div className="text-gray-700 cursor-pointer" onClick={()=>{navigate(-1)}}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </div>
        <div className="flex-1 text-center text-lg font-medium text-gray-800">
          Invitation reward rules
        </div>
      </div>

      {/* Description */}
      <div className="bg-white p-4 text-gray-700">
        <p>Invite friends and recharge to get additional platform rewards!</p>
        <p>After being claimed, the rewards will be directly distributed to the wallet balance within 10 minutes.</p>
      </div>

      {/* Reward Table */}
      <div className="mt-2 mx-2 rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="flex bg-red-400 text-white font-medium">
          <div className="flex-1 p-3 text-center">Invite account</div>
          <div className="flex-1 p-3 text-center">Deposit amount</div>
          <div className="flex-1 p-3 text-center">Bonus</div>
        </div>

        {/* Table Rows */}
        {rewardData.map((item, index) => (
          <div key={index} className="flex bg-red-200 border-t border-red-300">
            <div className="flex-1 p-2 text-center">{item.people}</div>
            <div className="flex-1 p-2 text-center">{item.deposit}</div>
            <div className="flex-1 p-2 text-center">{item.bonus}</div>
          </div>
        ))}
      </div>

      {/* Rules Section */}
      <div className="m-2 mt-4 bg-white rounded-lg overflow-hidden">
        {/* Rules Header */}
        <div className="relative bg-gradient-to-r from-red-400 to-red-500 text-white p-3 text-center font-medium">
          <span className="absolute left-4">•</span>
          Rules
          <span className="absolute right-4">•</span>
        </div>

        {/* Rules List */}
        <div className="p-4">
          {rules.map((rule, index) => (
            <div key={index} className="py-2 text-gray-700">
              {rule}
            </div>
          ))}
        </div>
      </div>
    </div>
    </Mobile>
  );
};

export default InvitationRewardRules;