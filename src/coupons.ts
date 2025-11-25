// src/coupons.ts
export type Coupon = {
  code: string;        // npr. "PRO10"
  percentOff?: number; // npr. 10 -> 10%
  // (po potrebi kasnije: amountOff, appliesTo, validUntil, itd.)
};

export const COUPONS: Coupon[] = [
  { code: "PRO10", percentOff: 10 },
  // dodaj nove: { code: "JESEN15", percentOff: 15 },
];

export function normalizeCoupon(input: string | null | undefined) {
  return (input || "").trim().toUpperCase();
}

export function findCoupon(input: string | null | undefined): Coupon | null {
  const code = normalizeCoupon(input);
  return COUPONS.find(c => c.code === code) || null;
}

export function isValidCoupon(input: string | null | undefined) {
  return !!findCoupon(input);
}

export function getValidCouponCode(input: string | null | undefined) {
  return findCoupon(input)?.code; // vrati čist kod ili undefined
}
