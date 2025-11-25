import React, { useEffect, useMemo, useState } from "react";
import { PRODUCTS, Product, Variant } from "./products";
import { calcCart, CartCalc } from "../pricing";
import OrderModal from "./OrderModal";

export default function ShopBlock() {
  const [open, setOpen] = useState(false);
  const [coupon, setCoupon] = useState<string | undefined>(undefined);

  const [pid, setPid] = useState<string>(PRODUCTS[0].id);
  const [vid, setVid] = useState<string>(PRODUCTS[0].defaultVariantId);
  const [qty, setQty] = useState<number>(1);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const c = p.get("coupon") || p.get("kupon") || undefined;
    if (c) setCoupon(c);
  }, []);

  const currentProduct: Product = PRODUCTS.find((p) => p.id === pid)!;
  const variant: Variant = currentProduct.variants.find((v) => v.id === vid)!;
  const priceInfo: CartCalc = useMemo(
    () => calcCart({ productId: pid as any, variantId: vid, qty, coupon }),
    [pid, vid, qty, coupon]
  );

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => q + 1);

  // Funkcija za određivanje slike bazirano na proizvodu (pid)
  const getPreviewImage = () => {
    if (pid === 'starter') return '/images/start-kit-preview.webp'; // Slika za start-kit
    if (pid === 'refill') return '/images/sticker-only-preview.webp'; // Slika za samo stikere
    return null; // Ako ne odgovara, ne prikazuj sliku
  };

  return (
    <>
      <section id="order" className="scroll-mt-28 max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-semibold text-white mb-2">Poruči</h2>
        <p className="text-gray-300 mb-4">{currentProduct.subtitle}</p>

        {/* Flex container za sliku u gornjem desnom uglu */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
          {/* Levi deo: Tabs i varijante */}
          <div className="w-full md:w-1/2">
            {/* Tabs: proizvodi */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {PRODUCTS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setPid(p.id);
                    setVid(p.defaultVariantId);
                    setQty(1);
                  }}
                  className={`px-4 py-2 rounded-xl border ${
                    p.id === pid
                      ? "bg-teal-500 text-gray-900 border-teal-400"
                      : "bg-gray-800 text-gray-200 border-gray-700"
                  }`}
                >
                  {p.title}
                </button>
              ))}
            </div>

            {/* Varijante */}
            <div className="flex gap-2 flex-wrap mb-3">
              {currentProduct.variants.map((v) => (
                <button
                  key={v.id}
                  disabled={!v.inStock}
                  onClick={() => setVid(v.id)}
                  className={`px-4 py-2 rounded-xl border ${
                    vid === v.id
                      ? "bg-gray-100 text-gray-900 border-gray-300"
                      : "bg-gray-800 text-gray-200 border-gray-700"
                  } disabled:opacity-50`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          {/* Desni deo: Slika u gornjem desnom uglu, smanjena i vertikalno isečena */}
          <div className="w-full md:w-auto md:ml-auto mt-4 md:mt-0 flex justify-center md:justify-end">
            <div className="p-2 rounded-lg"> {/* Mali padding za spacing */}
              {getPreviewImage() ? (
                <img
                  src={getPreviewImage()}
                  alt="Preview selektovanog proizvoda"
                  className="max-w-[200px] h-40 object-cover rounded-md md:max-w-[250px] md:h-48" // Smanjena: max 200px širine, 160px visine (isečeno cover-om); veće na desktopu
                />
              ) : (
                <p className="text-center text-gray-400">Odaberi proizvod da vidiš preview</p>
              )}
            </div>
          </div>
        </div>

        {/* Cena po komadu */}
        <div className="text-white mb-2 flex items-center gap-2 flex-wrap">
          {variant.compareAt ? (
            <span className="line-through opacity-60 mr-2">
              {variant.compareAt.toLocaleString("sr-RS")} RSD
            </span>
          ) : null}
          <b>{priceInfo.unitPrice.toLocaleString("sr-RS")} RSD</b>
          <span className="opacity-70">/ kom</span>
          {priceInfo.couponApplied ? (
            <span className="ml-2 text-teal-400 text-sm">
              Kupon {priceInfo.couponApplied}
            </span>
          ) : null}
          {priceInfo.gift && (
            <span className="ml-2 rounded-full px-3 py-1 text-xs bg-amber-400/20 text-amber-300 border border-amber-300/30">
              🎁 Poklon iznenađenja
            </span>
          )}
        </div>

        {/* Količina + promo kod */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
          <div className="flex items-center gap-3">
            <label className="text-gray-300">Količina</label>
            <div className="flex items-center rounded-lg overflow-hidden border border-gray-700">
              <button onClick={dec} className="px-3 py-2 bg-gray-800 text-white hover:bg-gray-700" aria-label="Smanji količinu">–</button>
              <div className="px-4 py-2 bg-gray-900 text-white min-w-[3rem] text-center">{qty}</div>
              <button onClick={inc} className="px-3 py-2 bg-gray-800 text-white hover:bg-gray-700" aria-label="Povećaj količinu">+</button>
            </div>
          </div>

          <div className="flex-1" />

          {/* Promo kod input */}
          <div className="flex items-center gap-2">
            <label className="text-gray-300">Promo kod</label>
            <input
              value={coupon || ""}
              onChange={(e) => setCoupon(e.target.value || undefined)}
              placeholder=" preko 5000RSD = poklon!"
              className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
            />
          </div>
        </div>

        {/* Info o gratisu */}
        {(priceInfo.freebies ?? 0) > 0 && (
          <div className="mb-3 text-teal-400 text-sm">
            + {priceInfo.freebies}{" "}
            {priceInfo.freebiesLabel === "nalepnica" ? "nalepnica" : "paket"}
            {priceInfo.freebies > 1 ? "" : ""} gratis
            {pid === "starter" ? " (3+1)" : ""}
          </div>
        )}

        {/* Pregled suma */}
        <div className="text-gray-300 text-sm mb-4">
          Subtotal: {priceInfo.subtotal.toLocaleString("sr-RS")} RSD · Popust: -
          {priceInfo.discount.toLocaleString("sr-RS")} RSD   {" "}
          {priceInfo.shipping ? "+ dostava" : "·  Besplatna dostava"}
        </div>
 
        <div className="flex items-center justify-between">
          <div className="text-xl text-white">
            Ukupno: <b>{priceInfo.subtotal.toLocaleString("sr-RS")} RSD</b>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="px-6 py-3 rounded-xl bg-teal-500 text-gray-900 font-semibold hover:bg-teal-400"
          >
            Poruči
          </button>
        </div>
      </section>

      {/* Modal (bez slike) */}
      <OrderModal
        open={open}
        onClose={() => setOpen(false)}
        product={{
          name: `${priceInfo.productTitle} – ${priceInfo.variantLabel}`,
          price: priceInfo.unitPrice,
        }}
        summary={{
          qty,
          freebies: priceInfo.freebies,
          subtotal: priceInfo.subtotal,
          discount: priceInfo.discount,
          shipping: priceInfo.shipping,
          total: priceInfo.total,
          coupon: priceInfo.couponApplied || (coupon ? coupon.toUpperCase() : undefined),
        }}
      />
    </>
  );
}