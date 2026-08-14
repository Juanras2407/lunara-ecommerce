"use client";

import { useState } from "react";
import { createOrder } from "@/lib/api";
import { useCart } from "@/lib/cart";
import { formatCOP } from "@/lib/format";

export default function CartCheckout({ slug }: { slug: string }) {
  const { items, removeItem, clear, subtotal } = useCart();
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    shippingAddress: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-extrabold mb-2">Tu carrito está vacío</h1>
        <p className="text-gray-500 mb-6">Agrega productos para comenzar tu pedido.</p>
        <a
          href={`/${slug}`}
          className="rounded-xl bg-primary text-on-primary px-6 py-3 font-bold text-sm"
        >
          Ver productos
        </a>
      </div>
    );
  }

  const submit = async () => {
    if (!form.customerName.trim()) {
      setError("Ingresa tu nombre para continuar");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await createOrder(slug, {
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        customerEmail: form.customerEmail,
        shippingAddress: form.shippingAddress,
        notes: form.notes,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          serialCode: i.serialCode,
        })),
      });
      clear();
      window.location.href = `/${slug}/pago/${res.orderId}`;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al crear el pedido");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-extrabold mb-6">Tu carrito</h1>
      <div className="grid md:grid-cols-[1fr_360px] gap-8">
        {/* Items */}
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.serialCode}`}
              className="flex gap-4 items-center border border-gray-200 rounded-2xl p-3"
            >
              {item.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.photoUrl}
                  alt={item.name}
                  className="h-16 w-16 rounded-xl object-cover"
                />
              ) : (
                <div className="h-16 w-16 rounded-xl bg-gray-100 flex items-center justify-center text-2xl">
                  🛍
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{item.name}</div>
                <div className="text-sm text-gray-500">
                  {item.quantity} × {formatCOP(item.price)}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-bold">{formatCOP(item.price * item.quantity)}</div>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-xs text-red-500 hover:underline mt-1"
                >
                  Quitar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen + datos */}
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-2xl p-4">
            <div className="flex justify-between font-semibold">
              <span>Subtotal</span>
              <span>{formatCOP(subtotal)}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              El total final se confirma al recibir el pedido.
            </p>
          </div>

          <div className="border border-gray-200 rounded-2xl p-4 space-y-3">
            <h2 className="font-bold text-sm">Tus datos</h2>
            <input
              placeholder="Nombre *"
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              placeholder="Teléfono"
              value={form.customerPhone}
              onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              placeholder="Email"
              type="email"
              value={form.customerEmail}
              onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              placeholder="Dirección de entrega"
              value={form.shippingAddress}
              onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <textarea
              placeholder="Notas del pedido"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={2}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              onClick={submit}
              disabled={submitting}
              className="w-full rounded-xl bg-primary text-on-primary py-3 font-bold text-sm disabled:opacity-40"
            >
              {submitting
                ? "Procesando..."
                : `Continuar al pago · ${formatCOP(subtotal)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
