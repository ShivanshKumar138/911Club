import React from 'react';
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react';

const ProfileSettings = () => {
  return (
    <div className="bg-[#FF7D7D] min-h-screen">
      {/* Header */}
      <div className="flex items-center p-4">
        <ChevronLeft className="text-white w-6 h-6" />
        <h1 className="text-white text-3xl flex-1 text-center mr-6">Center set</h1>
      </div>

      {/* Main Content */}
      <div className="px-4 space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-4">
          {/* Avatar Section */}
          <div className="flex items-center justify-between mb-6">
            <div className="w-14 h-14 rounded-full overflow-hidden ring-4 ring-red-100">
              <img 
                src="/api/placeholder/56/56" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <button className="text-gray-500 flex items-center text-lg">
              Change avatar
              <ChevronRight className="w-5 h-5 ml-1 text-gray-400" />
            </button>
          </div>

          {/* Profile Info */}
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-gray-500 text-lg">Nickname</span>
              <div className="flex items-center">
                <span className="text-gray-500 text-lg">MemberNNGUCJPE</span>
                <ChevronRight className="w-5 h-5 ml-1 text-gray-400" />
              </div>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-gray-500 text-lg">UID</span>
              <div className="flex items-center">
                <span className="text-gray-500 text-lg">2545812</span>
                <div className="ml-2 text-red-400">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="4" y="4" width="6" height="6" rx="1" fill="currentColor"/>
                    <rect x="14" y="4" width="6" height="6" rx="1" fill="currentColor"/>
                    <rect x="4" y="14" width="6" height="6" rx="1" fill="currentColor"/>
                    <rect x="14" y="14" width="6" height="6" rx="1" fill="currentColor"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Safety Information Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Safety Information</h2>
          <div className="bg-white rounded-3xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center">
                <div className="w-10 h-10 flex items-center justify-center bg-red-50 rounded-xl mr-3">
                  <Lock className="w-5 h-5 text-red-400" />
                </div>
                <span className="text-gray-500 text-lg">Login password</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-500 text-lg">Review</span>
                <ChevronRight className="w-5 h-5 ml-1 text-gray-400" />
              </div>
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 flex items-center justify-center bg-red-50 rounded-xl mr-3">
                  <svg className="w-5 h-5 text-red-400" viewBox="0 0 24 24" fill="none">
                    <rect x="4" y="4" width="6" height="6" rx="1" fill="currentColor"/>
                    <rect x="14" y="4" width="6" height="6" rx="1" fill="currentColor"/>
                    <rect x="4" y="14" width="6" height="6" rx="1" fill="currentColor"/>
                    <rect x="14" y="14" width="6" height="6" rx="1" fill="currentColor"/>
                  </svg>
                </div>
                <span className="text-gray-500 text-lg">New version update</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-500 text-lg">1.0.9</span>
                <ChevronRight className="w-5 h-5 ml-1 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Clear Cache Button */}
        <button className="w-full bg-red-400 text-white py-4 rounded-2xl flex items-center justify-center text-lg mt-8">
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none">
            <rect x="4" y="4" width="6" height="6" rx="1" fill="currentColor"/>
            <rect x="14" y="4" width="6" height="6" rx="1" fill="currentColor"/>
            <rect x="4" y="14" width="6" height="6" rx="1" fill="currentColor"/>
            <rect x="14" y="14" width="6" height="6" rx="1" fill="currentColor"/>
          </svg>
          clear cache
        </button>
      </div>
    </div>
  );
};

export default ProfileSettings;