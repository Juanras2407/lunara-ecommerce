import { notFound } from "next/navigation";
import Catalog from "@/components/Catalog";
import { getCategories, getProducts } from "@/lib/api";

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { q?: string };
}) {
  const { slug } = params;
  const q = searchParams.q?.trim() || "";

  let categories;
  let products;
  try {
    [categories, products] = await Promise.all([
      getCategories(slug),
      getProducts(slug, q ? { q } : {}),
    ]);
  } catch {
    return notFound();
  }

  return (
    <Catalog
      slug={slug}
      categories={categories}
      initialProducts={products}
      initialQ={q}
    />
  );
}
