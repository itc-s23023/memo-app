// lib/auth.ts

import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { getFirestore, setDoc, doc, serverTimestamp } from "firebase/firestore";

// Firestore 初期化
const db = getFirestore();


// メール/パスワードで新規登録 + Firestore にユーザー情報を保存
export const signUp = async (email: string, password: string, name: string) => {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", cred.user.uid), {
      id: cred.user.uid,
      email: cred.user.email,
      name: name || "初期名",
      createdAt: serverTimestamp(),
    });
    return cred;
  } catch (error) {
    // 必要に応じてエラー内容を加工して返す
    throw error;
  }
};

// メールでログイン
export const login = async (email: string, password: string) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw error;
  }
};


// Googleログイン + Firestore にユーザー情報を保存（初回のみ）
export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    // Firestore にユーザー情報がなければ作成
    const userRef = doc(db, "users", cred.user.uid);
    const { getDoc } = await import("firebase/firestore");
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        id: cred.user.uid,
        email: cred.user.email,
        name: cred.user.displayName || "Googleユーザー",
        createdAt: serverTimestamp(),
      });
    }
    return cred;
  } catch (error) {
    throw error;
  }
};

// ログアウト
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};
