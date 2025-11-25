import React, { useEffect, useMemo, useState } from "react";
import OrderModal from "./OrderModal";
import { PRODUCTS, Product, Variant } from "./products";
import { calcCart } from "../pricing";
import {
  getValidCouponCode,
  isValidCoupon,
  normalizeCoupon,
} from "../coupons";

type ProductId = Product["id"];

type LineState = { variantId: string; qty: number; };
type LineComputed = {
  product: Product; variant: Variant; qty: number;
  calc: ReturnType<typeof calcCart> | null;
};

const PRODUCT_IMAGES: Record<ProductId, string> = {
  starter: "/images/start-kit-preview.webp",
  refill: "/images/sticker-only-preview.webp",
};
const PRODUCT_BADGES: Partial<Record<ProductId, string>> = {
  starter: "Sve što ti treba za početak",
  refill: "Za korisnike koji već imaju dilatator",
};
const RECOMMENDED_VARIANTS: Record<string, string> = {};
const FREE_SHIPPING_THRESHOLD = 3000;
const GIFT_THRESHOLD = 5000;
const DEFAULT_SHIPPING = 0;

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("sr-RS", {
    style: "currency", currency: "RSD",
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(value)));

const initialState: Record<ProductId, LineState> = PRODUCTS.reduce(
  (acc, product) => {
    acc[product.id] = { variantId: product.defaultVariantId, qty: product.id === "starter" ? 1 : 0 };
    return acc;
  },
  {} as Record<ProductId, LineState>
);

