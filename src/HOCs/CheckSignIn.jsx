import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function withAuthAndExamCheck(WrappedComponent) {
  const ComponentWithCheck = (props) => {
    const navigate = useNavigate();

    useEffect(() => {
      const uid = sessionStorage.getItem('uid');
      const examTake = sessionStorage.getItem('exam_taken');

      if (!uid) {
        navigate('/signin');
      } else if (examTake === '0' && WrappedComponent.name !== "Exam") {
        navigate('/exam');
      }
    }, [navigate]);

    return <WrappedComponent {...props} />;
  };

  return ComponentWithCheck;
}

export default withAuthAndExamCheck;
