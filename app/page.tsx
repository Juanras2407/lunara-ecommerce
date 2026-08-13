import { redirect } from "next/navigation";

const DEFAULT_STORE_SLUG = process.env.NEXT_PUBLIC_STORE_SLUG || "compu-campin";

export default function Home() {
  redirect(`/${DEFAULT_STORE_SLUG}`);
}
