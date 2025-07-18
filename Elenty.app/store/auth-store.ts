import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/types';
import { getCurrentUser } from '@/mocks/users';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (phoneId: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  clearError: () => void;
  initializeAuth: () => Promise<void>;
}

interface RegisterData {
  phoneId: string;
  username: string;
  name: string;
  email?: string;
  password: string;
  countryCode?: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,
      
      login: async (phoneId: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock login - accept any credentials for now
          const user = getCurrentUser();
          
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false,
            error: null 
          });
        } catch (error: any) {
          console.error('Login error:', error);
          set({ 
            error: error.message || 'Login failed. Please try again.',
            isLoading: false,
            isAuthenticated: false,
            user: null
          });
          throw error;
        }
      },
      
      register: async (userData: RegisterData) => {
        try {
          set({ isLoading: true, error: null });
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1200));
          
          // Mock registration - create user from provided data
          const user: User = {
            id: Date.now().toString(),
            phoneId: userData.phoneId,
            username: userData.username,
            name: userData.name,
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
            bio: 'New user on Elenty!',
            followers: 0,
            following: 0,
            isVerified: false,
            canReceiveCalls: true,
            countryCode: userData.countryCode || '+1',
          };
          
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false,
            error: null 
          });
        } catch (error: any) {
          console.error('Registration error:', error);
          set({ 
            error: error.message || 'Registration failed. Please try again.',
            isLoading: false,
            isAuthenticated: false,
            user: null
          });
          throw error;
        }
      },
      
      logout: async () => {
        try {
          set({ isLoading: true });
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 300));
          
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false,
            error: null
          });
        } catch (error: any) {
          console.error('Logout error:', error);
          // Even if logout fails on server, clear local state
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false,
            error: null
          });
        }
      },
      
      updateProfile: async (userData: Partial<User>) => {
        try {
          const { user } = get();
          if (!user) throw new Error('No user logged in');
          
          set({ isLoading: true, error: null });
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const updatedUser = { ...user, ...userData };
          
          set({ 
            user: updatedUser, 
            isLoading: false,
            error: null
          });
        } catch (error: any) {
          console.error('Update profile error:', error);
          set({ 
            error: error.message || 'Failed to update profile',
            isLoading: false
          });
          throw error;
        }
      },
      
      clearError: () => set({ error: null }),
      
      initializeAuth: async () => {
        try {
          set({ isLoading: true });
          
          // Check if we have stored auth data
          const storedAuth = await AsyncStorage.getItem('auth-storage');
          if (storedAuth) {
            const authData = JSON.parse(storedAuth);
            if (authData.state?.user && authData.state?.isAuthenticated) {
              // Use stored user data
              set({ 
                user: authData.state.user, 
                isAuthenticated: true, 
                isLoading: false,
                error: null
              });
              return;
            }
          }
          
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false,
            error: null
          });
        } catch (error: any) {
          console.error('Auth initialization error:', error);
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false,
            error: null
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);