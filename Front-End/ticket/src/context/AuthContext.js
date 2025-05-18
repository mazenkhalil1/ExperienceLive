import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Fetch user on load (optional: check if token or session is active)
  useEffect(() => {
    // You can fetch user here from localStorage or an API
  }, []);

  // Login function
  const login = async (email, password) => {
    const res = await axios.post('http://localhost:5000/api/auth/login', {
      email,
      password,
    }, { withCredentials: true });

    setUser(res.data.user); // assuming backend sends { user }
  };

  // Logout function
  const logout = async () => {
    await axios.get('http://localhost:5000/api/auth/logOut', { withCredentials: true });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
