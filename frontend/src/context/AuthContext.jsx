import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import authService from '../services/authService';
import { STORAGE_KEYS, ROLES } from '../utils/constants';

export const AuthContext = createContext(null);

function readStoredSession() {
  const local = localStorage.getItem(STORAGE_KEYS.TOKEN);
  const session = sessionStorage.getItem(STORAGE_KEYS.TOKEN);
  const store = local ? localStorage : session ? sessionStorage : null;

  if (!store) return { token: null, user: null };

  try {
    const user = JSON.parse(store.getItem(STORAGE_KEYS.USER) || 'null');
    return { token: store.getItem(STORAGE_KEYS.TOKEN), user };
  } catch {
    return { token: null, user: null };
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const { token: storedToken, user: storedUser } = readStoredSession();
    if (storedToken) {
      setToken(storedToken);
      setUser(storedUser);
    }
    setInitializing(false);
  }, []);

  const login = useCallback(async ({ email, password, rememberMe }) => {
    const response = await authService.login({ email, password });
    // Backend diharapkan mengembalikan { token, user: { name, email, role, avatar } }
    const { token: newToken, user: newUser } = response.data;

    const store = rememberMe ? localStorage : sessionStorage;
    store.setItem(STORAGE_KEYS.TOKEN, newToken);
    store.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    store.setItem(STORAGE_KEYS.REMEMBER, rememberMe ? '1' : '0');

    setToken(newToken);
    setUser(newUser);

    return newUser;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
    sessionStorage.removeItem(STORAGE_KEYS.USER);
    setToken(null);
    setUser(null);
    authService.logout().catch(() => {
      // Sisi client tetap logout meski request ke server gagal
    });
  }, []);

  const updateUser = useCallback((patch) => {
    setUser((prev) => {
      const next = { ...prev, ...patch };
      const store = localStorage.getItem(STORAGE_KEYS.TOKEN) ? localStorage : sessionStorage;
      store.setItem(STORAGE_KEYS.USER, JSON.stringify(next));
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      isAdmin: user?.role === ROLES.ADMIN,
      isKasir: user?.role === ROLES.KASIR,
      initializing,
      login,
      logout,
      updateUser,
    }),
    [token, user, initializing, login, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
