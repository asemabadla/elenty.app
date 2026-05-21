// services/giftStore.ts
import { db } from './firebaseConfig';
import { ref, get, set, runTransaction } from 'firebase/database';

export interface Gift {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  icon: string;
  animationType: 'float' | 'bounce' | 'zoom' | 'explosion' | 'rocket-fly';
}

export const GIFTS: Gift[] = [
  { id: '1', name: 'Rose', nameAr: 'وردة', price: 10, icon: '🌹', animationType: 'float' },
  { id: '2', name: 'Heart', nameAr: 'قلب', price: 50, icon: '💖', animationType: 'bounce' },
  { id: '3', name: 'Crown', nameAr: 'تاج', price: 200, icon: '👑', animationType: 'zoom' },
  { id: '4', name: 'Sports Car', nameAr: 'سيارة رياضية', price: 500, icon: '🏎️', animationType: 'explosion' },
  { id: '5', name: 'Falcon', nameAr: 'صقر جارح', price: 1000, icon: '🦅', animationType: 'explosion' },
  { id: '6', name: 'Rocket', nameAr: 'صاروخ فضائي', price: 2500, icon: '🚀', animationType: 'rocket-fly' },
];

class GiftStoreService {
  /**
   * Fetches the coin balance of a user from Firebase
   */
  async getUserCoins(userId: string): Promise<number> {
    try {
      const balanceRef = ref(db, `wallets/${userId}/coins`);
      const snapshot = await get(balanceRef);
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        // Initialize wallet with 5000 free coins for new users
        await set(balanceRef, 5000);
        return 5000;
      }
    } catch (e) {
      console.error('Failed to get user coins:', e);
      return 5000; // Return mock default coins if Firebase fails
    }
  }

  /**
   * Adds coins to a user's wallet
   */
  async addCoins(userId: string, amount: number): Promise<number> {
    const balanceRef = ref(db, `wallets/${userId}/coins`);
    try {
      let currentCoins = await this.getUserCoins(userId);
      const newBalance = currentCoins + amount;
      await set(balanceRef, newBalance);
      return newBalance;
    } catch (e) {
      console.error('Failed to add coins:', e);
      return amount;
    }
  }

  /**
   * Sends a gift from one user to another during a live stream.
   * Uses Firebase Transactions to prevent race conditions and double-spending.
   */
  async sendGift(
    fromUserId: string,
    fromUsername: string,
    toUserId: string,
    streamId: string,
    giftId: string
  ): Promise<{ success: boolean; error?: string; newBalance?: number; giftTransactionId?: string }> {
    const gift = GIFTS.find(g => g.id === giftId);
    if (!gift) {
      return { success: false, error: 'Gift not found' };
    }

    try {
      const senderWalletRef = ref(db, `wallets/${fromUserId}/coins`);
      let transactionSuccess = false;
      let newBalance = 0;

      // Run Transaction to deduct sender coins securely
      const result = await runTransaction(senderWalletRef, (currentBalance) => {
        const balance = currentBalance === null ? 5000 : currentBalance;
        if (balance < gift.price) {
          return; // Insufficient funds, abort transaction
        }
        newBalance = balance - gift.price;
        return newBalance;
      });

      if (!result.committed) {
        return { success: false, error: 'رصيد العملات غير كافٍ لإتمام عملية الشراء!' };
      }

      // Add coins to recipient's wallet
      const recipientWalletRef = ref(db, `wallets/${toUserId}/coins`);
      await runTransaction(recipientWalletRef, (currentBalance) => {
        const balance = currentBalance === null ? 0 : currentBalance;
        return balance + gift.price;
      });

      // Push gift transaction to stream node
      const giftTxId = `gift_tx_${Date.now()}`;
      const streamGiftsRef = ref(db, `livekit_rooms/${streamId}/gifts/${giftTxId}`);
      await set(streamGiftsRef, {
        id: giftTxId,
        giftId: gift.id,
        giftName: gift.name,
        giftIcon: gift.icon,
        animationType: gift.animationType,
        fromUserId,
        fromUsername,
        timestamp: Date.now(),
      });

      // Add notification or chat message inside the stream
      const chatMessageId = `msg_${Date.now()}`;
      const streamChatRef = ref(db, `livekit_rooms/${streamId}/chat/${chatMessageId}`);
      await set(streamChatRef, {
        id: chatMessageId,
        senderId: 'system',
        senderName: 'إشعار الهدايا',
        message: `${fromUsername} أرسل ${gift.nameAr} ${gift.icon} للمضيف!`,
        timestamp: Date.now(),
        type: 'gift',
      });

      return {
        success: true,
        newBalance,
        giftTransactionId: giftTxId,
      };
    } catch (error: any) {
      console.error('Gift purchase transaction failed:', error);
      return { success: false, error: error.message || 'فشلت المعاملة، حاول مرة أخرى.' };
    }
  }
}

export const giftStoreService = new GiftStoreService();
