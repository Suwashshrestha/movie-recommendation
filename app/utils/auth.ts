export const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  };
  
  export const getUserEmail = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('user_email');
    }
    return null;
  };
  
  export const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_email');
    }
  };