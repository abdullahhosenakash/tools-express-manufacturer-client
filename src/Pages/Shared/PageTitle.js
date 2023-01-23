import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const PageTitle = ({ title = '' }) => {
  const location = useLocation();
  const pathname =
    location.pathname?.slice(1, 2).toUpperCase() + location.pathname?.slice(2);
  return (
    <Helmet>
      <title>{pathname !== 'Home' ? title + ' -' : ''} Tools Express</title>
    </Helmet>
  );
};

export default PageTitle;
