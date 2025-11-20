// Product sizes (small/medium/large)
export interface ProductSize {
  size: string;
  price: number;
  discountPrice?: number;
}

// Product additive
export interface ProductAdditive {
  name: string;
}

// product object from API
export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  discountPrice?: number;
  image?: string;
  sizes: Record<string, ProductSize>;
  additives: ProductAdditive[];
}

// API response wrapper
export interface ProductsResponse {
  data: Product[];
}

export interface SingleProductResponse {
  data: Product;
}

// User object (from registration)
export interface User {
  firstName: string;
  lastName: string;
  city: string;
  street: string;
  houseNumber: string;
  paymentMethod: string;
}

// Cart item to save to localStorage
export interface CartItem {
  id: number;
  name: string;
  image: string;
  sizes: string;
  additives: string[];
  quantity: number;
  pricePerItem: string;
  total: string | number;
  product: Product;
}
