export type ContactDetails = {
  name: string;
  phone: string;
  address: string;
};

export type OrderItem = {
  productId: string;
  name: string;
  qty: number;
  unitPrice: number;
};

export type BottleOrder = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  fulfilment: "delivery" | "collection";
  address: string;
  notes: string;
  items: OrderItem[];
  estimate: number;
  whatsappOpened: boolean;
};

export type BarEnquiry = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  eventType: string;
  packageId: string;
  packageName: string;
  guests: number;
  date: string;
  venue: string;
  notes: string;
  estimate: number;
  whatsappOpened: boolean;
};
