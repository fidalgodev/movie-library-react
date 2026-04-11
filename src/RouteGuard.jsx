import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const RouteGuard = () => {
  const navigate = useNavigate();
  const error = useSelector((state) => state.errors);

  useEffect(() => {
    if (error) {
      navigate('/error');
    }
  }, [error, navigate]);

  return null;
};

export default RouteGuard;
