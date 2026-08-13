export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
}

export interface OrganizationDto {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  primaryColor?: string | null;
  accentColor?: string | null;
  businessType?: string | null;
  receiptHeader?: string | null;
}

export interface CategorySummary {
  id: string;
  code?: string | null;
  name: string;
  productCount: number;
}

export interface StoreInfo {
  organization: OrganizationDto;
  categories: CategorySummary[];
  productCount: number;
}

export interface AttributeOption {
  id: string;
  label: string;
  code?: string | null;
}

export interface Attribute {
  id: string;
  name: string;
  orderIndex: number;
  options: AttributeOption[];
}

export interface Category {
  id: string;
  code?: string | null;
  name: string;
  productCount: number;
  attributes: Attribute[];
}

export interface ProductAttributeValue {
  attributeId: string;
  attributeName: string;
  optionId?: string | null;
  optionLabel?: string | null;
}

export interface AvailableUnit {
  id: string;
  serialCode: string;
}

export interface Product {
  id: string;
  barcode?: string | null;
  name: string;
  description?: string | null;
  categoryId?: string | null;
  categoryName?: string | null;
  supplierId?: string | null;
  supplierName?: string | null;
  unitPriceCop: number;
  currentStock: number;
  inStock: boolean;
  serialized: boolean;
  photoUrl?: string | null;
  photos: string[];
  attributes: ProductAttributeValue[];
  availableUnits: AvailableUnit[];
}

export interface OrderItemRequest {
  productId: string;
  quantity: number;
  serialCode?: string;
}

export interface OrderRequest {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: string;
  notes?: string;
  items: OrderItemRequest[];
}

export interface OrderResponse {
  orderId: string;
  totalCop: number;
  itemCount: number;
  message: string;
}

export interface OrderStatus {
  orderId: string;
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  totalCop: number;
  customerEmail?: string | null;
  paymentMethod?: string | null;
  paymentStatus?: string | null;
  paidAt?: string | null;
  paymentSignature?: string | null;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  photoUrl?: string | null;
  serialized: boolean;
  serialCode?: string;
  unitId?: string;
}
