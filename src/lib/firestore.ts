import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Defect, Decision } from "./demo-data";

export interface InspectionDoc {
  id: string;
  userId: string;
  imageBase64: string;
  defects: Defect[];
  finalDecision: Decision;
  score: number;
  summary: string;
  createdAt: Date;
}

export interface DashboardStats {
  total: number;
  accepted: number;
  review: number;
  rejected: number;
}

/* ─── localStorage helpers (fallback when Firestore rules aren't deployed) ─── */

const LS_KEY = "detectai_inspections";

function getLocalInspections(): InspectionDoc[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as InspectionDoc[];
    return parsed.map((d) => ({
      ...d,
      createdAt: new Date(d.createdAt),
    }));
  } catch {
    return [];
  }
}

function setLocalInspections(docs: InspectionDoc[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(docs));
}

function addLocalInspection(data: Omit<InspectionDoc, "id" | "createdAt">): string {
  const id = "local_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const doc: InspectionDoc = {
    ...data,
    id,
    createdAt: new Date(),
  };
  const all = getLocalInspections();
  all.unshift(doc); // newest first
  setLocalInspections(all);
  return id;
}

/* ─── Public API (Firestore-first with localStorage fallback) ─── */

/** Saves a completed inspection. Tries Firestore, falls back to localStorage. */
export async function saveInspection(
  data: Omit<InspectionDoc, "id" | "createdAt">,
): Promise<string> {
  try {
    const ref = await addDoc(collection(db, "inspections"), {
      ...data,
      createdAt: Timestamp.now(),
    });
    // Also keep a local copy so the report page has instant acces
    const localDoc: InspectionDoc = {
      ...data,
      id: ref.id,
      createdAt: new Date(),
    };
    const all = getLocalInspections();
    all.unshift(localDoc);
    setLocalInspections(all);
    return ref.id;
  } catch (err) {
    console.warn("Firestore save failed, using localStorage fallback:", err);
    return addLocalInspection(data);
  }
}

/** Fetches all inspections for a user, newest first */
export async function getUserInspections(userId: string): Promise<InspectionDoc[]> {
  try {
    const q = query(
      collection(db, "inspections"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
    );
    const snapshot = await getDocs(q);
    const firestoreDocs = snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<InspectionDoc, "id" | "createdAt">),
      createdAt: (d.data().createdAt as Timestamp)?.toDate() ?? new Date(),
    }));
    if (firestoreDocs.length > 0) return firestoreDocs;
    // If Firestore returned nothing, fall through to local
  } catch (err) {
    console.warn("Firestore read failed, using localStorage fallback:", err);
  }
  // Fallback: return local inspections for this user
  return getLocalInspections().filter((d) => d.userId === userId);
}

/** Fetches a single inspection by document ID */
export async function getInspectionById(id: string): Promise<InspectionDoc | null> {
  // Check local cache first (instant, works offline & pre-Firestore-deploy)
  const localAll = getLocalInspections();
  const localMatch = localAll.find((d) => d.id === id);
  if (localMatch) return localMatch;

  // Try Firestore
  try {
    const ref = doc(db, "inspections", id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return {
      id: snap.id,
      ...(snap.data() as Omit<InspectionDoc, "id" | "createdAt">),
      createdAt: (snap.data().createdAt as Timestamp)?.toDate() ?? new Date(),
    };
  } catch (err) {
    console.warn("Firestore getById failed:", err);
    return null;
  }
}

/** Aggregates dashboard stats for a user from their inspection history */
export async function getUserStats(userId: string): Promise<DashboardStats> {
  const inspections = await getUserInspections(userId);
  return {
    total: inspections.length,
    accepted: inspections.filter((i) => i.finalDecision === "ACCEPT").length,
    review: inspections.filter((i) => i.finalDecision === "REVIEW").length,
    rejected: inspections.filter((i) => i.finalDecision === "REJECT").length,
  };
}
