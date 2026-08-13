"use client";

import { useEffect, useMemo, useState } from "react";
import { getProducts } from "@/lib/api";
import type { Category, Product } from "@/lib/types";
import ProductCard from "./ProductCard";

interface CatalogProps {
  slug: string;
  categoryId?: string;
  categories: Category[];
  initialProducts: Product[];
  initialQ?: string;
}

export default function Catalog({
  slug,
  categoryId,
  categories,
  initialProducts,
  initialQ = "",
}: CatalogProps) {
  const [q, setQ] = useState(initialQ);
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);

  const category = categories.find((c) => c.id === categoryId);

  const activeCategory = useMemo(
    () => category || { id: "", name: "Todos los productos", attributes: [] },
    [category]
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getProducts(slug, {
      category: categoryId,
      q: q.trim() || undefined,
      optionIds: selectedOptions.size > 0 ? Array.from(selectedOptions) : undefined,
    })
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug, categoryId, q, selectedOptions]);

  const toggleOption = (optionId: string) => {
    setSelectedOptions((prev) => {
      const next = new Set(prev);
      if (next.has(optionId)) {
        next.delete(optionId);
      } else {
        next.add(optionId);
      }
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filtros */}
        <aside className="md:w-64 shrink-0">
          <h1 className="text-xl font-bold mb-4 text-foreground">{activeCategory.name}</h1>

          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar producto..."
            className="w-full rounded-full border border-beige bg-surface px-4 py-2 text-sm mb-4 text-foreground placeholder:text-muted-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {activeCategory.attributes.map((attr) => (
            <div key={attr.id} className="mb-4 bg-surface border border-beige rounded-xl p-3">
              <div className="font-bold text-sm mb-2 text-foreground">{attr.name}</div>
              <div className="space-y-1.5">
                {attr.options.map((opt) => (
                  <label
                    key={opt.id}
                    className="flex items-center gap-2 text-sm text-muted cursor-pointer hover:text-foreground"
                  >
                    <input
                      type="checkbox"
                      checked={selectedOptions.has(opt.id)}
                      onChange={() => toggleOption(opt.id)}
                      className="h-4 w-4 rounded accent-primary"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>
          ))}

          {selectedOptions.size > 0 && (
            <button
              onClick={() => setSelectedOptions(new Set())}
              className="text-sm text-primary underline"
            >
              Limpiar filtros
            </button>
          )}
        </aside>

        {/* Grid */}
        <div className="flex-1">
          {loading && <p className="text-muted text-sm">Cargando...</p>}
          {!loading && products.length === 0 && (
            <p className="text-muted text-center py-16">
              No hay productos que coincidan con tu búsqueda.
            </p>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} slug={slug} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