export default function ShopSplit() {
  const [lines, setLines] = useState(initialState);
  const [couponDraft, setCouponDraft] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Auto-apply samo ako je validan kod u URL-u
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const fromUrl = params.get("coupon") || params.get("kupon");
      const valid = getValidCouponCode(fromUrl);
      if (valid) {
        setAppliedCoupon(valid);
        setCouponDraft(valid);
        setCouponError(null);
      }
    } catch { /* no-op */ }
  }, []);

  // Samo validan kod ide u kalkulaciju
  const couponCode = appliedCoupon ?? undefined;

  const data = useMemo(() => {
    const items: LineComputed[] = PRODUCTS.map((product) => {
      const state = lines[product.id];
      const variant = product.variants.find((v) => v.id === state?.variantId) || product.variants[0];
      const qty = Math.max(0, state?.qty ?? 0);
      const calc =
        qty > 0
          ? calcCart({ productId: product.id, variantId: variant.id, qty, coupon: couponCode })
          : null;
      return { product, variant, qty, calc };
    });

    const active = items.filter((item) => item.calc);
    const listSubtotal = active.reduce((s, i) => s + (i.calc?.listSubtotal ?? 0), 0);
    const netSubtotal  = active.reduce((s, i) => s + (i.calc?.subtotal ?? 0), 0);
    const discount     = active.reduce((s, i) => s + (i.calc?.discount ?? 0), 0);
    const freebies     = active.reduce((s, i) => s + (i.calc?.freebies ?? 0), 0);
    const freebiesValue= active.reduce((s, i) => s + (i.calc?.freebiesValue ?? 0), 0);
    const totalQty     = active.reduce((s, i) => s + (i.calc?.qty ?? 0), 0);
    const couponApplied= active.find((i) => i.calc?.couponApplied)?.calc?.couponApplied;
    const shippingCandidate =
      active.find((i) => (i.calc?.shipping ?? 0) > 0)?.calc?.shipping ?? DEFAULT_SHIPPING;
    const qualifiesForFree =
      active.some((i) => (i.calc?.shipping ?? 0) === 0) || netSubtotal >= FREE_SHIPPING_THRESHOLD;
    const shipping = active.length === 0 ? 0 : qualifiesForFree ? 0 : shippingCandidate;
    const total = netSubtotal; // bez dostave

    const amountUntilFree = shipping === 0 ? 0 : Math.max(0, FREE_SHIPPING_THRESHOLD - netSubtotal);
    const amountUntilGift = total >= GIFT_THRESHOLD ? 0 : Math.max(0, GIFT_THRESHOLD - total);

    const orderItems = active.map((i) => ({
      sku: i.variant.sku || i.variant.id,
      title: `${i.product.title} – ${i.variant.label}`,
      qty: i.calc!.qty, unitPrice: i.calc!.unitPrice, lineTotal: i.calc!.subtotal,
    }));

    const hasStarter = active.some((i) => i.product.id === "starter");
    const hasRefill  = active.some((i) => i.product.id === "refill");
    const cartComposition = !active.length
      ? "Korpa je prazna"
      : hasStarter && hasRefill ? "Starter kit + Dopuna stikera"
      : hasStarter ? "Samo starter kit" : "Samo dopuna stikera";

    const cartLineItems = active.map((i) => ({
      id: i.product.id, title: i.product.title, variantLabel: i.variant.label, qty: i.calc!.qty, subtotal: i.calc!.subtotal,
    }));

    const cartTitle =
      cartLineItems.length > 0
        ? cartLineItems.map(l => `${l.title} — ${l.variantLabel} × ${l.qty}`).join(" + ")
        : "PRO.DISHI porudžbina";

    const starter30Qty = active.find((i) => i.product.id === "starter")?.calc?.qty ?? 0;
    const refill30Qty  = active.find((i) => i.product.id === "refill")?.calc?.qty ?? 0;

    return {
      items, active, listSubtotal, netSubtotal, discount, freebies, freebiesValue,
      totalQty, couponApplied, shipping, total, amountUntilFree, amountUntilGift,
      orderItems, cartComposition, cartLineItems, cartTitle, starter30Qty, refill30Qty,
    };
  }, [lines, couponCode]);

  const handleVariantChange = (productId: ProductId, variantId: string) => {
    setLines((prev) => ({ ...prev, [productId]: { ...prev[productId], variantId }}));
  };
  const handleQtyChange = (productId: ProductId, nextQty: number) => {
    setLines((prev) => ({ ...prev, [productId]: { ...prev[productId], qty: Math.max(0, nextQty) }}));
  };

  const handleApplyCoupon = () => {
    const valueNorm = normalizeCoupon(couponDraft);
    if (!valueNorm) {
      setAppliedCoupon(null);
      setCouponError(null);
      return;
    }
    if (!isValidCoupon(valueNorm)) {
      setAppliedCoupon(null);
      setCouponError("Kupon nije važeći.");
      return;
    }
    setAppliedCoupon(valueNorm);
    setCouponError(null);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDraft("");
    setCouponError(null);
  };

  const hasOrder = data.active.length > 0;
  const shouldShowShippingRow = hasOrder && data.shipping === 0;

  return (
    <section id="order" className="scroll-mt-20 mx-auto flex w-full max-w-6xl flex-col gap-8 lg:flex-row">
      <div className="flex-1 space-y-6">
        {data.items.map(({ product, variant, qty, calc }) => (
          <ProductCard
            key={product.id}
            product={product}
            variant={variant}
            qty={qty}
            calc={calc}
            couponApplied={couponCode}
            onVariantChange={(variantId) => handleVariantChange(product.id, variantId)}
            onIncrement={() => handleQtyChange(product.id, qty + 1)}
            onDecrement={() => handleQtyChange(product.id, qty - 1)}
          />
        ))}
      </div>

      <aside className="h-fit min-w-[280px] rounded-3xl bg-[#0C162A]/92 p-6 ring-1 ring-white/5">
        <h4 className="text-lg font-semibold text-white">Rezime</h4>

        <div className="mt-4 rounded-2xl border border-white/6 bg-white/4 px-4 py-3 text-sm text-white/75">
          <p className="font-semibold text-white">U korpi</p>
          <p className="mt-1 text-emerald-200">{data.cartComposition}</p>
          {data.cartLineItems.length > 0 && (
            <ul className="mt-3 space-y-2 text-xs text-white/65">
              {data.cartLineItems.map((line) => (
                <li key={line.id} className="flex justify-between">
                  <span>
                    {line.title} — {line.variantLabel} × ({line.qty} kom)
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <dl className="mt-6 space-y-2 text-sm text-white/70">
          <div className="flex justify-between"><dt>Međuzbir</dt><dd>{formatCurrency(data.netSubtotal)}</dd></div>
          <div className="flex justify-between">
            <dt>Popust </dt>
            <dd className={data.discount > 0 ? "text-emerald-400" : ""}>
              {data.discount > 0 ? `−${formatCurrency(data.discount)}` : formatCurrency(0)}
            </dd>
          </div>
          {shouldShowShippingRow && (
            <div className="flex justify-between"><dt>Dostava</dt><dd>Besplatna</dd></div>
          )}
          <div className="flex justify-between border-t border-white/10 pt-3 text-base font-semibold text-white">
            <dt>Ukupno</dt><dd>{formatCurrency(data.total)}</dd>
          </div>
        </dl>

        <div className="mt-6 space-y-3">
          <label className="text-xs font-medium uppercase tracking-wide text-white/50">Promo kod</label>
          <div className="flex gap-2">
            <input
              value={couponDraft}
              onChange={(e) => setCouponDraft(e.target.value)}
              placeholder="opciono"
              className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-emerald-400 focus:outline-none"
            />
            {appliedCoupon ? (
              <button type="button" onClick={handleRemoveCoupon}
                className="rounded-2xl border border-emerald-500 px-4 py-3 text-sm font-semibold text-emerald-400 hover:bg-emerald-500/10">
                Ukloni
              </button>
            ) : (
              <button type="button" onClick={handleApplyCoupon}
                className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-emerald-950 hover:bg-emerald-400">
                Primeni
              </button>
            )}
          </div>
          {appliedCoupon && <p className="text-xs text-emerald-300">Kupon {appliedCoupon} je aktivan.</p>}
          {couponError && <p className="text-xs text-rose-300">{couponError}</p>}
        </div>

        <div className="mt-6 space-y-2 text-xs text-white/60">
          {data.amountUntilFree > 0 ? (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-3 text-emerald-200">
              Dodaj još {formatCurrency(data.amountUntilFree)} za besplatnu dostavu.
            </div>
          ) : data.shipping === 0 && hasOrder ? (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-emerald-200">
              Besplatna dostava je obezbeđena! 🚚
            </div>
          ) : null}

          {data.amountUntilGift > 0 ? (
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 px-4 py-3 text-blue-200">
              Dodaj još {formatCurrency(data.amountUntilGift)} za poklon iznenađenja.
            </div>
          ) : hasOrder ? (
            <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-amber-100">
              Poklon iznenađenja je uključen! 🎁
            </div>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => hasOrder && setModalOpen(true)}
          disabled={!hasOrder}
          className="mt-8 w-full rounded-2xl bg-emerald-500 px-6 py-4 text-base font-semibold text-emerald-950 shadow-[0_20px_60px_-30px_rgba(16,185,129,0.9)] hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          data-testid="open-order-modal"
        >
          Unesi podatke
        </button>
      </aside>

      <OrderModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        product={{ name: data.cartTitle, price: data.netSubtotal }}
        summary={
          hasOrder
            ? {
                qty: data.totalQty, freebies: data.freebies,
                subtotal: data.netSubtotal, discount: data.discount,
                shipping: data.shipping, total: data.total,
                coupon: appliedCoupon || undefined,
              }
            : undefined
        }
        extras={
          hasOrder
            ? {
                starterQty: data.items.find((i) => i.product.id === "starter")?.calc?.qty ?? 0,
                refillQty:  data.items.find((i) => i.product.id === "refill")?.calc?.qty ?? 0,
                starter30Qty: data.starter30Qty,
                refill30Qty:  data.refill30Qty,
                freebies: data.freebies, freebiesValue: data.freebiesValue,
                shippingCost: data.shipping, couponSavings: data.discount,
                listSubtotal: data.listSubtotal, netSubtotal: data.netSubtotal,
                items: data.orderItems,
              } as any
            : undefined
        }
      />
    </section>
  );
}

type ProductCardProps = {
  product: Product; variant: Variant; qty: number;
  calc: ReturnType<typeof calcCart> | null; couponApplied?: string;
  onVariantChange: (variantId: string) => void;
  onIncrement: () => void; onDecrement: () => void;
};

function ProductCard({
  product, variant, qty, calc, couponApplied,
  onVariantChange, onIncrement, onDecrement,
}: ProductCardProps) {
  const image = PRODUCT_IMAGES[product.id];
  const badge = PRODUCT_BADGES[product.id];
  const unitPrice = calc?.unitPrice ?? variant.price;
  const compareAt = calc?.compareAt ?? variant.compareAt;

  return (
    <article className="rounded-3xl bg-[#0C162A]/96 p-6 shadow-[0_40px_120px_-60px_rgba(0,0,0,0.65)] ring-1 ring-white/5">
      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <div className="flex flex-col items-start gap-3 md:w-[156px]">
          <div className="relative flex h-[140px] w-[140px] items-center justify-center rounded-3xl bg-white/4 p-2 ring-1 ring-white/6">
            <img src={image} alt={product.title} className="max-h-full max-w-full rounded-2xl object-contain" />
          </div>
          {badge && (
            <span className="inline-flex items-center rounded-full border border-emerald-300/35 bg-emerald-500/12 px-3 py-1 text-xs font-semibold text-emerald-100">
              {badge}
            </span>
          )}
        </div>

        <div className="flex-1 space-y-5">
          <header className="space-y-1">
            <h3 className="text-xl font-semibold text-white">{product.title}</h3>
            {product.subtitle && <p className="text-sm text-white/60">{product.subtitle}</p>}
          </header>

          {product.variants.length === 1 ? (
            <span className="inline-flex items-center rounded-full bg-white/6 px-4 py-2 text-sm text-white/80 ring-1 ring-white/8">
              {product.variants[0].label}
            </span>
          ) : (
            <div className="flex flex-wrap gap-3">
              {product.variants.map((option) => {
                const isActive = option.id === variant.id;
                const recommendation = RECOMMENDED_VARIANTS[option.id];
                const disabled = option.inStock === false;

                const baseClasses =
                  "group relative flex min-w-[112px] flex-col items-center justify-center gap-1 overflow-hidden rounded-full px-6 py-2 text-sm font-medium transition backdrop-blur-xl ring-1";
                const activeClasses =
                  "text-emerald-50 ring-emerald-200/70 before:absolute before:inset-[-6px] before:-z-10 before:rounded-full before:bg-gradient-to-br before:from-emerald-400/40 before:via-emerald-500/15 before:to-transparent after:absolute after:inset-[-22px] after:-z-20 after:rounded-full after:bg-emerald-500/14 after:blur-3xl";
                const inactiveClasses =
                  "text-white/65 ring-white/8 bg-white/6 hover:text-emerald-100 hover:ring-emerald-300/40 hover:bg-emerald-500/12";
                const helperClasses = isActive
                  ? "text-[10px] uppercase tracking-wide text-emerald-100/85"
                  : "text-[10px] uppercase tracking-wide text-white/45";

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => !disabled && onVariantChange(option.id)}
                    className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses} ${
                      disabled ? "cursor-not-allowed opacity-35" : ""
                    }`}
                    disabled={disabled}
                  >
                    <span className="relative z-10">{option.label}</span>
                    {recommendation && (
                      <span className={`relative z-10 ${helperClasses}`}>{recommendation}</span>
                    )}
                    {disabled && (
                      <span className="relative z-10 text-[10px] uppercase tracking-wide text-rose-200">
                        Rasprodato
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-semibold text-white">{formatCurrency(unitPrice)}</p>
                <span className="text-xs text-white/60">/ kom</span>
              </div>
              {compareAt && (
                <div className="text-xs text-white/40 line-through">{formatCurrency(compareAt)}</div>
              )}
              {couponApplied && <div className="text-xs text-emerald-300">Kupon {couponApplied} aktivan</div>}
            </div>

            <div className="flex items-center gap-3 rounded-full bg-white/6 px-2 py-2 ring-1 ring-white/10">
              <button type="button" onClick={onDecrement}
                className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-lg text-white transition hover:bg-white/20 disabled:opacity-40"
                disabled={qty === 0}>–</button>
              <span className="w-6 text-center text-base font-semibold text-white">{qty}</span>
              <button type="button" onClick={onIncrement}
                className="grid h-9 w-9 place-items-center rounded-full bg-emerald-500 text-lg font-semibold text-emerald-950 transition hover:bg-emerald-400">+</button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
