"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/types";

export default function AddToCart({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const maxQty = product.serialized ? 1 : Math.max(1, product.currentStock);
  const canAdd =
    product.inStock &&
    (!product.serialized || product.availableUnits.length > 0) &&
    quantity > 0;

  const handleAdd = () => {
    const unit = product.availableUnits[0];
    addItem({
      productId: product.id,
      name: product.name,
      price: product.unitPriceCop,
      quantity: product.serialized ? 1 : quantity,
      photoUrl: product.photos[0] || product.photoUrl,
      serialized: product.serialized,
      serialCode: unit?.serialCode,
      unitId: unit?.id,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-4">
      {product.serialized ? (
        <div>
          {product.availableUnits.length > 0 ? (
            <p className="text-sm text-gray-500">
              Unidad única — se asigna automáticamente al confirmar tu pedido.
            </p>
          ) : (
            <p className="text-sm text-red-500">No hay unidades disponibles.</p>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold">Cantidad:</label>
          <div className="flex items-center rounded-xl border border-gray-300">
            <button
              type="button"
              onClick={() => setQuantity((n) => Math.max(1, n - 1))}
              className="px-3 py-1.5 text-lg"
            >
              −
            </button>
            <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((n) => Math.min(maxQty, n + 1))}
              className="px-3 py-1.5 text-lg"
            >
              +
            </button>
          </div>
        </div>
      )}

      <button
        onClick={handleAdd}
        disabled={!canAdd}
        className="w-full rounded-xl bg-primary text-on-primary py-3 font-bold text-sm disabled:opacity-40 hover:opacity-90 transition-opacity"
      >
        {added ? "Agregado ✓" : "Agregar al carrito"}
      </button>

      {!product.serialized && product.currentStock <= 5 && product.currentStock > 0 && (
        <p className="text-xs text-amber-600 font-medium">
          ¡Quedan {product.currentStock} disponibles!
        </p>
      )}
    </div>
  );
}
