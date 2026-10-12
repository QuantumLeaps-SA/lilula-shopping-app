import { useEffect } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { BottleOrder, BarEnquiry, ContactDetails } from "@/lib/records";

type CartLine = { productId: string; qty: number };

type LilulaState = {
  hydrated: boolean;
  ageOk: boolean;
  cart: CartLine[];
  orders: BottleOrder[];
  enquiries: BarEnquiry[];
  contact: ContactDetails;
  add: (productId: string, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  confirmAge: () => void;
  placeOrder: (order: BottleOrder) => void;
  placeEnquiry: (enquiry: BarEnquiry) => void;
  markOrderWhatsapp: (id: string) => void;
  markEnquiryWhatsapp: (id: string) => void;
  rememberContact: (contact: ContactDetails) => void;
};

const emptyContact: ContactDetails = { name: "", phone: "", address: "" };

export const useLilula = create<LilulaState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      ageOk: false,
      cart: [],
      orders: [],
      enquiries: [],
      contact: emptyContact,
      confirmAge: () => set({ ageOk: true }),
      add: (productId, qty = 1) => {
        const cart = get().cart;
        const existing = cart.find((line) => line.productId === productId);
        const nextQty = Math.min(24, (existing?.qty ?? 0) + qty);
        set({
          cart: existing
            ? cart.map((line) =>
                line.productId === productId ? { ...line, qty: nextQty } : line,
              )
            : [...cart, { productId, qty: nextQty }],
        });
      },
      setQty: (productId, qty) => {
        if (qty <= 0) {
          set({ cart: get().cart.filter((line) => line.productId !== productId) });
          return;
        }
        set({
          cart: get().cart.map((line) =>
            line.productId === productId ? { ...line, qty: Math.min(24, qty) } : line,
          ),
        });
      },
      clearCart: () => set({ cart: [] }),
      placeOrder: (order) => set({ orders: [order, ...get().orders], cart: [] }),
      placeEnquiry: (enquiry) => set({ enquiries: [enquiry, ...get().enquiries] }),
      markOrderWhatsapp: (id) =>
        set({
          orders: get().orders.map((order) =>
            order.id === id ? { ...order, whatsappOpened: true } : order,
          ),
        }),
      markEnquiryWhatsapp: (id) =>
        set({
          enquiries: get().enquiries.map((enquiry) =>
            enquiry.id === id ? { ...enquiry, whatsappOpened: true } : enquiry,
          ),
        }),
      rememberContact: (contact) => set({ contact }),
    }),
    {
      name: "lilula-orders-v1",
      skipHydration: true,
      storage: createJSONStorage(() =>
        typeof window === "undefined"
          ? {
              getItem: () => null,
              setItem: () => undefined,
              removeItem: () => undefined,
            }
          : localStorage,
      ),
      partialize: (state) => ({
        ageOk: state.ageOk,
        cart: state.cart,
        orders: state.orders,
        enquiries: state.enquiries,
        contact: state.contact,
      }),
    },
  ),
);

export function useHydrateLilula() {
  useEffect(() => {
    let active = true;
    const finish = () => {
      if (active) useLilula.setState({ hydrated: true });
    };
    const pending = useLilula.persist.rehydrate();
    void Promise.resolve(pending).then(finish, finish);
    return () => {
      active = false;
    };
  }, []);
}

export function makeRef(prefix: string) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let body = "";
  for (let index = 0; index < 4; index += 1) {
    body += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `${prefix}-${body}`;
}
