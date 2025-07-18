import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { useSocialStore } from '@/store/social-store';

/**
 * Hook to initialize backend services and sync data
 */
export const useBackend = () => {
  const { user, isAuthenticated, initializeAuth } = useAuthStore();
  const { refreshAll } = useSocialStore();

  // Initialize authentication on app start
  useEffect(() => {
    initializeAuth();
  }, []);

  // Load user data when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      refreshAll(user.id);
    }
  }, [isAuthenticated, user?.id]);

  return {
    isBackendEnabled: true,
    user,
    isAuthenticated,
  };
};