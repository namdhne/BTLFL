import type { Product } from "./Product";

export interface InvoiceItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface Invoice {
  _id: string;
  userId: string;
  username: string;
  items: InvoiceItem[];
  totalAmount: number;
  status: "pending" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}
