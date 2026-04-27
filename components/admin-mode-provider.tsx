"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  ADMIN_SESSION_KEY,
  clearClientAdminSession,
  isClientAdminAuthenticated,
  tryClientAdminLogin
} from "@/lib/client-admin-auth";

type AdminModeContextValue = {
  enabled: boolean;
  unlock: (password: string) => boolean;
  lock: () => void;
};

const AdminModeContext = createContext<AdminModeContextValue | null>(null);

export function AdminModeProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(isClientAdminAuthenticated());

    function handleStorage(event: StorageEvent) {
      if (event.key === ADMIN_SESSION_KEY) {
        setEnabled(isClientAdminAuthenticated());
      }
    }

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <AdminModeContext.Provider
      value={{
        enabled,
        unlock(password) {
          const success = tryClientAdminLogin(password);

          if (success) {
            setEnabled(true);
          }

          return success;
        },
        lock() {
          clearClientAdminSession();
          setEnabled(false);
        }
      }}
    >
      {children}
    </AdminModeContext.Provider>
  );
}

export function useAdminMode() {
  const context = useContext(AdminModeContext);

  if (!context) {
    throw new Error("useAdminMode must be used within AdminModeProvider");
  }

  return context;
}
