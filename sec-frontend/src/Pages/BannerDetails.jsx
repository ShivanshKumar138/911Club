import React from 'react';
import Mobile from '../Components/Mobile';
import { useParams
 } from 'react-router-dom';
 const one = [
  {
    title: 'First Deposit Bonus',
    amount: '₹12,600,000',
    invitations: '30,000',
    img: "/assets/banners/rb1.jpg"
  },
  {
    pageTitle:"First Deposit Bonus"
  }
];

const two = [
  {
    title: 'Activity Bonus',
    amount: '₹12,600,000',
    invitations: '30,000',
    img: "/assets/banners/inb1.jpg"
  },
  {
    pageTitle:"Activity Bonus"
  }
];

const three = [
  {
    text: "Weekly Bonus",
    amount: '₹12,600,000',
    invitations: '30,000',
    img: "/assets/banners/inb1.jpg"
  },
  {
    pageTitle:"Weekly Bonus"
  }
];

const four = [
  {
    title: 'VIP Bonus',
    amount: '₹12,600,000',
    invitations: '30,000',
    img: "/assets/banners/inb1.jpg"
  },
  {
    pageTitle:"Vip Bonus"
  }
];
const RewardCard = ({ reward, index,id}) => (
  <div className="p-4 border border-orange-300 rounded-lg shadow-md bg-white">
    <h2 className="text-xl font-bold text-orange-500">
      {reward.title}
    </h2>
    <div className="relative mt-4">
      <img src={reward.img} alt={reward.title} className="w-full rounded-md" />
      <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-md">
        {reward.amount}
      </div>
    </div>
   
  </div>
);

const BannerDetail = () => {
  const {id}=useParams();
  console.log(id);
  return (
    <Mobile>
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        {eval(id)[1].pageTitle}  {/* Changed from [2] to [1] */}
      </h1>
      <div className="space-y-6">
        {eval(id).map((reward, index) => (
          <RewardCard key={index} reward={reward} index={index} id={id} />
        ))}
      </div>
    </div>
    </Mobile>
  );
};
export default BannerDetail;
