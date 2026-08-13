"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { getOrderStatus } from "@/lib/api";
import { formatCOP } from "@/lib/format";
import type { OrderStatus } from "@/lib/types";

const WOMPI_WIDGET_URL = "https://checkout.wompi.co/widget.js";

type WidgetCheckoutConfig = {
  currency: string;
  amountInCents: number;
  reference: string;
  publicKey: string;
  redirectUrl: string;
  paymentMethods: string;
  signature?: { integrity: string };
  customerData?: { email?: string };
};

declare global {
  interface Window {
    WidgetCheckout?: new (config: WidgetCheckoutConfig) => {
      open: (callback?: (result: unknown) => void) => void;
    };
  }
}

export default function PaymentPage({
  params,
}: {
  params: { slug: string; orderId: string };
}) {
  const { slug, orderId } = params;
  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [openAttempted, setOpenAttempted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getOrderStatus(slug, orderId)
      .then((o) => {
        if (!cancelled) setOrder(o);
      })
      .catch((e) => {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "No se pudo cargar la orden");
      });
    return () => {
      cancelled = true;
    };
  }, [slug, orderId]);

  useEffect(() => {
    if (document.getElementById("wompi-widget-script")) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "wompi-widget-script";
    script.src = WOMPI_WIDGET_URL;
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () =>
      setError("No se pudo cargar el proveedor de pago. Intenta de nuevo.");
    document.body.appendChild(script);
  }, []);

  const openCheckout = useCallback(() => {
    const CheckoutCtor = window.WidgetCheckout;
    if (!CheckoutCtor || !order) return;

    const checkout = new CheckoutCtor({
      currency: "COP",
      amountInCents: order.totalCop * 100,
      reference: orderId,
      publicKey: process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY as string,
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/${slug}/pago/${orderId}/resultado`,
      paymentMethods: "NEQUI,PSE,CARD",
      signature: order.paymentSignature
        ? { integrity: order.paymentSignature }
        : undefined,
      customerData: order.customerEmail
        ? { email: order.customerEmail }
        : undefined,
    });
    checkout.open(() => {
      setOpenAttempted(true);
    });
  }, [order, slug, orderId]);

  useEffect(() => {
    if (!order) return;
    if (order.status !== "PENDING") {
      window.location.href = `/${slug}/pago/${orderId}/resultado`;
      return;
    }
    if (scriptLoaded) openCheckout();
  }, [order, scriptLoaded, openCheckout, slug, orderId]);

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-extrabold mb-2">No se pudo cargar el pago</h1>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link
          href={`/${slug}`}
          className="rounded-xl bg-primary text-on-primary px-6 py-3 font-bold text-sm"
        >
          Volver a la tienda
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-gray-500">
        Cargando pago...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 text-center">
      <h1 className="text-2xl font-extrabold mb-1">Paga tu pedido</h1>
      <p className="text-gray-600 mb-6">
        Pedido <span className="font-semibold">#{orderId.slice(0, 8)}</span> · Total{" "}
        <span className="font-bold text-primary">{formatCOP(order.totalCop)}</span>
      </p>

      <button
        onClick={openCheckout}
        disabled={!scriptLoaded}
        className="rounded-xl bg-primary text-on-primary px-8 py-3 font-bold text-sm disabled:opacity-40"
      >
        {scriptLoaded ? "Abrir pago seguro" : "Cargando métodos de pago..."}
      </button>
      {openAttempted && (
        <p className="mt-3 text-sm text-gray-500">
          Si la ventana no se abrió, volvé a tocar el botón.
        </p>
      )}

      <p className="mt-6 text-xs text-gray-500">
        Al continuar serás redirigido a un proveedor de pago seguro. Tu pedido se
        confirma automáticamente al aprobarse el pago.
      </p>
    </div>
  );
}
