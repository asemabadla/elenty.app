import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { languages, Language, TranslationKey } from '@/constants/languages';

interface LanguageState {
  currentLanguage: Language;
  isRTL: boolean;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      currentLanguage: 'ar', // Default to Arabic
      isRTL: true,
      setLanguage: (language: Language) => {
        set({ 
          currentLanguage: language,
          isRTL: language === 'ar'
        });
      },
      t: (key: TranslationKey) => {
        const { currentLanguage } = get();
        return languages[currentLanguage][key] || languages.en[key];
      },
    }),
    {
      name: 'language-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);