// src/pricing.ts
import { getVariant } from "./components/products";

// ---- Jedan izvor istine za kupone ----
// Dodaješ/menjaš samo ovde.
export const COUPONS: Record<string, { type: "percent" | "fixed"; value: number }> = {
  PRO10: { type: "percent", value: 10 },
  // PRIMERI:
  // WELCOME300: { type: "fixed", value: 300 },
};

export function normalizeCoupon(raw?: string | null): string | null {
  const v = raw?.trim().toUpperCase() || "";
  return v ? v : null;
}

export function validateCoupon(raw?: string | null): string | null {
  const code = normalizeCoupon(raw);
  return code && COUPONS[code] ? code : null;
}

function applyCouponToUnitPrice(listUnitPrice: number, code: string | null) {
  if (!code) return { unitPrice: listUnitPrice, perUnitSavings: 0, applied: undefined as string | undefined };

  const rule = COUPONS[code];
  if (!rule) return { unitPrice: listUnitPrice, perUnitSavings: 0, applied: undefined as string | undefined };

  if (rule.type === "percent") {
    const discounted = Math.round(listUnitPrice * (1 - rule.value / 100));
    return {
      unitPrice: discounted,
      perUnitSavings: listUnitPrice - discounted,
      applied: code,
    };
  } else {
    // fixed – dinarski iznos po jedinici (retko, ali podržano)
    const discounted = Math.max(0, listUnitPrice - rule.value);
    return {
      unitPrice: discounted,
      perUnitSavings: listUnitPrice - discounted,
      applied: code,
    };
  }
}

export type CartInput = {
  productId: "starter" | "refill";
  variantId: string;
  qty?: number;
  coupon?: string | null;
};

export type CartCalc = {
  productTitle: string;
  variantLabel: string;

  listUnitPrice: number;   // cena pre kupona
  unitPrice: number;       // cena posle kupona
  compareAt?: number;
  qty: number;

  freebies: number;
  freebiesLabel?: string;
  freebiesValue: number;   // marketinška vrednost poklona

  listSubtotal: number;    // ukupno pre kupona
  subtotal: number;        // ukupno posle kupona (bez dostave)
  discount: number;        // ušteda od kupona
  couponSavings: number;   // isto što i discount (zadržavam radi kompatibilnosti)

  shipping: number;
  total: number;
  couponApplied?: string;  // validirani kupon (ako je primenjen)
  gift?: boolean;
};

// Ako ti treba parsiranje veličina (npr. "30 kom"), ostavljam util
function parsePackSize(label: string): number {
  const n = parseInt(label.replace(/[^\d]/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
}

export function calcCart({ productId, variantId, qty = 1, coupon }: CartInput): CartCalc {
  const { product, variant } = getVariant(productId, variantId);
  const q = Math.max(1, Number.isFinite(qty) ? (qty as number) : 1);

  // ✅ Centralizovana validacija kupona
  const validCode = validateCoupon(coupon);

  const listUnitPrice = variant.price;
  const { unitPrice, perUnitSavings, applied } = applyCouponToUnitPrice(listUnitPrice, validCode);

  const listSubtotal = listUnitPrice * q;
  const couponSavings = perUnitSavings * q;
  const subtotal = Math.max(0, listSubtotal - couponSavings);

  // ---- Freebies pravila (ostavio tvoja stara, prilagodi po potrebi) ----
  let freebies = 0;
  let freebiesLabel: "paket" | "nalepnica" | undefined;
  let freebiesValue = 0;

  if (productId === "starter") {
    // Napomena: Starter set SAM PO SEBI uključuje 30 stikera (to je sadržaj proizvoda),
    // ovaj “freebies” je promopravilo za npr. svaka 3 → 1 gratis paket.
    freebies = Math.floor(q / 3);
    if (freebies > 0) {
      freebiesLabel = "paket";
      freebiesValue = freebies * unitPrice; // marketinška vrednost
    }
  } else if (productId === "refill") {
    const packSize = parsePackSize(variant.label);
    const stickers = packSize * q;
    if (stickers >= 90) {
      freebies = 30;
      freebiesLabel = "nalepnica";
      const perSticker = packSize > 0 ? unitPrice / packSize : 0;
      freebiesValue = Math.round(perSticker * 30);
    }
  }

  const shippingFlat = product.shippingFlat ?? 0;
  const threshold = product.freeShippingThreshold ?? Infinity;

  let shipping = shippingFlat;
  if (subtotal >= threshold || (productId === "starter" && freebies > 0)) {
    shipping = 0;
  }

  const total = subtotal + shipping;
  const gift = total >= 5000;

  return {
    productTitle: product.title,
    variantLabel: variant.label,
    listUnitPrice,
    unitPrice,
    compareAt: variant.compareAt,
    qty: q,
    freebies,
    freebiesLabel,
    freebiesValue,
    listSubtotal,
    subtotal,
    discount: couponSavings,
    couponSavings,
    shipping,
    total,
    couponApplied: applied, // ✅ samo validni kupon se propagira ka UI
    gift,
  };
}
