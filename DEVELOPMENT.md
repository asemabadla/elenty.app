# Elenty.app - دليل التطوير

## المتطلبات

- Node.js 18+
- npm أو yarn
- Expo CLI

## إعداد البيئة

### 1. تثبيت المكتبات
```bash
npm install
```

### 2. إعداد متغيرات البيئة
```bash
cp .env.example .env
# قم بتحديث القيم في .env بقيمك الفعلية
```

### 3. التحقق من التثبيت
```bash
npm run type-check
```

## تشغيل التطبيق

### التطوير المحلي
```bash
npm start
```

### تشغيل على Android
```bash
npm run android
```

### تشغيل على iOS
```bash
npm run ios
```

### تشغيل على Web
```bash
npm run start-web
```

## أدوات التطوير

### التحقق من الأخطاء (Linting)
```bash
npm run lint
```

### تنسيق الكود
```bash
npm run format
```

### التحقق من الأنواع
```bash
npm run type-check
```

### تشغيل الاختبارات
```bash
npm test
```

### الاختبارات مع المراقبة
```bash
npm run test:watch
```

### تقرير التغطية
```bash
npm run test:coverage
```

## هيكل المشروع

```
.
├── app/                 # Expo Router screens
│   ├── (auth)/         # شاشات المصادقة
│   ├── (tabs)/         # الشاشات الأساسية
│   ├── chat/           # شاشات الدردشة
│   ├── profile/        # شاشات الملف الشخصي
│   └── ...
├── components/          # React components
├── hooks/              # Custom React hooks
├── store/              # Zustand stores
├── constants/          # ثوابت التطبيق
├── utils/              # دوال مساعدة
├── types/              # TypeScript types
└── assets/             # الصور والموارد
```

## معايير الكود

### TypeScript
- استخدام `strict: true`
- تحديد الأنواع بشكل صريح
- تجنب `any` قدر الإمكان

### التسمية
- المكونات: PascalCase
- الملفات: kebab-case أو camelCase حسب النوع
- الثوابت: UPPER_SNAKE_CASE

### التعليقات
- التعليقات بالعربية للتوضيح
- JSDoc للدوال المهمة
- شرح "لماذا" وليس "ماذا"

## الخدمات الخارجية

### Firebase
- المصادقة والتخزين
- قاعدة البيانات الفعلية

### LiveKit
- المكالمات الصوتية والفيديو
- البث المباشر

### Twilio
- المكالمات الدولية

## حل المشاكل الشائعة

### خطأ في الاتصال بالخادم
```bash
# تحقق من المتغيرات البيئية
npm run type-check

# امسح الذاكرة المؤقتة
rm -rf .expo
npm start
```

### مشاكل في الاعتماديات
```bash
# إعادة تثبيت المكتبات
rm -rf node_modules
npm install
```

### مشاكل التوافق على Web
```bash
# استخدم المتصفح الأحدث
# تحقق من metro.config.js
npm run start-web
```

## الإسهام

1. أنشئ فرع جديد: `git checkout -b feature/your-feature`
2. قم بالتغييرات والاختبار
3. تشغيل الفحوصات: `npm run prepare-commit`
4. أرسل Pull Request

## الترخيص

MIT
