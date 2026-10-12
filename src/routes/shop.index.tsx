import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { QtyControl } from "@/components/qty";
import { BOTTLE_PRICE, products, rands, type Category } from "@/lib/catalog";

export const Route = createFileRoute("/shop/")({ component: Shop });

const filters = ["All", "Gin", "Vodka"] as const;

function Shop() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return products.filter((product) => {
      const categoryOk = filter === "All" || product.category === (filter as Category);
      const text = `${product.name} ${product.flavour} ${product.category}`.toLowerCase();
      return categoryOk && (needle.length === 0 || text.includes(needle));
    });
  }, [filter, query]);

  return (
    <div>
      <p className="kicker">Our spirits</p>
      <h1 className="mt-2 font-display text-4xl">The shelf</h1>
      <p className="mt-3 max-w-xl text-sm text-muted">
        Catalogue price {rands(BOTTLE_PRICE)} a bottle. That is an estimate — Lilula confirms stock and the
        amount you pay. 750 ml · 43% ABV.
      </p>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex gap-2">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              className={`btn ${filter === item ? "btn-gold" : "btn-ghost"}`}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <label className="sm:ml-auto sm:w-64">
          <span className="sr-only">Search spirits</span>
          <input
            className="field"
            value={query}
            placeholder="Search flavour"
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </div>

      {visible.length === 0 ? (
        <p className="panel mt-6 px-4 py-8 text-center text-sm text-muted">No bottle matches that search.</p>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
          {visible.map((product) => (
            <li key={product.id} className="panel flex flex-col">
              <Link
                to="/shop/$productId"
                params={{ productId: product.id }}
                className="flex h-52 items-end justify-center bg-bg px-3 pt-4"
              >
                <img src={product.image} alt={product.name} className="h-48 w-auto object-contain" />
              </Link>
              <div className="flex flex-1 flex-col gap-2 p-3">
                <p className="text-xs tracking-widest text-muted uppercase">{product.category}</p>
                <h2 className="font-display text-xl leading-tight">
                  <Link to="/shop/$productId" params={{ productId: product.id }}>
                    {product.flavour}
                  </Link>
                </h2>
                <p className="text-sm text-muted">{product.tagline}</p>
                <p className="font-display text-gold">{rands(product.price)}</p>
                <div className="mt-auto pt-2">
                  <QtyControl productId={product.id} wide />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
