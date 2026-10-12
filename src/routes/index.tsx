import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle, ShieldCheck, Wine } from "lucide-react";
import type { ReactNode } from "react";
import { products, rands } from "@/lib/catalog";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <div className="flex flex-col gap-12">
      <section className="grid items-center gap-8 md:grid-cols-2">
        <div>
          <p className="kicker">Crafted for</p>
          <h1 className="mt-2 font-display text-5xl leading-none text-fg md:text-6xl">Distinction.</h1>
          <p className="kicker mt-4">Poured for</p>
          <p className="mt-2 font-display text-4xl leading-none text-fg">Celebration.</p>
          <p className="mt-5 max-w-md text-sm text-muted">
            Unique Gin in five flavours, and Toffolux Vodka. Build an order here. Lilula
            confirms the total and how you pay on WhatsApp — nothing is charged in the app.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link to="/shop" className="btn btn-gold">
              Shop the shelf
            </Link>
            <Link to="/bar" className="btn btn-ghost">
              Book the mobile bar
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {products.map((product) => (
            <Link
              key={product.id}
              to="/shop/$productId"
              params={{ productId: product.id }}
              className="panel flex flex-col items-center px-2 pt-3 pb-3"
            >
              <img src={product.image} alt="" className="h-36 w-auto object-contain md:h-44" />
              <span className="mt-2 text-center text-xs tracking-wide text-muted">{product.flavour}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <Step icon={<Wine className="size-5" />} title="Choose" text="Bottles for delivery or collection, or a mobile bar package." />
        <Step icon={<MessageCircle className="size-5" />} title="WhatsApp" text="Your order is saved on this phone, then opened in a message to Lilula." />
        <Step icon={<ShieldCheck className="size-5" />} title="Confirm" text="Lilula checks stock, the final amount, and payment before anything moves." />
      </section>

      <section>
        <div className="text-center">
          <p className="kicker">The shelf</p>
          <h2 className="mt-2 font-display text-3xl tracking-wide">Exceptionally crafted</h2>
          <span className="rule mt-3" />
        </div>
        <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
          {products.map((product) => (
            <li key={product.id}>
              <Link to="/shop/$productId" params={{ productId: product.id }} className="panel flex h-full flex-col">
                <span className="flex h-48 items-end justify-center bg-bg px-3 pt-4">
                  <img src={product.image} alt="" className="h-44 w-auto object-contain" />
                </span>
                <span className="flex flex-1 flex-col gap-1 p-3">
                  <span className="text-xs tracking-widest text-muted uppercase">{product.category}</span>
                  <span className="font-display text-lg leading-tight">{product.flavour}</span>
                  <span className="mt-auto pt-2 font-display text-gold">{rands(product.price)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-5 text-center">
          <Link to="/shop" className="btn btn-ghost">
            Order bottles
          </Link>
        </div>
      </section>

      <section className="relative overflow-hidden border border-line">
        <img src="/spirits/bar.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-bg/75" />
        <div className="relative px-5 py-10 md:px-10">
          <p className="kicker">Mobile bar</p>
          <h2 className="mt-2 max-w-md font-display text-4xl text-gold-2">We bring the bar to you.</h2>
          <p className="mt-3 max-w-md text-sm text-fg">
            Weddings, birthdays, corporate events, festivals and private parties. Packages from{" "}
            {rands(10000)}. Lilula confirms the quotation.
          </p>
          <Link to="/bar" className="btn btn-gold mt-6">
            Request a quotation
          </Link>
        </div>
      </section>

      <section className="text-center">
        <img src="/spirits/lf.webp" alt="" className="mx-auto h-24 w-auto" />
        <p className="kicker mt-4">Our story</p>
        <h2 className="mt-2 font-display text-3xl">Rooted in passion</h2>
        <span className="rule mt-3" />
        <p className="mx-auto mt-4 max-w-2xl text-sm text-muted">
          Lilula Beverages is a South African drinks brand. We craft Unique Gin in five flavours
          alongside Toffolux Vodka, all produced and packed in South Africa, and we bring the bar
          to your venue. Roger founded the house. Mohomotsi Mabula is IT and partner.
        </p>
        <Link to="/story" className="btn btn-ghost mt-6">
          Read our story
        </Link>
      </section>
    </div>
  );
}

function Step({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <article className="panel px-4 py-4">
      <span className="text-gold">{icon}</span>
      <h2 className="mt-3 font-display text-xl">{title}</h2>
      <p className="mt-2 text-sm text-muted">{text}</p>
    </article>
  );
}
