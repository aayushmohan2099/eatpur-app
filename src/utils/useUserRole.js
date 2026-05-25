// /src/utils/useUserRole.js

import { useState, useEffect } from "react";

export function useUserRole() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    // 1. Get the initial role from localStorage
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);

    // 2. Optional: Listen for storage changes
    // (This ensures if a user logs out in another tab, this tab updates automatically)
    const handleStorageChange = () => {
      setRole(localStorage.getItem("role"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Return the raw role string alongside convenient boolean checks
  return {
    role, // "ADMIN", "STAFF", "INVENTORY_MANAGER", "CUSTOMER", or null
    isAdmin: role === "ADMIN",
    isStaff: role === "STAFF",
    isInventoryManager: role === "INVENTORY_MANAGER",
    isCustomer: role === "CUSTOMER",
    isAuthenticated: !!role, // Quick check if any role exists
  };
}
