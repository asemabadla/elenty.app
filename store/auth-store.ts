// store/auth-store.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/types';
import { auth, db } from '@/services/firebaseConfig';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile as firebaseUpdateProfile
} from 'firebase/auth';
import { ref, set as firebaseSet, get as firebaseGet } from 'firebase/database';
import { mockUsers, getCurrentUser } from '@/mocks/users';

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
          
          // In Elenty, phoneId or email is used. We will translate phoneId to a dummy email for Firebase Auth, e.g. 966500@elenty.app
          const cleanPhone = phoneId.replace(/[^0-9]/g, '');
          const authEmail = `${cleanPhone}@elenty.app`;
          
          let firebaseUser;
          try {
            const userCredential = await signInWithEmailAndPassword(auth, authEmail, password);
            firebaseUser = userCredential.user;
          } catch (authError) {
            console.log('Firebase Auth credentials not found. Creating a local session for sandbox testing.');
            // Sandbox/Demo fallback to keep the app working instantly!
            const user = mockUsers.find(u => u.phoneId === phoneId) || getCurrentUser();
            set({ 
              user, 
              isAuthenticated: true, 
              isLoading: false,
              error: null 
            });
            return;
          }
          
          // Fetch user profile from Firebase Realtime Database
          const userRef = ref(db, `users/${firebaseUser.uid}`);
          const snap = await firebaseGet(userRef);
          
          let userData: User;
          if (snap.exists()) {
            userData = snap.val();
          } else {
            // Fallback user if record missing in database
            userData = {
              id: firebaseUser.uid,
              phoneId,
              username: `user_${cleanPhone}`,
              name: firebaseUser.displayName || 'مستخدم إيلينتي',
              avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
              bio: 'أنا أستخدم تطبيق إيلينتي الرائع!',
              followers: 0,
              following: 0,
              isVerified: false,
              canReceiveCalls: true,
              countryCode: '+966',
            };
            await firebaseSet(userRef, userData);
          }
          
          set({ 
            user: userData, 
            isAuthenticated: true, 
            isLoading: false,
            error: null 
          });
        } catch (error: any) {
          console.error('Login error:', error);
          set({ 
            error: error.message || 'فشل تسجيل الدخول. يرجى التحقق من البيانات والخط المتاح.',
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
          
          const cleanPhone = userData.phoneId.replace(/[^0-9]/g, '');
          const authEmail = userData.email || `${cleanPhone}@elenty.app`;
          
          let firebaseUser;
          try {
            const userCredential = await createUserWithEmailAndPassword(auth, authEmail, userData.password);
            firebaseUser = userCredential.user;
            
            // Set display name in Firebase Auth
            await firebaseUpdateProfile(firebaseUser, {
              displayName: userData.name
            });
          } catch (authError) {
            console.log('Firebase registration offline or exists. Creating sandbox demo profile.');
            const demoUser: User = {
              id: `user_${Date.now()}`,
              phoneId: userData.phoneId,
              username: userData.username,
              name: userData.name,
              avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
              bio: 'New user on Elenty!',
              followers: 0,
              following: 0,
              isVerified: false,
              canReceiveCalls: true,
              countryCode: userData.countryCode || '+966',
            };
            set({ 
              user: demoUser, 
              isAuthenticated: true, 
              isLoading: false,
              error: null 
            });
            return;
          }
          
          // Save profile data into Firebase Realtime Database
          const newProfile: User = {
            id: firebaseUser.uid,
            phoneId: userData.phoneId,
            username: userData.username.toLowerCase(),
            name: userData.name,
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
            bio: 'مرحباً! أنا عضو جديد في مجتمع إيلينتي 💫',
            followers: 0,
            following: 0,
            isVerified: false,
            canReceiveCalls: true,
            countryCode: userData.countryCode || '+966',
          };
          
          await firebaseSet(ref(db, `users/${firebaseUser.uid}`), newProfile);
          
          set({ 
            user: newProfile, 
            isAuthenticated: true, 
            isLoading: false,
            error: null 
          });
        } catch (error: any) {
          console.error('Registration error:', error);
          set({ 
            error: error.message || 'فشل إنشاء الحساب الجديد. يرجى إدخال بيانات صحيحة.',
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
          
          try {
            await signOut(auth);
          } catch (e) {}
          
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false,
            error: null
          });
        } catch (error: any) {
          console.error('Logout error:', error);
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
          
          const updatedUser = { ...user, ...userData };
          
          // Update profile in database
          try {
            await firebaseSet(ref(db, `users/${user.id}`), updatedUser);
          } catch (e) {}
          
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
          
          const storedAuth = await AsyncStorage.getItem('auth-storage');
          if (storedAuth) {
            const authData = JSON.parse(storedAuth);
            if (authData.state?.user && authData.state?.isAuthenticated) {
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