# 🚀 دليل النشر الشامل - Elenty.app

## المتطلبات الأساسية

### 1. تثبيت EAS CLI
```bash
npm install -g eas-cli
```

### 2. إنشاء حساب Expo
- زيارة https://expo.dev
- إنشاء حساب جديد أو تسجيل الدخول

### 3. تسجيل الدخول إلى Expo
```bash
eas login
```

## خطوات النشر الكاملة

### المرحلة الأولى: التحضير

#### 1. التحقق من البيانات الأساسية
```bash
# تأكد من أن app.json يحتوي على بيانات صحيحة
cat app.json

# المتوقع:
# - version: 1.1.0
# - slug: elentyapp
# - owner: asem.abadla
# - projectId: da77a01e-f338-400b-b32a-0954758bb189
```

#### 2. تثبيت المتعلقات
```bash
cd Elenty.app
npm install
# أو إذا استخدمت yarn/bun
yarn install
```

#### 3. التحقق من عدم وجود أخطاء
```bash
# فحص TypeScript
npx tsc --noEmit

# فحص الملفات المفقودة
npm run start
```

### المرحلة الثانية: البناء

#### للـ Android

```bash
# بناء للـ Android (على Google Play)
eas build --platform android --release-channel production

# بناء للـ Android (للاختبار المحلي APK)
eas build --platform android --local
```

**النتيجة:** ملف `.aab` جاهز للنشر على Google Play

#### للـ iOS

```bash
# بناء للـ iOS (على App Store)
eas build --platform ios --release-channel production

# بناء للـ iOS (للاختبار TestFlight)
eas build --platform ios --auto-submit
```

**النتيجة:** ملف `.ipa` جاهز للنشر على App Store

#### بناء كلا المنصتين

```bash
# بناء متزامن
eas build --platform all
```

### المرحلة الثالثة: النشر

#### نشر على Google Play Store
```bash
# النشر التلقائي بعد البناء
eas submit --platform android --latest

# أو النشر اليدوي
eas submit --platform android --build-id <BUILD_ID>
```

**متطلبات:**
- حساب Google Play Developer Console
- إنشاء تطبيق
- بيانات الأمان (`service account JSON`)

#### نشر على Apple App Store
```bash
# النشر التلقائي
eas submit --platform ios --latest

# أو النشر اليدوي
eas submit --platform ios --build-id <BUILD_ID>
```

**متطلبات:**
- حساب Apple Developer
- إنشاء تطبيق في App Store Connect
- شهادة توقيع صحيحة

## 📋 قائمة المراجعة قبل النشر

### معلومات التطبيق
- [ ] تحديث `version` في `app.json`
- [ ] التحقق من `slug` و `owner`
- [ ] مراجعة `projectId` من `eas.json`

### الإصلاحات المطبقة
- [ ] ✅ إصلاح Hermes btoa error
- [ ] ✅ إصلاح Memory leaks في setInterval
- [ ] ✅ تحسين Firebase error handling
- [ ] ✅ فصل useEffect hooks بشكل صحيح

### الأصول الرسومية
- [ ] مراجعة صورة الأيقونة (`./assets/images/icon.png`)
- [ ] مراجعة صورة الـ Splash (`./assets/images/splash-icon.png`)
- [ ] تأكد من الأبعاد الصحيحة

### الأداء
- [ ] فحص الحجم النهائي للـ Bundle
- [ ] اختبار على الجهاز الفعلي
- [ ] التحقق من الـ Memory usage

### الأمان
- [ ] مراجعة متغيرات البيئة في Firebase
- [ ] التحقق من عدم تسريب Keys في الكود
- [ ] تفعيل HTTPS في جميع الاتصالات

## 🔧 خطوات استكشاف الأخطاء

### خطأ في البناء

```bash
# عرض السجلات التفصيلية
eas build --platform android --verbose

# حذف الـ Cache
eas build --platform android --clear-cache
```

### مشاكل Firebase

```bash
# تحقق من firebaseConfig.ts
cat Elenty.app/services/firebaseConfig.ts

# تأكد من أن البيانات صحيحة:
# - apiKey
# - projectId
# - storageBucket
# - messagingSenderId
```

### مشاكل في EAS

```bash
# عرض حالة البناء
eas build:list

# إلغاء البناء الحالي
eas build:cancel <BUILD_ID>

# عرض جميع البنايات
eas build:view
```

## 📊 رابط المراقبة

بعد النشر، يمكنك متابعة التطبيق:

- **Google Play:** https://play.google.com/console/u/0/developers
- **App Store:** https://appstoreconnect.apple.com
- **Expo Dashboard:** https://expo.dev/accounts/asem.abadla

## 🎯 النتائج المتوقعة

### بعد النشر على Google Play
```
✅ التطبيق متاح لـ +2 مليار جهاز Android
✅ يظهر في البحث خلال 2-3 ساعات
✅ مراجعة من Google (قد تستغرق 24-48 ساعة)
```

### بعد النشر على App Store
```
✅ التطبيق متاح لـ جميع أجهزة iOS
✅ مراجعة من Apple (قد تستغرق 24-48 ساعة)
✅ يظهر في البحث خلال ساعة بعد الموافقة
```

## 📞 الدعم

في حالة حدوث مشاكل:

1. تحقق من السجلات التفصيلية
2. زيارة [Expo Docs](https://docs.expo.dev)
3. استشارة [Stack Overflow](https://stackoverflow.com/questions/tagged/expo)

---

**تم إعداد هذا الدليل:** 2026-07-06
**الإصدار:** 1.1.0
**الحالة:** جاهز للنشر ✅
