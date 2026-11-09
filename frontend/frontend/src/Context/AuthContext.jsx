import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Restore customer details
  const [customer, setCustomer] = useState(() => {
    const savedCustomer = localStorage.getItem("customer");

    try {
      return savedCustomer ? JSON.parse(savedCustomer) : null;
    } catch {
      localStorage.removeItem("customer");
      return null;
    }
  });

  // Restore authentication token
  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  // Save customer details
  useEffect(() => {
    if (customer) {
      localStorage.setItem("customer", JSON.stringify(customer));
    } else {
      localStorage.removeItem("customer");
    }
  }, [customer]);

  // Save token
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // Login
  function login(customerDetails, authToken) {
    setCustomer(customerDetails);
    setToken(authToken);
  }

  // Logout
  function logout() {
    setCustomer(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider
      value={{
        customer,
        token,
        login,
        logout,
        isAuthenticated: Boolean(customer && token),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
