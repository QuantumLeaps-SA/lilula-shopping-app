export const WHATSAPP_NUMBER = "27645440101";
export const PHONE_DISPLAY = "+27 64 544 0101";
export const CONTACT_NAME = "Mohomotsi";

/** Price in rand of one 750 ml bottle. The shelf and the mobile bar page both use it. */
export const BOTTLE_PRICE = 199;

export type Category = "Gin" | "Vodka";

export type Product = {
  id: string;
  name: string;
  category: Category;
  flavour: string;
  tagline: string;
  description: string;
  price: number;
  abv: string;
  volume: string;
  image: string;
};

export const products: Product[] = [
  {
    id: "og",
    name: "Unique Gin Original",
    category: "Gin",
    flavour: "Original",
    tagline: "Smooth. Classic. Uniquely crafted.",
    description:
      "A smooth botanical gin for premium occasions. Produced and packed in South Africa.",
    price: BOTTLE_PRICE,
    abv: "43%",
    volume: "750 ml",
    image: "/spirits/og.webp",
  },
  {
    id: "wm",
    name: "Unique Gin Watermelon",
    category: "Gin",
    flavour: "Watermelon",
    tagline: "Juicy. Refreshing. Uniquely bold.",
    description:
      "Refreshing and vibrant, with sweet watermelon aroma over handcrafted botanicals.",
    price: BOTTLE_PRICE,
    abv: "43%",
    volume: "750 ml",
    image: "/spirits/wm.webp",
  },
  {
    id: "or",
    name: "Unique Gin Orange",
    category: "Gin",
    flavour: "Orange",
    tagline: "Citrus fresh. Naturally unique.",
    description: "Bright citrus notes with a clean, luxurious finish.",
    price: BOTTLE_PRICE,
    abv: "43%",
    volume: "750 ml",
    image: "/spirits/or.webp",
  },
  {
    id: "rb",
    name: "Unique Gin Raspberry",
    category: "Gin",
    flavour: "Raspberry",
    tagline: "Smooth. Fruity. Perfectly balanced.",
    description: "Rich berry flavour balanced with the Unique Gin botanical base.",
    price: BOTTLE_PRICE,
    abv: "43%",
    volume: "750 ml",
    image: "/spirits/rb.webp",
  },
  {
    id: "bl",
    name: "Unique Gin Blueberry",
    category: "Gin",
    flavour: "Blueberry",
    tagline: "Rich. Smooth. Distinctly unique.",
    description: "Deep fruit character with a silky finish.",
    price: BOTTLE_PRICE,
    abv: "43%",
    volume: "750 ml",
    image: "/spirits/bl.webp",
  },
  {
    id: "vd",
    name: "Toffolux Vodka",
    category: "Vodka",
    flavour: "Toffolux",
    tagline: "Triple filtered. Exceptionally smooth.",
    description:
      "Premium vodka for celebrations, produced and packed in South Africa.",
    price: BOTTLE_PRICE,
    abv: "43%",
    volume: "750 ml",
    image: "/spirits/vd.webp",
  },
];

export type BarPackage = {
  id: string;
  name: string;
  price: number;
  pitch: string;
  includes: string[];
};

export const barPackages: BarPackage[] = [
  {
    id: "ultimate",
    name: "The Ultimate Experience",
    price: 15000,
    pitch: "A mixologist, cocktails, and a bottomless bar.",
    includes: [
      "Mixologist for cocktails",
      "Shots — gin, brandy and tequila",
      "24 hour service",
      "Bottomless",
    ],
  },
  {
    id: "nonstop",
    name: "Great Drinks. Non-Stop.",
    price: 10000,
    pitch: "Bottomless shots and all-day service.",
    includes: ["Shots — gin, brandy and tequila", "24 hour service", "Bottomless"],
  },
];

export const eventTypes = [
  "Wedding",
  "Birthday",
  "Corporate event",
  "Festival",
  "Private party",
  "Other",
] as const;

export const barShots = [
  { name: "Original", price: 20 },
  { name: "Watermelon", price: 20 },
  { name: "Orange", price: 20 },
  { name: "Raspberry", price: 20 },
  { name: "Blueberry", price: 20 },
  { name: "Toffolux Vodka", price: 20 },
];

export const barCocktails = [
  { name: "Gin & Tonic", price: 50 },
  { name: "Gin Splash", price: 60 },
  { name: "Citrus Gin Fizz", price: 60 },
  { name: "Berry Bliss", price: 60 },
  { name: "Watermelon Cooler", price: 60 },
  { name: "Lilula Signature", price: 70 },
  { name: "Toffolux Vodka Mix", price: 60 },
];

export function rands(amount: number) {
  return `R${amount.toLocaleString("en-ZA")}`;
}

export function productById(id: string) {
  return products.find((product) => product.id === id);
}

export function packageById(id: string) {
  return barPackages.find((item) => item.id === id);
}

export function whatsappHref(text: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function resolveCart(cart: { productId: string; qty: number }[]) {
  const lines: { product: Product; qty: number; lineTotal: number }[] = [];
  for (const line of cart) {
    const product = productById(line.productId);
    if (!product) continue;
    lines.push({
      product,
      qty: line.qty,
      lineTotal: product.price * line.qty,
    });
  }
  const estimate = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  return { lines, estimate, count: lines.reduce((sum, line) => sum + line.qty, 0) };
}

export function prettyDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return isoDate;
  return new Intl.DateTimeFormat("en-ZA", { dateStyle: "long" }).format(
    new Date(year, month - 1, day),
  );
}

export function formatWhen(iso: string) {
  return new Intl.DateTimeFormat("en-ZA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}
