import { Minus, Plus } from "lucide-react";
import { useLilula } from "@/lib/store";

export function QtyControl({ productId, wide = false }: { productId: string; wide?: boolean }) {
  const qty = useLilula(
    (state) => state.cart.find((line) => line.productId === productId)?.qty ?? 0,
  );
  const add = useLilula((state) => state.add);
  const setQty = useLilula((state) => state.setQty);

  if (qty === 0) {
    return (
      <button type="button" className={`btn btn-gold ${wide ? "w-full" : ""}`} onClick={() => add(productId)}>
        Add to order
      </button>
    );
  }

  return (
    <div className={`flex items-center justify-between border border-gold ${wide ? "w-full" : ""}`}>
      <button
        type="button"
        className="icon-btn"
        aria-label="Decrease quantity"
        onClick={() => setQty(productId, qty - 1)}
      >
        <Minus className="size-4" />
      </button>
      <span className="min-w-8 text-center text-sm tabular-nums">{qty}</span>
      <button
        type="button"
        className="icon-btn"
        aria-label="Increase quantity"
        onClick={() => setQty(productId, qty + 1)}
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
