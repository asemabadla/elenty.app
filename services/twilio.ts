// services/twilio.ts
import { db } from './firebaseConfig';
import { ref, push, set } from 'firebase/database';

interface TwilioConfig {
  accountSid?: string;
  authToken?: string;
  phoneNumber?: string;
}

class TwilioService {
  private config: TwilioConfig;

  constructor() {
    this.config = {
      accountSid: process.env.EXPO_PUBLIC_TWILIO_ACCOUNT_SID,
      authToken: process.env.EXPO_PUBLIC_TWILIO_AUTH_TOKEN,
      phoneNumber: process.env.EXPO_PUBLIC_TWILIO_PHONE_NUMBER,
    };
  }

  isConfigured(): boolean {
    return !!(this.config.accountSid && this.config.authToken && this.config.phoneNumber);
  }

  /**
   * Initiates a real Twilio call if credentials exist, otherwise simulates one beautifully.
   * Saves details to Firebase Realtime Database.
   */
  async makeCall(fromUserId: string, toPhoneNumber: string): Promise<{ success: boolean; callId: string; mode: 'twilio' | 'simulation'; error?: string }> {
    const callId = `call_${Date.now()}`;
    const timestamp = Date.now();

    // Log call start to Firebase
    try {
      const callRef = ref(db, `calls/${callId}`);
      await set(callRef, {
        id: callId,
        fromUserId,
        toPhoneNumber,
        type: 'external',
        status: 'initiating',
        timestamp,
        duration: 0,
      });
    } catch (e) {
      console.warn('Firebase connection failed, proceeding with local call state.', e);
    }

    if (this.isConfigured()) {
      try {
        console.log(`[Twilio] Initiating real PSTN call to ${toPhoneNumber} using Twilio...`);
        const url = `https://api.twilio.com/2010-04-01/Accounts/${this.config.accountSid}/Calls.json`;
        
        // Setup basic authorization headers
        const authHeader = 'Basic ' + btoa(`${this.config.accountSid}:${this.config.authToken}`);
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': authHeader,
          },
          body: new URLSearchParams({
            To: toPhoneNumber,
            From: this.config.phoneNumber!,
            Url: 'http://demo.twilio.com/docs/voice.xml', // Demo instructions for Twilio to read
          }).toString(),
        });

        const data = await response.json();

        if (response.ok) {
          // Update status in Firebase to "connected"
          try {
            await set(ref(db, `calls/${callId}/status`), 'connected');
            await set(ref(db, `calls/${callId}/twilioSid`), data.sid);
          } catch (e) {}

          return {
            success: true,
            callId,
            mode: 'twilio',
          };
        } else {
          throw new Error(data.message || 'Twilio API response error');
        }
      } catch (error: any) {
        console.error('[Twilio] Failed to make real Twilio call:', error);
        
        // Update status to failed in Firebase
        try {
          await set(ref(db, `calls/${callId}/status`), 'failed');
          await set(ref(db, `calls/${callId}/error`), error.message || 'Network error');
        } catch (e) {}

        return {
          success: false,
          callId,
          mode: 'twilio',
          error: error.message || 'Twilio calling failed',
        };
      }
    } else {
      // Elegant high-fidelity simulator for demonstration
      console.log(`[Twilio Simulation] No subscription variables found. Simulating Premium VoIP Call to ${toPhoneNumber}...`);
      
      // Update Firebase to simulating
      try {
        await set(ref(db, `calls/${callId}/status`), 'ringing');
      } catch (e) {}

      return {
        success: true,
        callId,
        mode: 'simulation',
      };
    }
  }

  /**
   * Ends call and calculates duration
   */
  async endCall(callId: string, durationSeconds: number): Promise<boolean> {
    try {
      await set(ref(db, `calls/${callId}/status`), 'completed');
      await set(ref(db, `calls/${callId}/duration`), durationSeconds);
      return true;
    } catch (e) {
      console.error('Failed to update ended call in Firebase:', e);
      return false;
    }
  }
}

export const twilioService = new TwilioService();
