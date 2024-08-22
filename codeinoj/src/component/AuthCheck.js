import { useNavigate } from 'react-router-dom';
import { getProfile } from '../service/api';

const withAuthCheck = (WrappedComponent, redirectTo = '/login') => {
  return (props) => {
    const navigate = useNavigate();

    const handleAuthCheck = async (e) => {
      e.preventDefault();
      try {
        const response = await getProfile();
        console.log("response profile : ", response);
        if (response.success) {
          navigate(props.to);
        } else {
          navigate(redirectTo);
        }
      } catch (err) {
        console.error('Error while checking authentication:', err);
        navigate(redirectTo);
      }
    };

    return <WrappedComponent {...props} onClick={handleAuthCheck} />;
  };
};

export default withAuthCheck;
