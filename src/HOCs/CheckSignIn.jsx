import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function withAuthAndExamCheck(WrappedComponent) {
  const ComponentWithCheck = (props) => {
    const navigate = useNavigate();

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_APP_API_ENDPOINT}/api/check_auth`, {
            method: 'GET',
            credentials: 'include', 
          });

          if (response.status === 200) {
            const data = await response.json();

            const examStatusResponse = await fetch(`${import.meta.env.VITE_APP_API_ENDPOINT}/api/get_exam_status`, {
              method: 'GET',
              credentials: 'include',
            });

            const examData = await examStatusResponse.json();
            if (examData.exam_status === '0' && WrappedComponent.name !== "Exam") {
              navigate('/exam');
            }
          } else {
            navigate('/signin');
          }
        } catch (error) {
          console.error('Error during authentication check:', error);
          navigate('/signin');
        }
      };

      checkAuth();
    }, [navigate]);

    return <WrappedComponent {...props} />;
  };

  return ComponentWithCheck;
}

export default withAuthAndExamCheck;
