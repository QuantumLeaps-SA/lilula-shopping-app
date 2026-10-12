import { createFileRoute, Link } from "@tanstack/react-router";
import { formatWhen, rands } from "@/lib/catalog";
import { useLilula } from "@/lib/store";

export const Route = createFileRoute("/orders/")({ component: OrdersPage });

function OrdersPage() {
  const orders = useLilula((state) => state.orders);
  const enquiries = useLilula((state) => state.enquiries);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="kicker">On this phone</p>
        <h1 className="mt-2 font-display text-4xl">Orders</h1>
        <p className="mt-3 max-w-xl text-sm text-muted">
          Bottle orders and bar enquiries stay on this device, so a missed WhatsApp message does
          not erase them. Lilula still confirms each one before payment.
        </p>
      </div>

      <section>
        <h2 className="font-display text-2xl">Bottle orders</h2>
        {orders.length === 0 ? (
          <Empty text="No bottle orders yet." action="Shop the shelf" to="/shop" />
        ) : (
          <ul className="mt-3 flex flex-col gap-3">
            {orders.map((order) => (
              <li key={order.id}>
                <Link to="/orders/$orderId" params={{ orderId: order.id }} className="panel flex items-center justify-between gap-3 px-4 py-4">
                  <span>
                    <span className="block font-display text-xl">{order.id}</span>
                    <span className="mt-1 block text-sm text-muted">
                      {formatWhen(order.createdAt)} · {order.fulfilment === "delivery" ? "Delivery" : "Collection"}
                    </span>
                  </span>
                  <span className="text-right">
                    <span className="block font-display text-gold">{rands(order.estimate)}</span>
                    <span className="mt-1 block text-xs text-muted">
                      {order.whatsappOpened ? "WhatsApp opened" : "Not sent yet"}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="font-display text-2xl">Mobile bar</h2>
        {enquiries.length === 0 ? (
          <Empty text="No bar enquiries yet." action="Book the bar" to="/bar" />
        ) : (
          <ul className="mt-3 flex flex-col gap-3">
            {enquiries.map((enquiry) => (
              <li key={enquiry.id}>
                <Link
                  to="/enquiry/$enquiryId"
                  params={{ enquiryId: enquiry.id }}
                  className="panel flex items-center justify-between gap-3 px-4 py-4"
                >
                  <span>
                    <span className="block font-display text-xl">{enquiry.id}</span>
                    <span className="mt-1 block text-sm text-muted">
                      {enquiry.eventType} · {enquiry.packageName}
                    </span>
                  </span>
                  <span className="text-right">
                    <span className="block font-display text-gold">{rands(enquiry.estimate)}</span>
                    <span className="mt-1 block text-xs text-muted">
                      {enquiry.whatsappOpened ? "WhatsApp opened" : "Not sent yet"}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Empty({ text, action, to }: { text: string; action: string; to: "/shop" | "/bar" }) {
  return (
    <div className="panel mt-3 px-4 py-8 text-center">
      <p className="text-sm text-muted">{text}</p>
      <Link to={to} className="btn btn-ghost mt-4">
        {action}
      </Link>
    </div>
  );
}
