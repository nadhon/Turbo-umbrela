import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase.js";

export async function listarFilmes() {
  const snap = await getDocs(collection(db, "filmes"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
export async function adicionarFilme(payload) { return await addDoc(collection(db, "filmes"), { ...payload, createdAt: new Date().toISOString() }); }
export async function editarFilme(id, changes) { await updateDoc(doc(db, "filmes", id), changes); }
export async function deletarFilme(id) { await deleteDoc(doc(db, "filmes", id)); }
