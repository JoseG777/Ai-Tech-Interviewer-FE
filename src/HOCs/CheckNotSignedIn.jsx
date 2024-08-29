import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function withNotSignedInCheck(WrappedComponent) {
  return function (props) {
    const navigate = useNavigate();

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_APP_API_ENDPOINT}/api/check_auth`, {
            method: 'GET',
            credentials: 'include',
          });

          if (response.status === 200) {
            navigate('/main');
          }
        } catch (error) {
          console.error('Error during authentication check:', error);
        }
      };

      checkAuth();
    }, [navigate]);

    return <WrappedComponent {...props} />;
  };
}

export default withNotSignedInCheck;
