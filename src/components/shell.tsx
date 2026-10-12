import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, ClipboardList, House, Martini, ShoppingBag, Wine } from "lucide-react";
import { useState, type ReactNode } from "react";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { PHONE_DISPLAY, WHATSAPP_NUMBER, resolveCart } from "@/lib/catalog";
import { useHydrateLilula, useLilula } from "@/lib/store";

const nav = [
  { to: "/", label: "Home", icon: House },
  { to: "/shop", label: "Spirits", icon: Wine },
  { to: "/bar", label: "Bar", icon: Martini },
  { to: "/story", label: "Story", icon: BookOpen },
  { to: "/orders", label: "Orders", icon: ClipboardList },
] as const;

function isActive(path: string, to: string) {
  if (to === "/") return path === "/";
  if (to === "/shop") return path.startsWith("/shop");
  if (to === "/orders") return path.startsWith("/orders") || path.startsWith("/enquiry");
  return path === to || path.startsWith(`${to}/`);
}

export function Shell({ children }: { children: ReactNode }) {
  const hydrated = useLilula((state) => state.hydrated);
  const ageOk = useLilula((state) => state.ageOk);
  useHydrateLilula();

  if (!hydrated) return <BrandSplash label="Lilula Beverages" />;
  if (!ageOk) return <AgeGate />;

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <Header />
      <main className="mx-auto w-full max-w-5xl px-4 pt-4 pb-28 md:pb-16">{children}</main>
      <Footer />
      <WhatsAppFab />
      <BottomNav />
    </div>
  );
}

function BrandSplash({ label }: { label: string }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-5 bg-bg px-6 text-center">
      <img src="/spirits/lf.webp" alt={label} className="h-28 w-auto" />
      <p className="kicker">Uniquely crafted</p>
    </div>
  );
}

function AgeGate() {
  const confirmAge = useLilula((state) => state.confirmAge);
  const [blocked, setBlocked] = useState(false);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-bg px-6 py-12 text-center">
      <img src="/spirits/lf.webp" alt="Lilula Beverages" className="mb-6 h-24 w-auto" />
      <p className="kicker">South African spirits</p>
      <h1 className="mt-3 font-display text-4xl text-fg">Are you 18 or older?</h1>
      <p className="mt-4 max-w-md text-sm text-muted">
        Lilula sells alcohol. You need to be 18 or older to view the shelf, order bottles,
        or enquire about the mobile bar. Drink responsibly.
      </p>
      {blocked ? (
        <p className="panel mt-6 max-w-md px-4 py-4 text-sm text-fg" role="status">
          We can't take an order. Come back when you are 18.
        </p>
      ) : (
        <div className="mt-8 flex w-full max-w-sm flex-col gap-3">
          <button type="button" className="btn btn-gold" onClick={() => confirmAge()}>
            I am 18 or older
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => setBlocked(true)}>
            I am under 18
          </button>
        </div>
      )}
    </div>
  );
}

function Header() {
  const path = useRouterState({ select: (state) => state.location.pathname });
  const cart = useLilula((state) => state.cart);
  const count = resolveCart(cart).count;

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-bg/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center gap-3 px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src="/spirits/lg.webp" alt="" className="h-10 w-auto" />
          <span className="font-display text-lg leading-none text-leaf">
            LILULA
            <span className="mt-1 block text-xs tracking-widest">BEVERAGES</span>
          </span>
        </Link>
        <nav className="ml-auto hidden items-center gap-5 md:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`text-xs tracking-widest uppercase ${
                isActive(path, item.to) ? "text-gold" : "text-muted"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          to="/cart"
          aria-label={`Bag, ${count} bottles`}
          className="relative ml-auto inline-flex min-h-11 min-w-11 items-center justify-center md:ml-2"
        >
          <ShoppingBag className="size-5" />
          {count > 0 ? (
            <span className="absolute top-1 right-0 flex h-5 min-w-5 items-center justify-center bg-gold px-1 text-xs font-semibold text-ink">
              {count}
            </span>
          ) : null}
        </Link>
      </div>
    </header>
  );
}

function BottomNav() {
  const path = useRouterState({ select: (state) => state.location.pathname });
  const cart = useLilula((state) => state.cart);
  const count = resolveCart(cart).count;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-bg/95 backdrop-blur md:hidden">
      <ul className="mx-auto grid max-w-5xl grid-cols-6">
        {nav.map((item) => {
          const Icon = item.icon;
          const on = isActive(path, item.to);
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`flex min-h-16 flex-col items-center justify-center gap-1 text-xs tracking-wide ${
                  on ? "text-gold" : "text-muted"
                }`}
              >
                <Icon className="size-5" />
                {item.label}
              </Link>
            </li>
          );
        })}
        <li>
          <Link
            to="/cart"
            className={`relative flex min-h-16 flex-col items-center justify-center gap-1 text-xs tracking-wide ${
              path.startsWith("/cart") || path.startsWith("/checkout") ? "text-gold" : "text-muted"
            }`}
          >
            <ShoppingBag className="size-5" />
            Bag
            {count > 0 ? (
              <span className="absolute top-2 right-4 flex h-4 min-w-4 items-center justify-center bg-gold px-1 text-xs font-semibold text-ink">
                {count}
              </span>
            ) : null}
          </Link>
        </li>
      </ul>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line px-4 pt-8 pb-28 text-center text-xs text-muted md:pb-8">
      <img src="/spirits/lf.webp" alt="" className="mx-auto mb-4 h-16 w-auto" />
      <p className="kicker">Uniquely crafted. Uniquely yours.</p>
      <p className="mt-3">
        <a className="text-gold" href={`tel:+${WHATSAPP_NUMBER}`}>
          {PHONE_DISPLAY}
        </a>
      </p>
      <p className="mt-3">Alcohol. 18+. Drink responsibly. Prices are estimates until Lilula confirms.</p>
      <p className="mt-2">© {new Date().getFullYear()} Lilula Beverages.</p>
    </footer>
  );
}
