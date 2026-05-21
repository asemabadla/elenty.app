import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView, I18nManager } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';
import { useLanguageStore } from '@/store/language-store';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Logo } from '@/components/Logo';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/colors';
import { Globe } from 'lucide-react-native';

export default function LoginScreen() {
  const [phoneId, setPhoneId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const { t, currentLanguage, setLanguage, isRTL } = useLanguageStore();
  const router = useRouter();

  const handleLogin = async () => {
    if (!phoneId || !password) {
      return;
    }

    setIsLoading(true);
    try {
      await login(phoneId, password);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'ar' ? 'en' : 'ar';
    setLanguage(newLanguage);
    I18nManager.forceRTL(newLanguage === 'ar');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
    >
      <ScrollView 
        contentContainerStyle={[styles.scrollContent, isRTL && styles.rtlContainer]}
        showsVerticalScrollIndicator={false}
      >
        {/* Language Toggle */}
        <TouchableOpacity 
          style={styles.languageButton} 
          onPress={toggleLanguage}
          activeOpacity={0.8}
        >
          <Globe size={18} color={colors.primary} />
          <Text style={styles.languageText}>
            {currentLanguage === 'ar' ? 'English' : 'العربية'}
          </Text>
        </TouchableOpacity>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Logo size="large" showTagline />
        </View>

        {/* Profile Image */}
        <View style={styles.profileImageContainer}>
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' }}
              style={styles.profileImage}
            />
          </View>
          <View style={styles.nameBadge}>
            <Text style={styles.nameBadgeText}>إيلين</Text>
          </View>
        </View>

        {/* Login Form */}
        <Card style={styles.formCard} padding="xl">
          <View style={styles.formHeader}>
            <Text style={[styles.welcomeTitle, isRTL && styles.rtlText]}>
              مرحباً بعودتك
            </Text>
            <Text style={[styles.welcomeSubtitle, isRTL && styles.rtlText]}>
              سجل دخولك للمتابعة
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, isRTL && styles.rtlInput]}
              placeholder={t('phoneId')}
              placeholderTextColor={colors.textSecondary}
              value={phoneId}
              onChangeText={setPhoneId}
              keyboardType="number-pad"
              autoCapitalize="none"
              textAlign={isRTL ? 'right' : 'left'}
            />
            <TextInput
              style={[styles.input, isRTL && styles.rtlInput]}
              placeholder={t('password')}
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              textAlign={isRTL ? 'right' : 'left'}
            />

            <Button
              title={t('login')}
              onPress={handleLogin}
              loading={isLoading}
              fullWidth
              size="lg"
            />

            <TouchableOpacity style={styles.forgotPassword} activeOpacity={0.7}>
              <Text style={styles.forgotPasswordText}>{t('forgotPassword')}</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>أو</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Register Button */}
        <Button
          title={t('createAccount')}
          onPress={() => router.push('/register')}
          variant="outline"
          fullWidth
          size="lg"
        />

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            مرحباً بك في إيلينتي - التطبيق الذي يجمع كل ما تحتاجه للتواصل الاجتماعي
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.xl,
    justifyContent: 'center',
    minHeight: '100%',
  },
  rtlContainer: {
    direction: 'rtl',
  },
  languageButton: {
    position: 'absolute',
    top: 50,
    right: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  languageText: {
    marginLeft: spacing.sm,
    color: colors.primary,
    fontWeight: typography.weights.semibold,
    fontSize: typography.sizes.sm,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
    marginTop: spacing.xxxl,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
    position: 'relative',
  },
  imageWrapper: {
    ...shadows.lg,
    borderRadius: borderRadius.full,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: borderRadius.full,
    borderWidth: 4,
    borderColor: colors.card,
  },
  nameBadge: {
    position: 'absolute',
    bottom: -spacing.md,
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 3,
    borderColor: colors.background,
    ...shadows.md,
  },
  nameBadgeText: {
    color: colors.textInverse,
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.base,
  },
  formCard: {
    marginBottom: spacing.xl,
  },
  formHeader: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  welcomeSubtitle: {
    fontSize: typography.sizes.base,
    color: colors.textSecondary,
  },
  rtlText: {
    textAlign: 'right',
  },
  inputContainer: {
    gap: spacing.lg,
  },
  input: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    fontSize: typography.sizes.base,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rtlInput: {
    textAlign: 'right',
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: spacing.lg,
    color: colors.textSecondary,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
  },
  footer: {
    marginTop: spacing.xxxl,
    alignItems: 'center',
  },
  footerText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.lineHeights.relaxed * typography.sizes.sm,
  },
});