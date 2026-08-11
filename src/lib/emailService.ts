import { db, collection, addDoc } from './firebase';

export const ADMIN_TARGET_EMAIL = 'swaritshukla125@gmail.com';

export interface EmailNotification {
  id?: string;
  to: string;
  type: 'NEW_USER_SIGNUP' | 'NEW_REVIEW' | 'GOLA_ORDER';
  subject: string;
  body: string;
  details: Record<string, any>;
  createdAt: string;
  status: 'sent' | 'pending';
}

/**
 * Dispatches an email notification log to Firestore and triggers console alert for target admin email.
 */
export async function sendAdminEmailNotification(
  type: 'NEW_USER_SIGNUP' | 'NEW_REVIEW' | 'GOLA_ORDER',
  subject: string,
  body: string,
  details: Record<string, any>
): Promise<void> {
  const notification: Omit<EmailNotification, 'id'> = {
    to: ADMIN_TARGET_EMAIL,
    type,
    subject,
    body,
    details,
    createdAt: new Date().toISOString(),
    status: 'sent'
  };

  try {
    await addDoc(collection(db, 'email_notifications'), notification);
    console.log(`[EMAIL DISPATCH TO ${ADMIN_TARGET_EMAIL}]:`, subject, body, details);
  } catch (error) {
    console.error('Failed to log email notification to Firestore:', error);
  }
}
