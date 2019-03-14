import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div>
      This was not foud
      <Link to="/">Go back home</Link>
    </div>
  );
};

export default NotFound;
