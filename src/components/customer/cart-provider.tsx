"use client";
import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import type { Product } from "@/data/products";

export interface CartLine { key: string; productId: string; slug: string; productName: string; image: string; basePrice: number; colorId: string; colorName: string; personalized: boolean; personalizationName: string; quantity: number; unitPrice: number }
type AddLine = { product: Product; colorId: string; personalized: boolean; personalizationName: string; quantity: number; fee: number };
interface Context { lines: CartLine[]; hydrated: boolean; itemCount: number; total: number; addLine: (line: AddLine) => void; increment: (key: string) => void; decrement: (key: string) => void; remove: (key: string) => void }
const STORAGE_KEY = "lunara-customer-cart-v2";
const empty: CartLine[] = [];
const listeners = new Set<() => void>();
let snapshot = empty;
let ready = false;
let storageSubscribed = false;
const context = createContext<Context | null>(null);
const lineKey = (v: Pick<CartLine, "productId" | "colorId" | "personalized" | "personalizationName">) => [v.productId, v.colorId, v.personalized ? `name:${v.personalizationName.trim().toLocaleLowerCase("id-ID")}` : "plain"].join("::");
function read() {
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (!Array.isArray(value)) return [];
    return value.filter((line): line is CartLine => !!line && typeof line === "object" && Number.isInteger((line as CartLine).quantity) && (line as CartLine).quantity > 0 && typeof (line as CartLine).productName === "string").map((line) => ({
      key: lineKey(line), productId: line.productId, slug: line.slug, productName: line.productName, image: line.image,
      basePrice: line.basePrice, colorId: line.colorId, colorName: line.colorName,
      personalized: line.personalized, personalizationName: line.personalizationName, quantity: line.quantity, unitPrice: line.unitPrice,
    }));
  } catch { return []; }
}
function getSnapshot() { if (!ready && typeof window !== "undefined") { snapshot = read(); ready = true; } return snapshot; }
function publish(lines: CartLine[]) { snapshot = lines; ready = true; try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines)); } catch { /* In-memory state remains available. */ } listeners.forEach((fn) => fn()); }
function subscribe(fn: () => void) { listeners.add(fn); if (!storageSubscribed && typeof window !== "undefined") { window.addEventListener("storage", (event) => { if (event.key === STORAGE_KEY) { snapshot = read(); ready = true; listeners.forEach((listener) => listener()); } }); storageSubscribed = true; } return () => listeners.delete(fn); }
export function CartProvider({ children }: { children: ReactNode }) {
  const lines = useSyncExternalStore(subscribe, getSnapshot, () => empty);
  const hydrated = useSyncExternalStore(() => () => undefined, () => true, () => false);
  const addLine = useCallback(({ product, colorId, personalized, personalizationName, quantity, fee }: AddLine) => {
    const color = product.colors.find((item) => item.id === colorId);
    if (!color || quantity < 1 || !Number.isInteger(quantity)) return;
    const name = personalized ? personalizationName.trim().slice(0, 24) : "";
    if (personalized && !name) return;
    const core = { productId: product.id, slug: product.slug, productName: product.name, image: color.image || product.gallery[0] || "", basePrice: product.price, colorId: color.id, colorName: color.name, personalized, personalizationName: name };
    const key = lineKey(core), current = getSnapshot(), existing = current.find((line) => line.key === key);
    publish(existing ? current.map((line) => line.key === key ? { ...line, quantity: line.quantity + quantity } : line) : [...current, { ...core, key, quantity, unitPrice: product.price + (personalized ? fee : 0) }]);
  }, []);
  const increment = useCallback((key: string) => publish(getSnapshot().map((line) => line.key === key ? { ...line, quantity: line.quantity + 1 } : line)), []);
  const decrement = useCallback((key: string) => publish(getSnapshot().flatMap((line) => line.key === key ? (line.quantity <= 1 ? [] : [{ ...line, quantity: line.quantity - 1 }]) : [line])), []);
  const remove = useCallback((key: string) => publish(getSnapshot().filter((line) => line.key !== key)), []);
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0), total = lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
  const value = useMemo(() => ({ lines, hydrated, itemCount, total, addLine, increment, decrement, remove }), [lines, hydrated, itemCount, total, addLine, increment, decrement, remove]);
  return <context.Provider value={value}>{children}</context.Provider>;
}
export function useCart() { const value = useContext(context); if (!value) throw new Error("useCart harus berada di dalam CartProvider."); return value; }
