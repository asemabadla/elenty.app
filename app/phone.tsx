// app/phone.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Phone, Video, Search, Clock, PhoneCall, Shield, Globe } from 'lucide-react-native';
import { Avatar } from '@/components/Avatar';
import { useLanguageStore } from '@/store/language-store';
import { colors } from '@/constants/colors';
import { mockUsers, getCurrentUser } from '@/mocks/users';
import { firebaseDatabase } from '@/services/firebaseDatabase';
import { db } from '@/services/firebaseConfig';
import { ref, get } from 'firebase/database';

export default function PhoneScreen() {
  const [activeTab, setActiveTab] = useState('contacts');
  const [searchQuery, setSearchQuery] = useState('');
  const [dialNumber, setDialNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+966');
  const [callHistory, setCallHistory] = useState<any[]>([]);
  const { t, isRTL } = useLanguageStore();
  const router = useRouter();
  const currentUser = getCurrentUser();

  useEffect(() => {
    // Load call history from Firebase
    const loadCallHistory = async () => {
      try {
        const snap = await get(ref(db, 'calls'));
        if (snap.exists()) {
          const list = Object.values(snap.val()) as any[];
          // Filter history for current user
          const myHistory = list
            .filter(c => c.fromUserId === currentUser.id || c.callerId === currentUser.id)
            .sort((a, b) => b.timestamp - a.timestamp);
          setCallHistory(myHistory);
        }
      } catch (e) {
        console.log('Firebase history fetch offline, showing default mock logs.', e);
        // Fallback mock history
        setCallHistory([
          {
            id: '1',
            toPhoneNumber: '+966500000001',
            status: 'completed',
            type: 'external',
            duration: 125,
            timestamp: Date.now() - 3600000,
          },
          {
            id: '2',
            toPhoneNumber: '+201000000002',
            status: 'failed',
            type: 'external',
            duration: 0,
            timestamp: Date.now() - 7200000,
          }
        ]);
      }
    };

    loadCallHistory();
  }, [activeTab]);

  const filteredUsers = mockUsers.filter(user => 
    user.id !== currentUser.id &&
    (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
     user.phoneId.includes(searchQuery))
  );

  const checkUserRegistration = async (phoneOrId: string): Promise<{ isRegistered: boolean; user?: any }> => {
    try {
      // 1. Check by ID first
      const userRef = ref(db, `users/${phoneOrId}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        return { isRegistered: true, user: snapshot.val() };
      }

      // 2. Check by phone number across all users
      const usersRef = ref(db, 'users');
      const allUsersSnap = await get(usersRef);
      if (allUsersSnap.exists()) {
        const usersList = Object.values(allUsersSnap.val()) as any[];
        const matchedUser = usersList.find(u => u.phoneId === phoneOrId || `${u.countryCode}${u.phoneId}` === phoneOrId);
        if (matchedUser) {
          return { isRegistered: true, user: matchedUser };
        }
      }
    } catch (e) {
      console.warn('Registration check connection error', e);
    }
    return { isRegistered: false };
  };

  const handleVoiceCall = async (userId: string, isFromHistory = false, externalPhone = '') => {
    let targetUser = mockUsers.find(u => u.id === userId);
    
    if (externalPhone) {
      // Dialing direct PSTN phone call
      router.push(`/call/${encodeURIComponent(externalPhone)}?type=voice&isExternal=true`);
      return;
    }

    if (!targetUser) return;

    // Check if recipient has accounts registered inside Firebase
    const check = await checkUserRegistration(targetUser.id);
    
    if (check.isRegistered) {
      // Free WebRTC call inside application
      router.push(`/call/${targetUser.id}?type=voice&isExternal=false`);
    } else {
      // Dial cellular PSTN call via Twilio
      const fullPhone = `${targetUser.countryCode}${targetUser.phoneId}`;
      Alert.alert(
        'اتصال خارجي (Twilio)',
        `المستخدم غير مسجل بالمنصة حالياً. هل ترغب في الاتصال بالرقم الدولي ${fullPhone} عبر اشتراك Twilio المدفوع؟`,
        [
          { text: t('cancel'), style: 'cancel' },
          { 
            text: 'اتصل الآن', 
            onPress: () => router.push(`/call/${targetUser.id}?type=voice&isExternal=true`) 
          }
        ]
      );
    }
  };

  const handleVideoCall = async (userId: string) => {
    const targetUser = mockUsers.find(u => u.id === userId);
    if (!targetUser) return;

    const check = await checkUserRegistration(targetUser.id);

    if (check.isRegistered) {
      // Free WebRTC video call
      router.push(`/call/${targetUser.id}?type=video&isExternal=false`);
    } else {
      Alert.alert(
        'اتصال غير متاح',
        'مكالمات الفيديو الفورية مدعومة فقط بين المشتركين المسجلين في التطبيق حالياً.',
        [{ text: 'حسنًا' }]
      );
    }
  };

  const handleDialCall = async () => {
    if (!dialNumber.trim()) return;
    
    const fullNumber = dialNumber.startsWith('+') ? dialNumber : `${countryCode}${dialNumber}`;
    
    // Check if dial number matches a registered user in Firebase
    const check = await checkUserRegistration(fullNumber);

    if (check.isRegistered && check.user) {
      Alert.alert(
        'مشترك مسجل',
        `الرقم الذي أدخلته ينتمي للمشترك (${check.user.name}). هل تريد إجراء اتصال مجاني داخل التطبيق؟`,
        [
          { 
            text: 'اتصال مجاني داخل التطبيق', 
            onPress: () => router.push(`/call/${check.user.id}?type=voice&isExternal=false`) 
          },
          { 
            text: 'اتصال هاتف عادي (Twilio)', 
            onPress: () => router.push(`/call/${encodeURIComponent(fullNumber)}?type=voice&isExternal=true`) 
          }
        ]
      );
    } else {
      Alert.alert(
        'مكالمة خارجية Twilio',
        `هل تريد الاتصال بالرقم الخارجي ${fullNumber} عبر شبكة Twilio PSTN؟`,
        [
          { text: t('cancel'), style: 'cancel' },
          { 
            text: 'اتصل الآن', 
            onPress: () => router.push(`/call/${encodeURIComponent(fullNumber)}?type=voice&isExternal=true`) 
          }
        ]
      );
    }
  };

  const formatCallDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const renderContactItem = ({ item }: { item: any }) => (
    <View style={[styles.contactItem, isRTL && styles.rtlContactItem]}>
      <Avatar uri={item.avatar} size={50} />
      <View style={[styles.contactInfo, isRTL && styles.rtlContactInfo]}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactPhone}>
          {item.countryCode}{item.phoneId}
        </Text>
        <Text style={styles.contactUsername}>@{item.username}</Text>
      </View>
      <View style={styles.contactActions}>
        <TouchableOpacity
          style={styles.callButton}
          onPress={() => handleVoiceCall(item.id)}
        >
          <Phone size={20} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.callButton}
          onPress={() => handleVideoCall(item.id)}
        >
          <Video size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCallHistoryItem = ({ item }: { item: any }) => {
    const isExternalCall = item.type === 'external' || !item.receiverId;
    const receiverUser = mockUsers.find(u => u.id === item.receiverId || u.id === item.fromUserId);
    const displayName = isExternalCall ? item.toPhoneNumber : (receiverUser?.name || 'مشترك إيلينتي');
    
    return (
      <TouchableOpacity style={[styles.historyItem, isRTL && styles.rtlHistoryItem]}>
        <View style={styles.historyIconContainer}>
          <PhoneCall size={20} color={colors.primary} />
        </View>
        <View style={[styles.historyInfo, isRTL && styles.rtlHistoryInfo]}>
          <Text style={styles.historyName}>{displayName}</Text>
          <View style={styles.historyDetails}>
            <Text style={styles.historyType}>
              {isExternalCall ? 'اتصال خارجي Twilio' : 'اتصال داخلي LiveKit'}
            </Text>
            {item.duration > 0 && (
              <Text style={styles.historyDuration}>
                • مدة المكالمة: {formatCallDuration(item.duration)}
              </Text>
            )}
          </View>
        </View>
        <TouchableOpacity
          style={styles.callBackButton}
          onPress={() => handleVoiceCall(item.receiverId || '', true, isExternalCall ? item.toPhoneNumber : '')}
        >
          <Phone size={18} color={colors.primary} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, isRTL && styles.rtlHeader]}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>لوحة اتصال إيلينتي</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Info status header */}
      <View style={styles.networkStatusHeader}>
        <Shield size={14} color="#34D399" />
        <Text style={styles.networkStatusText}>اتصالات مؤمنة ومدعومة بـ Twilio & LiveKit</Text>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'contacts' && styles.activeTab]}
          onPress={() => setActiveTab('contacts')}
        >
          <Text style={[styles.tabText, activeTab === 'contacts' && styles.activeTabText]}>
            جهات الاتصال
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            سجل المكالمات
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'dial' && styles.activeTab]}
          onPress={() => setActiveTab('dial')}
        >
          <Text style={[styles.tabText, activeTab === 'dial' && styles.activeTabText]}>
            طلب رقم خارجي
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'contacts' && (
        <View style={styles.tabContent}>
          <View style={[styles.searchContainer, isRTL && styles.rtlSearchContainer]}>
            <Search size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, isRTL && styles.rtlSearchInput]}
              placeholder="البحث في جهات الاتصال المسجلة..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              textAlign="right"
            />
          </View>
          <FlatList
            data={filteredUsers}
            keyExtractor={item => item.id}
            renderItem={renderContactItem}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

      {activeTab === 'history' && (
        <View style={styles.tabContent}>
          <FlatList
            data={callHistory}
            keyExtractor={item => item.id}
            renderItem={renderCallHistoryItem}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Clock size={48} color={colors.inactive} />
                <Text style={styles.emptyText}>لا يوجد سجل مكالمات حالياً</Text>
              </View>
            }
          />
        </View>
      )}

      {activeTab === 'dial' && (
        <View style={styles.tabContent}>
          <View style={styles.dialContainer}>
            {/* Country code selector inline */}
            <View style={styles.dialInputsRow}>
              <TextInput
                style={styles.dialNumberInput}
                placeholder="رقم الهاتف بدون أصفار"
                placeholderTextColor={colors.textSecondary}
                value={dialNumber}
                onChangeText={setDialNumber}
                keyboardType="phone-pad"
                textAlign="center"
              />
              <TextInput
                style={styles.countryCodeInput}
                placeholder="+966"
                placeholderTextColor={colors.textSecondary}
                value={countryCode}
                onChangeText={setCountryCode}
                keyboardType="phone-pad"
                textAlign="center"
              />
            </View>

            <TouchableOpacity
              style={[styles.dialButton, !dialNumber.trim() && styles.disabledButton]}
              onPress={handleDialCall}
              disabled={!dialNumber.trim()}
            >
              <Phone size={24} color="white" />
              <Text style={styles.dialButtonText}>إجراء اتصال دولي عبر Twilio</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.dialInfo}>
            <View style={styles.infoRowTitle}>
              <Globe size={18} color={colors.primary} />
              <Text style={styles.dialInfoTitle}>الاتصال بالشبكات الخلوية الدولية</Text>
            </View>
            <Text style={styles.dialInfoText}>
              يتم تحويل المكالمة تلقائياً إلى اتصال خلوي عبر منصة Twilio إن لم يكن الرقم مسجلاً على تطبيق إيلينتي.
            </Text>
            <Text style={styles.dialInfoText}>
              معرّفك الحالي للاتصال: {currentUser.countryCode} {currentUser.phoneId}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  rtlHeader: {
    flexDirection: 'row',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  networkStatusHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(52, 211, 153, 0.2)',
  },
  networkStatusText: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '600',
    marginRight: 6,
  },
  tabsContainer: {
    flexDirection: 'row-reverse',
    backgroundColor: colors.card,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 2.5,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '700',
  },
  tabContent: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 10,
    paddingHorizontal: 12,
    margin: 16,
    height: 44,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  rtlSearchContainer: {
    flexDirection: 'row',
  },
  searchInput: {
    flex: 1,
    marginRight: 8,
    fontSize: 14,
    color: colors.text,
  },
  rtlSearchInput: {
    marginRight: 0,
    marginLeft: 8,
  },
  contactItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
    backgroundColor: colors.card,
  },
  rtlContactItem: {
    flexDirection: 'row',
  },
  contactInfo: {
    flex: 1,
    marginRight: 12,
    alignItems: 'flex-end',
  },
  rtlContactInfo: {
    marginRight: 0,
    marginLeft: 12,
    alignItems: 'flex-start',
  },
  contactName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  contactPhone: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  contactUsername: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  contactActions: {
    flexDirection: 'row',
  },
  callButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 64, 129, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  historyItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
    backgroundColor: colors.card,
  },
  rtlHistoryItem: {
    flexDirection: 'row',
  },
  historyIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 64, 129, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyInfo: {
    flex: 1,
    marginRight: 12,
    alignItems: 'flex-end',
  },
  rtlHistoryInfo: {
    marginRight: 0,
    marginLeft: 12,
    alignItems: 'flex-start',
  },
  historyName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  historyDetails: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginTop: 4,
  },
  historyType: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  historyDuration: {
    fontSize: 11,
    color: colors.textSecondary,
    marginRight: 6,
  },
  callBackButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 64, 129, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialContainer: {
    padding: 20,
  },
  dialInputsRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  countryCodeInput: {
    width: 70,
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  dialNumberInput: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dialButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: colors.inactive,
  },
  dialButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
  dialInfo: {
    padding: 20,
    backgroundColor: colors.card,
    margin: 20,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  infoRowTitle: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 8,
  },
  dialInfoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginRight: 8,
  },
  dialInfoText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 4,
    textAlign: 'right',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyText: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: 16,
  },
});