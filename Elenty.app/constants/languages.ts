export const languages = {
  en: {
    // App Name
    appName: "Elenty",
    tagline: "Connect, Share, Call - All in One",
    
    // Auth
    login: "Log In",
    register: "Sign Up",
    phoneId: "Phone ID",
    password: "Password",
    forgotPassword: "Forgot Password?",
    createAccount: "Create New Account",
    fullName: "Full Name",
    username: "Username",
    email: "Email",
    alreadyHaveAccount: "Already have an account?",
    dontHaveAccount: "Don't have an account?",
    
    // Navigation
    home: "Home",
    explore: "Explore",
    create: "Create",
    live: "Live",
    reels: "Reels",
    notifications: "Notifications",
    messages: "Messages",
    
    // Common
    search: "Search",
    cancel: "Cancel",
    save: "Save",
    edit: "Edit",
    delete: "Delete",
    share: "Share",
    like: "Like",
    comment: "Comment",
    follow: "Follow",
    unfollow: "Unfollow",
    
    // Phone
    phoneTitle: "Elenty Phone",
    contacts: "Contacts",
    history: "History",
    dial: "Dial",
    call: "Call",
    videoCall: "Video Call",
    voiceCall: "Voice Call",
  },
  ar: {
    // App Name
    appName: "إيلينتي",
    tagline: "تواصل، شارك، اتصل - كل شيء في مكان واحد",
    
    // Auth
    login: "تسجيل الدخول",
    register: "إنشاء حساب",
    phoneId: "رقم الهاتف التعريفي",
    password: "كلمة المرور",
    forgotPassword: "نسيت كلمة المرور؟",
    createAccount: "إنشاء حساب جديد",
    fullName: "الاسم الكامل",
    username: "اسم المستخدم",
    email: "البريد الإلكتروني",
    alreadyHaveAccount: "لديك حساب بالفعل؟",
    dontHaveAccount: "ليس لديك حساب؟",
    
    // Navigation
    home: "الرئيسية",
    explore: "استكشاف",
    create: "إنشاء",
    live: "مباشر",
    reels: "ريلز",
    notifications: "الإشعارات",
    messages: "الرسائل",
    
    // Common
    search: "بحث",
    cancel: "إلغاء",
    save: "حفظ",
    edit: "تعديل",
    delete: "حذف",
    share: "مشاركة",
    like: "إعجاب",
    comment: "تعليق",
    follow: "متابعة",
    unfollow: "إلغاء المتابعة",
    
    // Phone
    phoneTitle: "هاتف إيلينتي",
    contacts: "جهات الاتصال",
    history: "السجل",
    dial: "طلب",
    call: "اتصال",
    videoCall: "مكالمة فيديو",
    voiceCall: "مكالمة صوتية",
  }
};

export type Language = keyof typeof languages;
export type TranslationKey = keyof typeof languages.en;