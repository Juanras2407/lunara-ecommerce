import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getProducts, getStoreInfo } from "@/lib/api";

export default async function StoreHome({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const info = await getStoreInfo(slug);
  const featured = await getProducts(slug);

  return (
    <div>
      {/* Banner de la tienda */}
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-6xl px-4 py-12 flex flex-col items-center text-center gap-3">
          <h1 className="text-2xl md:text-3xl font-extrabold">
            {info.organization.receiptHeader || info.organization.name}
          </h1>
          <p className="text-white/70 max-w-xl">
            {info.productCount > 0
              ? `${info.productCount} ${info.productCount === 1 ? "producto disponible" : "productos disponibles"} para tu pedido`
              : "Catálogo disponible próximamente"}
          </p>
        </div>
      </section>

      {/* Categorías */}
      {info.categories.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {info.categories.map((c) => (
              <Link
                key={c.id}
                href={`/${slug}/categoria/${c.id}`}
                className="rounded-full bg-surface border border-beige px-5 py-2 font-semibold text-sm text-muted transition hover:border-primary hover:text-primary"
              >
                {c.name}
                <span className="ml-2 text-xs text-muted-2">{c.productCount}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Productos */}
      {featured.length > 0 ? (
        <section className="mx-auto max-w-6xl px-4 pb-14">
          <h2 className="text-lg font-bold mb-4 text-foreground">Nuestros productos</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map((p) => (
              <ProductCard key={p.id} slug={slug} product={p} />
            ))}
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-6xl px-4 pb-14 text-center text-muted py-16">
          No hay productos publicados todavía.
        </section>
      )}
    </div>
  );
}
