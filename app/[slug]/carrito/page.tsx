import CartCheckout from "@/components/CartCheckout";

export default function CartPage({ params }: { params: { slug: string } }) {
  return <CartCheckout slug={params.slug} />;
}
