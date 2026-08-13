"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import type { OrganizationDto } from "@/lib/types";

interface StoreHeaderProps {
  slug: string;
  organization: OrganizationDto;
  categories: { id: string; name: string }[];
}

export default function StoreHeader({ slug, organization, categories }: StoreHeaderProps) {
  const { count } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [logoError, setLogoError] = useState(false);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/${slug}/buscar${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ""}`);
  };

  const logo = organization.logoUrl || "/brand/logo.png";

  return (
    <header className="sticky top-0 z-20">
      {/* Barra principal */}
      <div className="bg-navy text-white">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
          <Link href={`/${slug}`} className="flex items-center gap-2 shrink-0">
            {logo && !logoError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logo}
                alt={organization.name}
                onError={() => setLogoError(true)}
                className="h-9 w-9 rounded-lg object-cover bg-white/10 ring-1 ring-white/20"
              />
            ) : (
              <span className="h-9 w-9 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold ring-1 ring-white/20">
                {organization.name.charAt(0).toUpperCase()}
              </span>
            )}
            <span className="font-bold text-lg truncate hidden sm:block">{organization.name}</span>
          </Link>

          <form onSubmit={submitSearch} className="flex-1 flex max-w-xl mx-auto">
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar en la tienda..."
              className="w-full rounded-l-full border-0 px-4 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-r-full bg-primary text-on-primary px-5 text-sm font-bold transition hover:brightness-110"
            >
              Buscar
            </button>
          </form>

          <Link
            href={`/${slug}/carrito`}
            className="ml-auto flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold transition hover:bg-white/20"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 4.6a1 1 0 00.9 1.4h12.8M10 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"
              />
            </svg>
            <span className="hidden md:inline">Carrito</span>
            {count > 0 && (
              <span className="rounded-full bg-primary text-on-primary px-2 py-0.5 text-xs font-bold">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Barra de categorías */}
      <nav className="bg-white border-b border-beige">
        <div className="mx-auto max-w-6xl px-4 py-2 flex items-center gap-1 overflow-x-auto text-sm">
          <Link
            href={`/${slug}`}
            className={`px-3 py-1.5 whitespace-nowrap transition-colors ${
              pathname === `/${slug}`
                ? "font-bold text-primary"
                : "text-muted hover:text-foreground"
            }`}
          >
            Inicio
          </Link>
          {categories.slice(0, 8).map((c) => (
            <Link
              key={c.id}
              href={`/${slug}/categoria/${c.id}`}
              className="px-3 py-1.5 whitespace-nowrap text-muted transition-colors hover:text-foreground"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
