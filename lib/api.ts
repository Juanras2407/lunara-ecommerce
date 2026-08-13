import type {
  ApiResponse,
  Category,
  OrderRequest,
  OrderResponse,
  OrderStatus,
  Product,
  StoreInfo,
} from "./types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    cache: "no-store",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body || res.statusText}`);
  }

  const json = (await res.json()) as ApiResponse<T>;
  if (!json.success) {
    throw new Error(json.message || "Error de la API");
  }
  return json.data;
}

export function getStoreInfo(slug: string): Promise<StoreInfo> {
  return request<StoreInfo>(`/storefront/${slug}/info`);
}

export function getCategories(slug: string): Promise<Category[]> {
  return request<Category[]>(`/storefront/${slug}/categories`);
}

export function getProducts(
  slug: string,
  params?: {
    category?: string;
    q?: string;
    optionIds?: string[];
  }
): Promise<Product[]> {
  const search = new URLSearchParams();
  if (params?.category) search.set("category", params.category);
  if (params?.q) search.set("q", params.q);
  if (params?.optionIds && params.optionIds.length > 0) {
    search.set("optionIds", params.optionIds.join(","));
  }
  const qs = search.toString();
  return request<Product[]>(`/storefront/${slug}/products${qs ? `?${qs}` : ""}`);
}

export function getProduct(slug: string, productId: string): Promise<Product> {
  return request<Product>(`/storefront/${slug}/products/${productId}`);
}

export function createOrder(
  slug: string,
  payload: OrderRequest
): Promise<OrderResponse> {
  return request<OrderResponse>(`/storefront/${slug}/orders`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getOrderStatus(
  slug: string,
  orderId: string
): Promise<OrderStatus> {
  return request<OrderStatus>(`/storefront/${slug}/orders/${orderId}`);
}
