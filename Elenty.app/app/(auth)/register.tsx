import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { useLanguageStore } from '@/store/language-store';
import { colors } from '@/constants/colors';
import { ArrowLeft } from 'lucide-react-native';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t, isRTL } = useLanguageStore();
  const router = useRouter();

  const handleRegister = async () => {
    if (!name || !username || !email || !password) {
      return;
    }

    setIsLoading(true);
    try {
      // In a real app, you would call an API to register the user
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push('/login');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
    >
      <ScrollView contentContainerStyle={[styles.scrollContent, isRTL && styles.rtlContainer]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.headerContainer}>
          <Text style={[styles.title, isRTL && styles.rtlText]}>{t('createAccount')}</Text>
          <Text style={[styles.subtitle, isRTL && styles.rtlText]}>انضم إلى إيلينتي اليوم</Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            style={[styles.input, isRTL && styles.rtlInput]}
            placeholder={t('fullName')}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            textAlign={isRTL ? 'right' : 'left'}
          />
          <TextInput
            style={[styles.input, isRTL && styles.rtlInput]}
            placeholder={t('username')}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            textAlign={isRTL ? 'right' : 'left'}
          />
          <TextInput
            style={[styles.input, isRTL && styles.rtlInput]}
            placeholder={t('email')}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            textAlign={isRTL ? 'right' : 'left'}
          />
          <TextInput
            style={[styles.input, isRTL && styles.rtlInput]}
            placeholder={t('password')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            textAlign={isRTL ? 'right' : 'left'}
          />

          <Button
            title={t('register')}
            onPress={handleRegister}
            loading={isLoading}
            style={styles.registerButton}
          />
        </View>

        <View style={styles.termsContainer}>
          <Text style={[styles.termsText, isRTL && styles.rtlText]}>
            بالتسجيل، أنت توافق على{' '}
            <Text style={styles.termsLink}>شروط الخدمة</Text> و{' '}
            <Text style={styles.termsLink}>سياسة الخصوصية</Text>
          </Text>
        </View>

        <View style={[styles.loginContainer, isRTL && styles.rtlLoginContainer]}>
          <Text style={styles.loginText}>{t('alreadyHaveAccount')}</Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={styles.loginLink}>{t('login')}</Text>
          </TouchableOpacity>
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
    padding: 20,
  },
  rtlContainer: {
    direction: 'rtl',
  },
  backButton: {
    marginTop: 40,
    marginBottom: 20,
  },
  headerContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  rtlText: {
    textAlign: 'right',
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 15,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rtlInput: {
    textAlign: 'right',
  },
  registerButton: {
    marginTop: 10,
  },
  termsContainer: {
    marginVertical: 20,
  },
  termsText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    color: colors.primary,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  rtlLoginContainer: {
    flexDirection: 'row-reverse',
  },
  loginText: {
    color: colors.textSecondary,
    marginRight: 5,
  },
  loginLink: {
    color: colors.primary,
    fontWeight: '600',
  },
});