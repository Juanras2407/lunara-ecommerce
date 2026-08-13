import type { Metadata } from "next";
import { notFound } from "next/navigation";
import StoreHeader from "@/components/StoreHeader";
import StoreTheme from "@/components/StoreTheme";
import { getStore } from "@/lib/store";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const info = await getStore(params.slug);
    return {
      title: info.organization.name,
      description: `${info.organization.name} · tienda online`,
    };
  } catch {
    return { title: "Tienda" };
  }
}

export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const { slug } = params;

  let info;
  try {
    info = await getStore(slug);
  } catch {
    return notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <StoreTheme />
      <StoreHeader
        slug={slug}
        organization={info.organization}
        categories={info.categories}
      />
      <main className="flex-1">{children}</main>
      <footer className="bg-navy text-white/60 py-6 text-center text-sm">
        {info.organization.name} · Powered by JCORE
      </footer>
    </div>
  );
}
