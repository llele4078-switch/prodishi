// src/components/products.ts
export type Variant = {
  id: string;
  label: string;
  price: number;
  compareAt?: number;
  sku?: string;
  inStock?: boolean;
};

export type Product = {
  id: "starter" | "refill";
  title: string;
  subtitle?: string;
  variants: Variant[];
  defaultVariantId: string;
  shippingFlat?: number;
  freeShippingThreshold?: number;
};

export const PRODUCTS: Product[] = [
  {
    id: "starter",
    title: "Starter Kit",
    subtitle: "",
    shippingFlat: 350,
    freeShippingThreshold: 3000,
    variants: [
      { id: "starter-30", label: "4 dilatatora + 30 stikera", price: 1590, compareAt: 1990, sku: "ST-30", inStock: true },
    ],
    defaultVariantId: "starter-30",
  },
  {
    id: "refill",
    title: "Dopuna stikera",
    subtitle: "",
    shippingFlat: 350,
    freeShippingThreshold: 3000,
    variants: [
      { id: "refill-30", label: "30 stikera", price: 400, sku: "RF-30", inStock: true },
    ],
    defaultVariantId: "refill-30",
  },
];

export function getProduct(productId: string): Product {
  const p = PRODUCTS.find((x) => x.id === productId)!;
  if (!p) throw new Error(`Product not found: ${productId}`);
  return p;
}

export function getVariant(productId: string, variantId: string) {
  const product = getProduct(productId);
  const variant = product.variants.find((x) => x.id === variantId)!;
  if (!variant) throw new Error(`Variant not found: ${productId}/${variantId}`);
  return { product, variant };
}
