import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebase.js";

export async function cadastrarUsuario(email, senha, extra = {}) {
  const cred = await createUserWithEmailAndPassword(auth, email, senha);
  await setDoc(doc(db, "users", cred.user.uid), { email, role: "cliente", createdAt: new Date().toISOString(), ...extra });
  return cred.user;
}
export async function loginUsuario(email, senha) { return (await signInWithEmailAndPassword(auth, email, senha)).user; }
export async function logoutUsuario() { await signOut(auth); }
