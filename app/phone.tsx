import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Phone, Video, Search, Clock, PhoneCall } from 'lucide-react-native';
import { Avatar } from '@/components/Avatar';
import { useLanguageStore } from '@/store/language-store';
import { colors } from '@/constants/colors';
import { mockUsers, getCurrentUser } from '@/mocks/users';

// Mock call history
const mockCallHistory = [
  {
    id: '1',
    userId: '2',
    type: 'outgoing',
    callType: 'voice',
    timestamp: Date.now() - 3600000,
    duration: 125,
    status: 'completed',
  },
  {
    id: '2',
    userId: '3',
    type: 'incoming',
    callType: 'video',
    timestamp: Date.now() - 7200000,
    duration: 0,
    status: 'missed',
  },
  {
    id: '3',
    userId: '4',
    type: 'outgoing',
    callType: 'voice',
    timestamp: Date.now() - 86400000,
    duration: 67,
    status: 'completed',
  },
];

export default function PhoneScreen() {
  const [activeTab, setActiveTab] = useState('contacts');
  const [searchQuery, setSearchQuery] = useState('');
  const [dialNumber, setDialNumber] = useState('');
  const { t, isRTL } = useLanguageStore();
  const router = useRouter();
  const currentUser = getCurrentUser();

  const filteredUsers = mockUsers.filter(user => 
    user.id !== currentUser.id &&
    (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
     user.phoneId.includes(searchQuery))
  );

  const handleVoiceCall = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    Alert.alert(
      t('voiceCall'),
      `${t('call')} ${user?.name} (${user?.countryCode}${user?.phoneId})...`,
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('call'), onPress: () => initiateCall(userId, 'voice') }
      ]
    );
  };

  const handleVideoCall = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    Alert.alert(
      t('videoCall'),
      `${t('videoCall')} ${user?.name} (${user?.countryCode}${user?.phoneId})...`,
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('call'), onPress: () => initiateCall(userId, 'video') }
      ]
    );
  };

  const initiateCall = (userId: string, type: 'voice' | 'video') => {
    // In a real app, this would initiate the actual call
    router.push(`/call/${userId}?type=${type}`);
  };

  const handleDialCall = () => {
    if (!dialNumber.trim()) return;
    
    Alert.alert(
      'مكالمة خارجية',
      `الاتصال بـ ${dialNumber}...`,
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('call'), onPress: () => {
          // In a real app, this would make an external call
          Alert.alert('تم بدء المكالمة', `الاتصال بـ ${dialNumber} عبر شبكة الهاتف المحمول`);
        }}
      ]
    );
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
    const user = mockUsers.find(u => u.id === item.userId);
    const isIncoming = item.type === 'incoming';
    const isMissed = item.status === 'missed';
    
    return (
      <TouchableOpacity style={[styles.historyItem, isRTL && styles.rtlHistoryItem]}>
        <Avatar uri={user?.avatar || ''} size={45} />
        <View style={[styles.historyInfo, isRTL && styles.rtlHistoryInfo]}>
          <Text style={styles.historyName}>{user?.name}</Text>
          <View style={styles.historyDetails}>
            <PhoneCall 
              size={12} 
              color={isMissed ? colors.notification : colors.textSecondary} 
            />
            <Text style={[
              styles.historyType,
              isMissed && styles.missedCall
            ]}>
              {isIncoming ? 'واردة' : 'صادرة'} {item.callType === 'video' ? 'فيديو' : 'صوتية'}
            </Text>
            {item.duration > 0 && (
              <Text style={styles.historyDuration}>
                • {formatCallDuration(item.duration)}
              </Text>
            )}
          </View>
        </View>
        <TouchableOpacity
          style={styles.callBackButton}
          onPress={() => handleVoiceCall(item.userId)}
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
        <Text style={styles.headerTitle}>{t('phoneTitle')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'contacts' && styles.activeTab]}
          onPress={() => setActiveTab('contacts')}
        >
          <Text style={[styles.tabText, activeTab === 'contacts' && styles.activeTabText]}>
            {t('contacts')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            {t('history')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'dial' && styles.activeTab]}
          onPress={() => setActiveTab('dial')}
        >
          <Text style={[styles.tabText, activeTab === 'dial' && styles.activeTabText]}>
            {t('dial')}
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'contacts' && (
        <View style={styles.tabContent}>
          <View style={[styles.searchContainer, isRTL && styles.rtlSearchContainer]}>
            <Search size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, isRTL && styles.rtlSearchInput]}
              placeholder="البحث في جهات الاتصال..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              textAlign={isRTL ? 'right' : 'left'}
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
            data={mockCallHistory}
            keyExtractor={item => item.id}
            renderItem={renderCallHistoryItem}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Clock size={48} color={colors.inactive} />
                <Text style={styles.emptyText}>لا يوجد سجل مكالمات</Text>
              </View>
            }
          />
        </View>
      )}

      {activeTab === 'dial' && (
        <View style={styles.tabContent}>
          <View style={styles.dialContainer}>
            <TextInput
              style={[styles.dialInput, isRTL && styles.rtlDialInput]}
              placeholder="أدخل رقم الهاتف"
              value={dialNumber}
              onChangeText={setDialNumber}
              keyboardType="phone-pad"
              textAlign={isRTL ? 'right' : 'center'}
            />
            <TouchableOpacity
              style={[styles.dialButton, !dialNumber.trim() && styles.disabledButton]}
              onPress={handleDialCall}
              disabled={!dialNumber.trim()}
            >
              <Phone size={24} color="white" />
              <Text style={styles.dialButtonText}>{t('call')}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.dialInfo}>
            <Text style={styles.dialInfoTitle}>المكالمات الدولية</Text>
            <Text style={styles.dialInfoText}>
              قم بإجراء مكالمات إلى أرقام الهواتف المحمولة والثابتة في جميع أنحاء العالم باستخدام رقم إيلينتي الخاص بك.
            </Text>
            <Text style={styles.dialInfoText}>
              رقمك التعريفي: {currentUser.countryCode}{currentUser.phoneId}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  rtlHeader: {
    flexDirection: 'row-reverse',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    margin: 16,
    height: 40,
  },
  rtlSearchContainer: {
    flexDirection: 'row-reverse',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: colors.text,
  },
  rtlSearchInput: {
    marginLeft: 0,
    marginRight: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  rtlContactItem: {
    flexDirection: 'row-reverse',
  },
  contactInfo: {
    flex: 1,
    marginLeft: 12,
  },
  rtlContactInfo: {
    marginLeft: 0,
    marginRight: 12,
    alignItems: 'flex-end',
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  contactPhone: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  contactUsername: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  contactActions: {
    flexDirection: 'row',
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  rtlHistoryItem: {
    flexDirection: 'row-reverse',
  },
  historyInfo: {
    flex: 1,
    marginLeft: 12,
  },
  rtlHistoryInfo: {
    marginLeft: 0,
    marginRight: 12,
    alignItems: 'flex-end',
  },
  historyName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  historyDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  historyType: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  missedCall: {
    color: colors.notification,
  },
  historyDuration: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  callBackButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialContainer: {
    padding: 20,
  },
  dialInput: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    fontSize: 18,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  rtlDialInput: {
    textAlign: 'right',
  },
  dialButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: colors.inactive,
  },
  dialButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  dialInfo: {
    padding: 20,
    backgroundColor: colors.card,
    margin: 20,
    borderRadius: 12,
  },
  dialInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'right',
  },
  dialInfoText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 4,
    textAlign: 'right',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
  },
});