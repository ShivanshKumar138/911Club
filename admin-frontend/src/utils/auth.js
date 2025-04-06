export const getToken = () => {
  return localStorage.getItem('token');
};

export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const removeToken = () => {
  localStorage.removeItem('token');
  clearUserInfo();
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const getUserInfo = () => {
  const userInfo = localStorage.getItem('userInfo');
  return userInfo ? JSON.parse(userInfo) : null;
};

export const clearUserInfo = () => {
  localStorage.removeItem('userInfo');
}; 