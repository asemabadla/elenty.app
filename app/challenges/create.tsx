import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Sparkles, Image as ImageIcon, Check } from 'lucide-react-native';
import { colors, spacing, borderRadius } from '@/constants/colors';
import { Button } from '@/components/Button';

export default function CreateChallengeScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hashtag, setHashtag] = useState('');
  const [category, setCategory] = useState('entertainment');

  const categories = [
    { id: 'entertainment', name: 'ترفيه' },
    { id: 'dance', name: 'رقص' },
    { id: 'cooking', name: 'طبخ' },
    { id: 'sports', name: 'رياضة' },
    { id: 'art', name: 'رسم وفنون' },
  ];

  const handleCreate = () => {
    if (!title.trim() || !description.trim() || !hashtag.trim()) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const formattedHashtag = hashtag.startsWith('#') ? hashtag : `#${hashtag}`;

    // Simulate saving the challenge
    Alert.alert('نجاح', 'تم إنشاء التحدي بنجاح!', [
      {
        text: 'حسنًا',
        onPress: () => {
          router.replace('/challenges');
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>إنشاء تحدي جديد</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.illustrationCard}>
          <Sparkles size={40} color={colors.secondary} />
          <Text style={styles.illustrationTitle}>ابدأ ترند جديد اليوم! ✨</Text>
          <Text style={styles.illustrationSubtitle}>
            أنشئ تحديًا وادعُ أصدقاءك والمتابعين للمشاركة بفيديوهاتهم الإبداعية.
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>عنوان التحدي *</Text>
          <TextInput
            style={styles.input}
            placeholder="مثال: تحدي الطبخ السريع"
            placeholderTextColor={colors.textTertiary}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>الوصف *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="اكتب تفاصيل التحدي والشروط والقواعد..."
            placeholderTextColor={colors.textTertiary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>الهاشتاق *</Text>
          <TextInput
            style={styles.input}
            placeholder="مثال: #تحدي_الطبخ"
            placeholderTextColor={colors.textTertiary}
            value={hashtag}
            onChangeText={(text) => setHashtag(text.replace(/\s+/g, '_'))}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>التصنيف</Text>
          <View style={styles.categoriesContainer}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryBadge,
                  category === cat.id && styles.categoryBadgeActive,
                ]}
                onPress={() => setCategory(cat.id)}
              >
                {category === cat.id && <Check size={14} color="white" style={styles.checkIcon} />}
                <Text
                  style={[
                    styles.categoryText,
                    category === cat.id && styles.categoryTextActive,
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.uploadCard} activeOpacity={0.8}>
          <ImageIcon size={32} color={colors.primary} />
          <Text style={styles.uploadText}>إضافة صورة غلاف التحدي</Text>
          <Text style={styles.uploadSubtext}>اختياري (يفضل أبعاد 16:9)</Text>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <Button title="نشر التحدي الآن" onPress={handleCreate} />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
    paddingTop: Platform.OS === 'ios' ? 50 : spacing.lg,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  illustrationCard: {
    backgroundColor: `${colors.secondary}10`,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: `${colors.secondary}20`,
  },
  illustrationTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  illustrationSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'right',
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 15,
    color: colors.text,
    textAlign: 'right',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  categoriesContainer: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
  },
  categoryBadgeActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkIcon: {
    marginLeft: 4,
  },
  categoryText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  categoryTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  uploadCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.sm,
  },
  uploadSubtext: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 2,
  },
  buttonContainer: {
    marginTop: spacing.md,
  },
});
