import Link from "next/link";
import { formatCOP } from "@/lib/format";
import type { Product } from "@/lib/types";

export default function ProductCard({
  slug,
  product,
}: {
  slug: string;
  product: Product;
}) {
  const image = product.photos?.[0] || product.photoUrl;

  return (
    <Link
      href={`/${slug}/producto/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-beige bg-surface transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-taupe"
    >
      <div className="aspect-square bg-[#f3eee5] overflow-hidden relative">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-4xl text-taupe">
            🛍
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="rounded bg-slate-900/80 px-3 py-1 text-xs font-bold text-white">
              Agotado
            </span>
          </div>
        )}
      </div>
      <div className="p-3 flex flex-col gap-1 flex-1">
        <span className="text-xs text-muted-2 truncate">
          {product.categoryName || "Producto"}
        </span>
        <span className="font-medium line-clamp-2 text-sm leading-tight text-foreground">
          {product.name}
        </span>
        <span className="mt-auto pt-2 font-bold text-foreground">
          {formatCOP(product.unitPriceCop)}
        </span>
      </div>
    </Link>
  );
}
