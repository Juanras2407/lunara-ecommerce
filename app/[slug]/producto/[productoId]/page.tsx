import { notFound } from "next/navigation";
import Link from "next/link";
import AddToCart from "@/components/AddToCart";
import ProductGallery from "@/components/ProductGallery";
import { getProduct } from "@/lib/api";
import { formatCOP } from "@/lib/format";

export default async function ProductPage({
  params,
}: {
  params: { slug: string; productoId: string };
}) {
  const { slug, productoId } = params;

  let product;
  try {
    product = await getProduct(slug, productoId);
  } catch {
    return notFound();
  }

  const gallery = product.photos.length > 0 ? product.photos : product.photoUrl ? [product.photoUrl] : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="text-sm text-gray-500 mb-4">
        <Link href={`/${slug}`} className="hover:underline">Inicio</Link>
        <span className="mx-2">/</span>
        {product.categoryId && (
          <>
            <Link href={`/${slug}/categoria/${product.categoryId}`} className="hover:underline">
              {product.categoryName}
            </Link>
            <span className="mx-2">/</span>
          </>
        )}
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Galería */}
        <div>
          {gallery.length > 0 ? (
            <ProductGallery photos={gallery} productName={product.name} />
          ) : (
            <div className="rounded-2xl border border-gray-200 bg-gray-50 aspect-square flex items-center justify-center text-6xl text-gray-300">
              🛍
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">{product.name}</h1>
          {product.description && (
            <p className="mt-2 text-gray-600 whitespace-pre-line">{product.description}</p>
          )}

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-primary">
              {formatCOP(product.unitPriceCop)}
            </span>
            {!product.inStock && (
              <span className="text-sm text-red-500 font-semibold">Sin stock</span>
            )}
          </div>

          <div className="mt-6 border-t border-gray-100 pt-6">
            <AddToCart product={product} />
          </div>

          {product.attributes.length > 0 && (
            <div className="mt-8">
              <h2 className="font-bold mb-3">Especificaciones</h2>
              <dl className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
                {product.attributes.map((a) => (
                  <div key={a.attributeId} className="flex justify-between px-4 py-2.5 text-sm">
                    <dt className="text-gray-500">{a.attributeName}</dt>
                    <dd className="font-semibold">{a.optionLabel || "—"}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
