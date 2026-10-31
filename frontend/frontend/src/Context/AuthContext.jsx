import { createContext, useState, useEffect } from "react";

// Create authentication context
export const AuthContext = createContext();

// Create provider
export function AuthProvider({ children }) {
  // Restore customer details when the app loads
  const [customer, setCustomer] = useState(() => {
    const savedCustomer = localStorage.getItem("customer");

    try {
      return savedCustomer ? JSON.parse(savedCustomer) : null;
    } catch {
      localStorage.removeItem("customer");
      return null;
    }
  });

  // Save customer details whenever they change
  useEffect(() => {
    if (customer) {
      localStorage.setItem("customer", JSON.stringify(customer));
    } else {
      localStorage.removeItem("customer");
    }
  }, [customer]);

  // Login function
  function login(customerDetails) {
    setCustomer(customerDetails);
  }

  // Logout function
  function logout() {
    setCustomer(null);
  }

  return (
    <AuthContext.Provider
      value={{
        customer,
        login,
        logout,
        isAuthenticated: Boolean(customer),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
