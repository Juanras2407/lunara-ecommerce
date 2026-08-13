"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getOrderStatus } from "@/lib/api";
import { formatCOP } from "@/lib/format";
import type { OrderStatus } from "@/lib/types";

export default function PaymentResultPage({
  params,
}: {
  params: { slug: string; orderId: string };
}) {
  const { slug, orderId } = params;
  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      try {
        const o = await getOrderStatus(slug, orderId);
        if (cancelled) return;
        setOrder(o);
        if (o.status === "PENDING") {
          setTimeout(poll, 3000);
        }
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "No se pudo consultar el estado");
      }
    };

    poll();
    return () => {
      cancelled = true;
    };
  }, [slug, orderId]);

  if (error) {
    return (
      <Centered>
        <h1 className="text-2xl font-extrabold mb-2">No se pudo consultar el pedido</h1>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link
          href={`/${slug}`}
          className="rounded-xl bg-primary text-on-primary px-6 py-3 font-bold text-sm"
        >
          Volver a la tienda
        </Link>
      </Centered>
    );
  }

  if (!order) {
    return (
      <Centered>
        <p className="text-gray-500">Consultando estado del pago...</p>
      </Centered>
    );
  }

  const success = order.status === "CONFIRMED" || order.status === "SHIPPED" || order.status === "DELIVERED";

  return (
    <Centered>
      <div className="text-5xl mb-4">
        {success ? "✅" : order.status === "CANCELLED" ? "🚫" : "⏳"}
      </div>
      <h1 className="text-2xl font-extrabold mb-2">
        {success
          ? "¡Pago aprobado!"
          : order.status === "CANCELLED"
            ? "Pedido cancelado"
            : "Confirmando tu pago..."}
      </h1>
      <p className="text-gray-600 mb-6 max-w-md">
        {success ? (
          <>
            Tu pedido <span className="font-bold">#{orderId.slice(0, 8)}</span> fue
            confirmado por{" "}
            <span className="font-bold">{formatCOP(order.totalCop)}</span>
            {order.paymentMethod ? ` pagado con ${order.paymentMethod.toUpperCase()}` : ""}.
          </>
        ) : order.status === "CANCELLED" ? (
          "Este pedido fue cancelado. Contacta a la tienda si tienes dudas."
        ) : (
          "Estamos esperando la confirmación del proveedor de pago. Esto puede tomar unos segundos..."
        )}
      </p>

      {order.status === "PENDING" && (
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Spinner />
          Consultando...
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href={`/${slug}`}
          className="rounded-xl bg-primary text-on-primary px-6 py-3 font-bold text-sm"
        >
          Volver a la tienda
        </Link>
        <Link
          href={`/${slug}/pago/${orderId}`}
          className="rounded-xl border border-gray-300 px-6 py-3 font-bold text-sm"
        >
          Reintentar pago
        </Link>
      </div>
    </Centered>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">{children}</div>
  );
}

function Spinner() {
  return (
    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-primary" />
  );
}
