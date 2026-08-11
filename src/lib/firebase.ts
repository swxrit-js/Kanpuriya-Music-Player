import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { User } from '../types';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Designated admin email check (swaritshukla125@gmail.com is primary admin)
export const ADMIN_EMAIL = 'swaritshukla125@gmail.com';

export function isEmailAdmin(email?: string | null): boolean {
  if (!email) return false;
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase() || email.toLowerCase().includes('admin@');
}

// Map Firebase User & Firestore User Document to App User
export async function syncUserProfile(fbUser: FirebaseUser, displayNameInput?: string): Promise<User> {
  const userDocRef = doc(db, 'users', fbUser.uid);
  const userDoc = await getDoc(userDocRef);

  const isAdmin = isEmailAdmin(fbUser.email);
  const name = displayNameInput || fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0] : 'Desi Guest');
  const avatar = fbUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${fbUser.uid}`;

  if (userDoc.exists()) {
    const data = userDoc.data();
    const updatedUser: User = {
      id: fbUser.uid,
      name: data.name || name,
      email: fbUser.email || '',
      avatar: data.avatar || avatar,
      role: isAdmin ? 'admin' : (data.role || 'user'),
      favorites: data.favorites || [],
      favoriteGolas: data.favoriteGolas || [],
      savedGolas: data.savedGolas || [],
      playlists: data.playlists || [],
      listeningHistory: data.listeningHistory || []
    };
    
    // Ensure admin email is always upgraded to role 'admin'
    if (isAdmin && data.role !== 'admin') {
      await updateDoc(userDocRef, { role: 'admin' });
    }

    return updatedUser;
  } else {
    // Create new profile doc in Firestore
    const newUser: User = {
      id: fbUser.uid,
      name,
      email: fbUser.email || '',
      avatar,
      role: isAdmin ? 'admin' : 'user',
      favorites: [],
      favoriteGolas: [],
      savedGolas: [],
      playlists: [],
      listeningHistory: []
    };

    await setDoc(userDocRef, {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      avatar: newUser.avatar,
      role: newUser.role,
      favorites: [],
      favoriteGolas: [],
      createdAt: new Date().toISOString()
    });

    // Notify admin email swaritshukla125@gmail.com about new user signup
    try {
      const { sendAdminEmailNotification } = await import('./emailService');
      await sendAdminEmailNotification(
        'NEW_USER_SIGNUP',
        `New User Registration: ${newUser.name} (${newUser.email || 'No email'})`,
        `A new user has signed up on Kanpuria Barf Ka Gola!\n\nUser Name: ${newUser.name}\nEmail: ${newUser.email}\nUser ID: ${newUser.id}\nRole: ${newUser.role}\nSigned Up At: ${new Date().toLocaleString()}`,
        { userId: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
      );
    } catch (e) {
      console.log("Email dispatch notification log:", e);
    }

    return newUser;
  }
}

export { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  updateProfile,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot
};
