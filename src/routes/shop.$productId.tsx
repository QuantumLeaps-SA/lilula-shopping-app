import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { QtyControl } from "@/components/qty";
import { productById, rands } from "@/lib/catalog";

export const Route = createFileRoute("/shop/$productId")({ component: ProductPage });

function ProductPage() {
  const { productId } = Route.useParams();
  const product = productById(productId);

  if (!product) {
    return (
      <div className="panel px-4 py-10 text-center">
        <h1 className="font-display text-3xl">That bottle is not on the shelf</h1>
        <Link to="/shop" className="btn btn-gold mt-6">
          Back to spirits
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-gold">
        <ArrowLeft className="size-4" />
        All spirits
      </Link>
      <article className="mt-4 grid items-center gap-6 md:grid-cols-2">
        <div className="panel flex items-end justify-center bg-bg px-6 pt-8 pb-6">
          <img src={product.image} alt={product.name} className="h-80 w-auto object-contain" />
        </div>
        <div>
          <p className="kicker">{product.category}</p>
          <h1 className="mt-2 font-display text-4xl">{product.name}</h1>
          <p className="mt-3 text-sm text-muted">{product.description}</p>
          <p className="mt-3 text-sm text-muted">
            {product.volume} · {product.abv} ABV · Produced in South Africa
          </p>
          <p className="mt-4 font-display text-3xl text-gold">{rands(product.price)}</p>
          <p className="mt-1 text-xs text-muted">Catalogue estimate. Lilula confirms before payment.</p>
          <div className="mt-6 max-w-xs">
            <QtyControl productId={product.id} wide />
          </div>
          <Link to="/cart" className="btn btn-ghost mt-3 max-w-xs">
            View bag
          </Link>
        </div>
      </article>
    </div>
  );
}
