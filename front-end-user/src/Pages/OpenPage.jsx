import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OpenPageMain from '../Components/OpenPageMain';
import BottomNavigationArea from '../Components/BottomNavigation';

const OpenPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home');
    }, 2000);

    return () => clearTimeout(timer); 
  }, [navigate]);

  return (
    <div>
      <OpenPageMain>
        <BottomNavigationArea />    
      </OpenPageMain>
    </div>
  );
}

export default OpenPage;