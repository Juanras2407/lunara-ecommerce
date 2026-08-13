import { notFound } from "next/navigation";
import Catalog from "@/components/Catalog";
import { getCategories, getProducts } from "@/lib/api";

export default async function CategoryPage({
  params,
}: {
  params: { slug: string; categoriaId: string };
}) {
  const { slug, categoriaId } = params;

  let categories;
  let products;
  try {
    [categories, products] = await Promise.all([
      getCategories(slug),
      getProducts(slug, { category: categoriaId }),
    ]);
  } catch {
    return notFound();
  }

  const exists = categories.some((c) => c.id === categoriaId);
  if (!exists) {
    return notFound();
  }

  return (
    <Catalog
      slug={slug}
      categoryId={categoriaId}
      categories={categories}
      initialProducts={products}
    />
  );
}
