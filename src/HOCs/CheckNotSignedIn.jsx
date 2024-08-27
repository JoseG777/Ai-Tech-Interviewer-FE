import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function withNotSignedInCheck(WrappedComponent) {
  return function (props) {
    const navigate = useNavigate();

    useEffect(() => {
      const uid = sessionStorage.getItem('uid');
      if (uid) {
        navigate('/main'); 
      }
    }, [navigate]);

    return <WrappedComponent {...props} />;
  };
}

export default withNotSignedInCheck;
