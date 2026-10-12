import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent, type ReactNode } from "react";
import { rands, resolveCart } from "@/lib/catalog";
import { makeRef, useLilula } from "@/lib/store";

export const Route = createFileRoute("/checkout")({ component: CheckoutPage });

type Fulfilment = "delivery" | "collection";

function CheckoutPage() {
  const cart = useLilula((state) => state.cart);
  const contact = useLilula((state) => state.contact);
  const placeOrder = useLilula((state) => state.placeOrder);
  const rememberContact = useLilula((state) => state.rememberContact);
  const navigate = useNavigate();
  const { lines, estimate } = resolveCart(cart);

  const [name, setName] = useState(contact.name);
  const [phone, setPhone] = useState(contact.phone);
  const [fulfilment, setFulfilment] = useState<Fulfilment>("delivery");
  const [address, setAddress] = useState(contact.address);
  const [notes, setNotes] = useState("");
  const [adult, setAdult] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (lines.length === 0) {
    return (
      <div className="panel px-4 py-10 text-center">
        <h1 className="font-display text-3xl">Nothing to check out</h1>
        <Link to="/shop" className="btn btn-gold mt-5">
          Shop the shelf
        </Link>
      </div>
    );
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const next = validate({ name, phone, fulfilment, address, adult });
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanAddress = address.trim();
    rememberContact({ name: cleanName, phone: cleanPhone, address: cleanAddress });
    const order = {
      id: makeRef("LL"),
      createdAt: new Date().toISOString(),
      name: cleanName,
      phone: cleanPhone,
      fulfilment,
      address: fulfilment === "delivery" ? cleanAddress : "",
      notes: notes.trim(),
      estimate,
      whatsappOpened: false,
      items: lines.map((line) => ({
        productId: line.product.id,
        name: line.product.name,
        qty: line.qty,
        unitPrice: line.product.price,
      })),
    };
    placeOrder(order);
    void navigate({ to: "/orders/$orderId", params: { orderId: order.id } });
  }

  return (
    <div>
      <p className="kicker">Checkout</p>
      <h1 className="mt-2 font-display text-4xl">Send it to Lilula</h1>
      <p className="mt-3 max-w-xl text-sm text-muted">
        Estimated bottles {rands(estimate)}. The order is saved on this phone even if WhatsApp
        does not open. Lilula confirms payment arrangements. No card is charged.
      </p>

      <form className="mt-6 grid gap-6 md:grid-cols-5" onSubmit={submit} noValidate>
        <div className="flex flex-col gap-4 md:col-span-3">
          <fieldset className="grid grid-cols-2 gap-2">
            <legend className="kicker mb-2">Fulfilment</legend>
            <Choice
              pressed={fulfilment === "delivery"}
              onClick={() => setFulfilment("delivery")}
              title="Delivery"
              text="Lilula confirms the fee and area."
            />
            <Choice
              pressed={fulfilment === "collection"}
              onClick={() => setFulfilment("collection")}
              title="Collection"
              text="Lilula confirms the pickup point."
            />
          </fieldset>

          <Field label="Your name" error={errors.name}>
            <input className="field" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} />
          </Field>
          <Field label="Phone" error={errors.phone}>
            <input
              className="field"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </Field>
          {fulfilment === "delivery" ? (
            <Field label="Delivery address" error={errors.address}>
              <textarea
                className="field min-h-24 py-3"
                autoComplete="street-address"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
              />
            </Field>
          ) : (
            <p className="text-sm text-muted">Lilula will tell you where to collect when they confirm the order.</p>
          )}
          <Field label="Notes (optional)" error="">
            <textarea className="field min-h-24 py-3" value={notes} maxLength={400} onChange={(event) => setNotes(event.target.value)} />
          </Field>
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              className="mt-1 size-4 accent-gold"
              checked={adult}
              onChange={(event) => setAdult(event.target.checked)}
            />
            <span>I am 18 or older and I am ordering alcohol for lawful use.</span>
          </label>
          {errors.adult ? (
            <p className="text-sm text-gold-2" role="alert">
              {errors.adult}
            </p>
          ) : null}
          <button type="submit" className="btn btn-gold">
            Save order
          </button>
        </div>
        <aside className="panel h-fit p-4 md:col-span-2">
          <h2 className="font-display text-xl">Estimate</h2>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            {lines.map((line) => (
              <li key={line.product.id} className="flex justify-between gap-3">
                <span>
                  {line.qty} × {line.product.flavour}
                </span>
                <span className="tabular-nums">{rands(line.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 flex justify-between border-t border-line pt-3">
            <span className="text-sm text-muted">Bottles</span>
            <span className="font-display text-xl text-gold">{rands(estimate)}</span>
          </p>
        </aside>
      </form>
    </div>
  );
}

function Choice({
  pressed,
  onClick,
  title,
  text,
}: {
  pressed: boolean;
  onClick: () => void;
  title: string;
  text: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`panel px-3 py-3 text-left ${pressed ? "border-gold" : ""}`}
    >
      <span className="block font-display text-lg">{title}</span>
      <span className="mt-1 block text-xs text-muted">{text}</span>
    </button>
  );
}

function Field({ label, error, children }: { label: string; error: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="kicker">{label}</span>
      <span className="mt-2 block">{children}</span>
      {error ? (
        <span className="mt-1 block text-sm text-gold-2" role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
}

function validate(input: {
  name: string;
  phone: string;
  fulfilment: Fulfilment;
  address: string;
  adult: boolean;
}) {
  const errors: Record<string, string> = {};
  if (input.name.trim().length < 2) errors.name = "Enter the name Lilula should ask for.";
  const digits = input.phone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) errors.phone = "Enter a phone number Lilula can call.";
  if (input.fulfilment === "delivery" && input.address.trim().length < 5) {
    errors.address = "Enter the delivery address.";
  }
  if (!input.adult) errors.adult = "Confirm that you are 18 or older.";
  return errors;
}
