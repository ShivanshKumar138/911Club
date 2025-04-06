// import React, { createContext, useContext, useState ,useEffect} from 'react';
// import Cookies from 'js-cookie';
// import { jwtDecode } from 'jwt-decode';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(() => {
//     return sessionStorage.getItem('token') ? true : false;
//   });

//   const [isAdmin, setIsAdmin] = useState(() => {
//     return sessionStorage.getItem('admin') ? true : false;
//   });

//   const isTokenExpired = () => {
//     const token = sessionStorage.getItem('token');
//     if (!token) {
//       return true;
//     }
//     const decodedToken = jwtDecode(token);
//     const expirationDate = new Date(decodedToken.exp * 1000);
//     return expirationDate < new Date();
//   };

//   console.log('isAdmin:', isAdmin);
//   const login = (token, admin) => {
//     sessionStorage.setItem('token', token);
//     Cookies.set('token', token);
//     setIsAuthenticated(true);

//     if (admin) {
//       sessionStorage.setItem('admin', 'true');
//       setIsAdmin(true);
//     }
//   };

//   const logout = () => {
//     sessionStorage.removeItem('token');
//     Cookies.remove('token');
//     setIsAuthenticated(false);

//     sessionStorage.removeItem('admin');
//     setIsAdmin(false);
//   };

//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (isTokenExpired()) {
//         logout();
//       }
//     }, 1000); // check every minute

//     return () => clearInterval(interval); // cleanup on unmount
//   }, []);
//   return (
//     <AuthContext.Provider value={{ isAuthenticated, isAdmin, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

// import React, { createContext, useContext, useState, useEffect } from 'react';
// import Cookies from 'js-cookie';
// import { jwtDecode } from 'jwt-decode';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   // Check both localStorage and Cookies instead of sessionStorage
//   const [isAuthenticated, setIsAuthenticated] = useState(() => {
//     const token = localStorage.getItem('token') || Cookies.get('token');
//     return token ? true : false;
//   });

//   const [isAdmin, setIsAdmin] = useState(() => {
//     return localStorage.getItem('admin') ? true : false;
//   });

//   const isTokenExpired = () => {
//     const token = localStorage.getItem('token') || Cookies.get('token');
//     if (!token) {
//       return true;
//     }
//     try {
//       const decodedToken = jwtDecode(token);
//       const expirationDate = new Date(decodedToken.exp * 1000);
//       return expirationDate < new Date();
//     } catch (error) {
//       console.error("Error decoding token:", error);
//       return true;
//     }
//   };

//   console.log('isAdmin:', isAdmin);

//   const login = (token, admin) => {
//     // Store in both localStorage and Cookies with a longer expiration
//     localStorage.setItem('token', token);
//     // Set cookie with a longer expiration (e.g., 7 days)
//     Cookies.set('token', token, { expires: 7 });
//     setIsAuthenticated(true);

//     if (admin) {
//       localStorage.setItem('admin', 'true');
//       setIsAdmin(true);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     Cookies.remove('token');
//     setIsAuthenticated(false);

//     localStorage.removeItem('admin');
//     setIsAdmin(false);
//   };

//   useEffect(() => {
//     // Check immediately on mount if token is expired
//     if (isTokenExpired()) {
//       logout();
//     }

//     const interval = setInterval(() => {
//       if (isTokenExpired()) {
//         logout();
//       }
//     }, 60000); // check every minute instead of every second for better performance

//     return () => clearInterval(interval); // cleanup on unmount
//   }, []);

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, isAdmin, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Check both sessionStorage and localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // First check sessionStorage (primary)
    const sessionToken = sessionStorage.getItem("token");

    // If not in sessionStorage, check localStorage (backup)
    if (!sessionToken) {
      const localToken = localStorage.getItem("token");
      // If found in localStorage, restore to sessionStorage
      if (localToken) {
        sessionStorage.setItem("token", localToken);
        return true;
      }
      return false;
    }
    return true;
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    // Similar approach for admin status
    const sessionAdmin = sessionStorage.getItem("admin");
    if (!sessionAdmin) {
      const localAdmin = localStorage.getItem("admin");
      if (localAdmin) {
        sessionStorage.setItem("admin", localAdmin);
        return true;
      }
      return false;
    }
    return true;
  });

  const isTokenExpired = () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      return true;
    }
    try {
      const decodedToken = jwtDecode(token);
      const expirationDate = new Date(decodedToken.exp * 1000);
      return expirationDate < new Date();
    } catch (error) {
      console.error("Error decoding token:", error);
      return true;
    }
  };

  console.log("isAdmin:", isAdmin);

  const login = (token, admin) => {
    // Store in both sessionStorage (primary) and localStorage (backup)
    sessionStorage.setItem("token", token);
    localStorage.setItem("token", token);
    Cookies.set("token", token);
    setIsAuthenticated(true);

    if (admin) {
      sessionStorage.setItem("admin", "true");
      localStorage.setItem("admin", "true");
      setIsAdmin(true);
    }
  };

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setIsAuthenticated(false);

    sessionStorage.removeItem("admin");
    localStorage.removeItem("admin");
    setIsAdmin(false);
  };

  useEffect(() => {
    // Auto logout after 2 minutes
    const autoLogoutTimer = setTimeout(() => {
      logout(); // Call logout after 2 minutes
    }, 3600000); // 120,000ms = 2 minutes

    // Check token expiration immediately and periodically
    if (isTokenExpired()) {
      logout();
    }

    const interval = setInterval(() => {
      if (isTokenExpired()) {
        logout();
      }
    }, 60000); // check every minute

    // Cleanup timers on component unmount
    return () => {
      clearTimeout(autoLogoutTimer); // Clean up the auto logout timer
      clearInterval(interval); // Clean up the interval checking for expiration
    };
  }, []); // Empty dependency array, this effect runs only once when the component mounts

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
