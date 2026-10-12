import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { formatWhen, rands, whatsappHref } from "@/lib/catalog";
import { bottleMessage } from "@/lib/messages";
import { useLilula } from "@/lib/store";

export const Route = createFileRoute("/orders/$orderId")({ component: OrderDetail });

function OrderDetail() {
  const { orderId } = Route.useParams();
  const order = useLilula((state) => state.orders.find((item) => item.id === orderId));
  const mark = useLilula((state) => state.markOrderWhatsapp);
  const [copied, setCopied] = useState(false);

  if (!order) {
    return (
      <div className="panel px-4 py-10 text-center">
        <h1 className="font-display text-3xl">Order not on this phone</h1>
        <p className="mt-3 text-sm text-muted">Orders are saved on the device that placed them.</p>
        <Link to="/orders" className="btn btn-gold mt-5">
          Your orders
        </Link>
      </div>
    );
  }

  const message = bottleMessage(order);

  async function copy() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-5">
      <div className="md:col-span-3">
        <p className="kicker">Saved on this phone</p>
        <h1 className="mt-2 font-display text-4xl">{order.id}</h1>
        <p className="mt-2 text-sm text-muted">{formatWhen(order.createdAt)}</p>
        <ol className="mt-5 flex flex-col gap-2 text-sm">
          <li className="text-gold">1. Order saved — even if WhatsApp is not sent.</li>
          <li className={order.whatsappOpened ? "text-gold" : "text-muted"}>
            2. Message Lilula on WhatsApp — {order.whatsappOpened ? "opened" : "still to send"}.
          </li>
          <li className="text-muted">3. Lilula confirms stock, the final total and payment.</li>
          <li className="text-muted">
            4. {order.fulfilment === "delivery" ? "Out for delivery." : "Ready for collection."}
          </li>
        </ol>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            className="btn btn-green"
            href={whatsappHref(message)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => mark(order.id)}
          >
            <MessageCircle className="size-4" />
            Open WhatsApp
          </a>
          <button type="button" className="btn btn-ghost" onClick={() => void copy()}>
            {copied ? "Copied" : "Copy message"}
          </button>
        </div>
        <pre className="panel mt-4 overflow-x-auto p-4 text-sm whitespace-pre-wrap text-muted">{message}</pre>
      </div>
      <aside className="panel h-fit p-4 md:col-span-2">
        <h2 className="font-display text-xl">Details</h2>
        <dl className="mt-3 flex flex-col gap-2 text-sm">
          <Row label="Name" value={order.name} />
          <Row label="Phone" value={order.phone} />
          <Row label="Fulfilment" value={order.fulfilment === "delivery" ? "Delivery" : "Collection"} />
          {order.address ? <Row label="Address" value={order.address} /> : null}
        </dl>
        <ul className="mt-4 flex flex-col gap-2 border-t border-line pt-3 text-sm">
          {order.items.map((item) => (
            <li key={item.productId} className="flex justify-between gap-3">
              <span>
                {item.qty} × {item.name}
              </span>
              <span className="tabular-nums">{rands(item.unitPrice * item.qty)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 flex justify-between">
          <span className="text-sm text-muted">Estimate</span>
          <span className="font-display text-xl text-gold">{rands(order.estimate)}</span>
        </p>
        <Link to="/shop" className="btn btn-ghost mt-5 w-full">
          Order more
        </Link>
      </aside>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs tracking-widest text-muted uppercase">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
