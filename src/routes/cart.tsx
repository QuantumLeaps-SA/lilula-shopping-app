import { createFileRoute, Link } from "@tanstack/react-router";
import { QtyControl } from "@/components/qty";
import { rands, resolveCart } from "@/lib/catalog";
import { useLilula } from "@/lib/store";

export const Route = createFileRoute("/cart")({ component: CartPage });

function CartPage() {
  const cart = useLilula((state) => state.cart);
  const { lines, estimate, count } = resolveCart(cart);

  return (
    <div>
      <p className="kicker">Your bag</p>
      <h1 className="mt-2 font-display text-4xl">Bottle order</h1>

      {lines.length === 0 ? (
        <div className="panel mt-6 px-4 py-10 text-center">
          <p className="text-sm text-muted">The bag is empty. Add a bottle to start an order.</p>
          <Link to="/shop" className="btn btn-gold mt-5">
            Shop the shelf
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-5">
          <ul className="flex flex-col gap-3 md:col-span-3">
            {lines.map((line) => (
              <li key={line.product.id} className="panel flex gap-3 p-3">
                <img src={line.product.image} alt="" className="h-24 w-16 object-contain" />
                <div className="flex min-w-0 flex-1 flex-col">
                  <h2 className="font-display text-lg leading-tight">{line.product.name}</h2>
                  <p className="text-sm text-gold">{rands(line.product.price)}</p>
                  <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                    <QtyControl productId={line.product.id} />
                    <p className="text-sm tabular-nums">{rands(line.lineTotal)}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <aside className="panel h-fit p-4 md:col-span-2">
            <p className="text-sm text-muted">{count} bottle{count === 1 ? "" : "s"}</p>
            <p className="mt-2 flex items-baseline justify-between gap-3">
              <span className="text-sm text-muted">Estimated bottles</span>
              <span className="font-display text-2xl text-gold">{rands(estimate)}</span>
            </p>
            <p className="mt-3 text-sm text-muted">
              No payment is taken here. Lilula confirms the total, any delivery fee, and how you pay.
            </p>
            <Link to="/checkout" className="btn btn-gold mt-5 w-full">
              Checkout
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
