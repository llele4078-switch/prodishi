import React, { useEffect, useState, useCallback, useRef } from "react";

type Summary = {
  qty: number;
  freebies: number;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  coupon?: string;
};

type OrderItem = {
  sku: string;
  title: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
};

type Extras = {
  starterQty?: number;
  refillQty?: number;
  starter30Qty?: number;
  refill30Qty?: number;
  freebies?: number;
  freebiesValue?: number;
  shippingCost?: number;
  couponSavings?: number;
  listSubtotal?: number;
  netSubtotal?: number;
  items?: OrderItem[];
};

type Props = {
  open: boolean;
  onClose: () => void;
  product?: { name: string; price: number };
  summary?: Summary;
  extras?: Extras;
};

const FREE_SHIPPING_THRESHOLD = 3000;

const WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbw40RQuCWmfg4BRqGLAbyaakzga-hM4DGfJLC1Ci4R5jsCMdAiMPdjP0H99lNLkj-9l/exec";

const formatCurrency = (value: number) =>
  `${Math.max(0, Math.round(value)).toLocaleString("sr-RS")} RSD`;

const SummaryRow = ({
  label,
  value,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
}) => (
  <div className="flex items-start justify-between py-1 gap-3">
    <span className="flex-shrink-0">{label}</span>
    <span className="text-right">{value}</span>
  </div>
);

function normalizePhoneRS(input: string): string {
  const raw = (input || "").replace(/\s+/g, "");
  if (!raw) return "";
  if (raw.startsWith("+")) return "+" + raw.replace(/[^\d]/g, "");
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("381")) return "+" + digits;
  if (digits.startsWith("0")) return "+381" + digits.slice(1);
  if (digits.startsWith("6") && digits.length >= 8 && digits.length <= 9)
    return "+381" + digits;
  return "+" + digits;
}

export default function OrderModal({
  open,
  onClose,
  product,
  summary,
  extras,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  const [form, setForm] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    address: "",
    postalCode: "",
    city: "",
    note: "",
  });
  const [consentShipping, setConsentShipping] = useState(true);
  const [consentAbandoned] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Refs za sva polja
  const emailRef = useRef<HTMLInputElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const postalCodeRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  // Body lock
  useEffect(() => {
    if (!open) return;
    
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  // Load saved contact data & generate token
  useEffect(() => {
    if (!open) return;
    const saved = localStorage.getItem("order_contact");
    if (saved) setForm((f) => ({ ...f, ...JSON.parse(saved) }));
    const newToken =
      (crypto as any)?.randomUUID?.() ||
      String(Date.now()) + Math.random().toString(36).slice(2);
    setToken(newToken);
    localStorage.setItem("order_token", newToken);
  }, [open]);

  // Focus handling
  useEffect(() => {
    if (!open) return;
    
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        setTimeout(() => {
          target.scrollIntoView({ 
            behavior: "auto",
            block: "center", 
            inline: "nearest" 
          });
        }, 100);
      }
    };
    
    document.addEventListener("focusin", handleFocus, { passive: true } as any);
    return () => document.removeEventListener("focusin", handleFocus);
  }, [open]);

  // Viewport handling za iOS
  useEffect(() => {
    if (!open) return;
    
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (!isIOS) return;

    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      
      resizeTimeoutRef.current = setTimeout(() => {
        const vv = window.visualViewport?.height || window.innerHeight;
        document.documentElement.style.setProperty("--viewport-height", `${vv}px`);
      }, 50);
    };

    handleResize();
    window.visualViewport?.addEventListener("resize", handleResize);

    return () => {
      window.visualViewport?.removeEventListener("resize", handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      document.documentElement.style.removeProperty("--viewport-height");
    };
  }, [open]);

  // Auto-hide error toast
  useEffect(() => {
    if (showErrorToast) {
      const timer = setTimeout(() => {
        setShowErrorToast(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showErrorToast]);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (!form) return;

      const inputs = Array.from(
        form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
          'input:not([type="checkbox"]):not([type="hidden"]), textarea'
        )
      );

      const currentIndex = inputs.indexOf(e.currentTarget);
      const nextInput = inputs[currentIndex + 1];

      if (e.currentTarget.getAttribute("type") === "tel") {
        e.currentTarget.blur();
        return;
      }
      if (nextInput) {
        nextInput.focus();
      } else {
        form.requestSubmit();
      }
    }
  };

  const validate = (): { error: string; field: React.RefObject<HTMLInputElement> } | null => {
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      return { error: "Unesite ispravan email.", field: emailRef };
    }
    if (!form.firstName.trim()) {
      return { error: "Unesite ime.", field: firstNameRef };
    }
    if (!form.lastName.trim()) {
      return { error: "Unesite prezime.", field: lastNameRef };
    }
    if (form.address.trim().length < 5) {
      return { error: "Unesite adresu (minimum 5 karaktera).", field: addressRef };
    }
    if (form.postalCode.trim().length < 3) {
      return { error: "Unesite poštanski broj (minimum 3 broja).", field: postalCodeRef };
    }
    if (!form.city.trim()) {
      return { error: "Unesite grad.", field: cityRef };
    }
    const normalized = normalizePhoneRS(form.phone);
    if (!/^\+\d{7,15}$/.test(normalized)) {
      return { 
        error: "Unesite ispravan broj telefona.", 
        field: phoneRef 
      };
    }
    if (!consentShipping) {
      return { error: "Morate prihvatiti kontakt radi isporuke.", field: null as any };
    }
    return null;
  };

  const startDraftIfNeeded = useCallback(
    async (email: string) => {
      if (!/^\S+@\S+\.\S+$/.test(email)) return;
      let localToken = token;
      if (!localToken) {
        localToken =
          (crypto as any)?.randomUUID?.() ||
          String(Date.now()) + Math.random().toString(36).slice(2);
        setToken(localToken);
        localStorage.setItem("order_token", localToken);
      }
      if (!WEBHOOK_URL) return;
      try {
        await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({
            type: "start",
            token: localToken,
            email,
            consentAbandoned,
            source: window.location.pathname,
            utm: window.location.search,
            product: product?.name || "",
            subtotal: extras?.netSubtotal ?? summary?.subtotal ?? 0,
            discount: extras?.couponSavings ?? summary?.discount ?? 0,
            total: summary?.total ?? (extras?.netSubtotal ?? summary?.subtotal ?? 0),
            coupon: summary?.coupon || "",
            items: extras?.items ?? [],
          }),
        });
      } catch {
        /* ignore */
      }
    },
    [token, consentAbandoned, product?.name, summary, extras]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setOkMsg(null);
    setErrMsg(null);
    setShowErrorToast(false);

    const validationResult = validate();
    if (validationResult) {
      // Zatvori tastaturu prvo
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }

      // Prikaži error toast
      setErrMsg(validationResult.error);
      setShowErrorToast(true);

      // Nakon kratkog delay-a, fokusiraj polje sa greškom
      setTimeout(() => {
        if (validationResult.field?.current) {
          validationResult.field.current.focus();
          validationResult.field.current.scrollIntoView({ 
            behavior: "smooth", 
            block: "center" 
          });
        }
      }, 300);
      
      return;
    }

    try {
      setLoading(true);
      const normalizedPhone = normalizePhoneRS(form.phone);

      localStorage.setItem(
        "order_contact",
        JSON.stringify({
          email: form.email,
          phone: normalizedPhone,
          firstName: form.firstName,
          lastName: form.lastName,
          address: form.address,
          postalCode: form.postalCode,
          city: form.city,
        })
      );

      const subtotalNet =
        extras?.netSubtotal ?? summary?.subtotal ?? product?.price ?? 0;
      const discountValue = extras?.couponSavings ?? summary?.discount ?? 0;
      const shippingValue = summary?.shipping ?? extras?.shippingCost ?? 0;
      const totalValue = summary?.total ?? subtotalNet + (shippingValue ?? 0);

      const payload: any = {
        type: "complete",
        token,
        ...form,
        phone: normalizedPhone,
        consentAbandoned,
        consentShipping,
        source: window.location.pathname,
        utm: window.location.search,

        product: product?.name || "",
        price: product?.price ?? subtotalNet,
        qty: summary?.qty ?? 0,

        discount: discountValue,
        shipping: shippingValue ?? 0,
        subtotal: subtotalNet,
        total: totalValue,
        coupon: summary?.coupon ?? "",

        starter30Qty: extras?.starter30Qty ?? 0,
        refill30Qty: extras?.refill30Qty ?? 0,

        freebiesValue: extras?.freebiesValue ?? 0,
        shippingCost: extras?.shippingCost ?? (shippingValue ?? 0),
        items: extras?.items ?? [],
      };

      if (!WEBHOOK_URL) {
        console.log("[DEMO] payload", payload);
        setOkMsg("Demo: podaci su spremni (server još nije povezan).");
      } else {
        const res = await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload),
        });
        const txt = await res.text();
        const data = (() => {
          try {
            return JSON.parse(txt);
          } catch {
            return {};
          }
        })() as any;
        if (!data.ok) throw new Error(data.error || "Greška na serveru.");
        setOkMsg("Hvala! Porudžbina je primljena. Uskoro stiže potvrda.");
        setToken(null);
        localStorage.removeItem("order_token");
      }

      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        onClose();
      }, 1600);
    } catch (err: any) {
      setErrMsg(err.message || "Nešto nije u redu. Pokušajte ponovo.");
      setShowErrorToast(true);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const onOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const originalSubtotal = extras?.listSubtotal;
  const netSubtotal = extras?.netSubtotal ?? summary?.subtotal ?? 0;
  const couponSavings = extras?.couponSavings ?? summary?.discount ?? 0;
  const freebiesValue = extras?.freebiesValue ?? 0;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ 
        height: "100dvh",
        maxHeight: "-webkit-fill-available"
      }}
      aria-modal="true"
      role="dialog"
      onMouseDown={onOverlayClick}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-lg md:max-w-2xl flex flex-col rounded-2xl bg-gray-900 border border-gray-800 shadow-2xl"
        style={{
          maxHeight: "calc(100dvh - 2rem)",
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-5 py-4 md:px-6 bg-gray-900 border-b border-gray-800 rounded-t-2xl">
          <h3 className="text-lg md:text-xl font-semibold text-white">
            Porudžbina (pouzećem)
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
            aria-label="Zatvori"
          >
            ✕
          </button>
        </div>

        {/* SCROLL AREA */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-5 md:px-6 py-4"
          style={{
            WebkitOverflowScrolling: "touch",
            overscrollBehavior: "contain"
          }}
        >
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm text-gray-300">Email</label>
              <input
                ref={emailRef}
                type="email"
                required
                inputMode="email"
                autoComplete="email"
                enterKeyHint="next"
                className="mt-1 w-full rounded-xl bg-gray-800/70 border border-gray-700 px-4 py-3 text-white text-[16px]"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                onBlur={(e) => startDraftIfNeeded(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="vas@email.com"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">Ime</label>
              <input
                ref={firstNameRef}
                type="text"
                inputMode="text"
                autoComplete="given-name"
                enterKeyHint="next"
                className="mt-1 w-full rounded-xl bg-gray-800/70 border border-gray-700 px-4 py-3 text-white text-[16px]"
                value={form.firstName}
                onChange={(e) => set("firstName", e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ime"
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-300">Prezime</label>
              <input
                ref={lastNameRef}
                type="text"
                inputMode="text"
                autoComplete="family-name"
                enterKeyHint="next"
                className="mt-1 w-full rounded-xl bg-gray-800/70 border border-gray-700 px-4 py-3 text-white text-[16px]"
                value={form.lastName}
                onChange={(e) => set("lastName", e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Prezime"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-gray-300">Adresa</label>
              <input
                ref={addressRef}
                type="text"
                inputMode="text"
                autoComplete="street-address"
                enterKeyHint="next"
                className="mt-1 w-full rounded-xl bg-gray-800/70 border border-gray-700 px-4 py-3 text-white text-[16px]"
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ulica i broj"
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">Poštanski broj</label>
              <input
                ref={postalCodeRef}
                type="text"
                inputMode="numeric"
                autoComplete="postal-code"
                enterKeyHint="next"
                className="mt-1 w-full rounded-xl bg-gray-800/70 border border-gray-700 px-4 py-3 text-white text-[16px]"
                value={form.postalCode}
                onChange={(e) => set("postalCode", e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="11000"
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-300">Grad</label>
              <input
                ref={cityRef}
                type="text"
                inputMode="text"
                autoComplete="address-level2"
                enterKeyHint="next"
                className="mt-1 w-full rounded-xl bg-gray-800/70 border border-gray-700 px-4 py-3 text-white text-[16px]"
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Beograd"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-gray-300">Telefon</label>
              <input
                ref={phoneRef}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                enterKeyHint="done"
                className="mt-1 w-full rounded-xl bg-gray-800/70 border border-gray-700 px-4 py-3 text-white text-[16px]"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                onBlur={(e) => set("phone", normalizePhoneRS(e.target.value))}
                onKeyDown={handleKeyDown}
                placeholder="+381 6x xxx xxxx"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-gray-300">Napomena (opciono)</label>
              <textarea
                rows={3}
                enterKeyHint="done"
                className="mt-1 w-full rounded-xl bg-gray-800/70 border border-gray-700 px-4 py-3 text-white text-[16px]"
                value={form.note}
                onChange={(e) => set("note", e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Vreme dostave, interfon..."
              />
            </div>

            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={consentShipping}
                  onChange={(e) => setConsentShipping(e.target.checked)}
                />
                Prihvatam da me kontaktirate radi isporuke (obavezno).
              </label>
            </div>

            {summary && (
              <div className="md:col-span-2 mt-1 rounded-xl bg-gray-800/60 border border-gray-700 p-4 text-sm text-gray-200 space-y-1">
                <SummaryRow
                  label="Proizvod"
                  value={product?.name || "-"}
                />
                <SummaryRow
                  label="Količina"
                  value={
                    <>
                      {summary.qty}
                      {summary.freebies > 0 ? ` (+${summary.freebies} gratis)` : ""}
                    </>
                  }
                />
                {summary.coupon && <SummaryRow label="Kupon" value={summary.coupon} />}

                {originalSubtotal && couponSavings > 0 ? (
                  <>
                    <SummaryRow
                      label="Vrednost (pre kupona)"
                      value={formatCurrency(originalSubtotal)}
                    />
                    <SummaryRow
                      label={`Kupon ${summary.coupon}`}
                      value={`−${formatCurrency(couponSavings)}`}
                    />
                    <div className="h-px bg-gray-700 my-2" />
                  </>
                ) : null}
                <SummaryRow label="Međuzbir" value={formatCurrency(netSubtotal)} />
              
                <SummaryRow
                  label="Dostava"
                  value={netSubtotal >= FREE_SHIPPING_THRESHOLD ? "Besplatna" : "+ dostava"}
                />
                <div className="h-px bg-gray-700 my-2" />
                <SummaryRow
                  label={<span className="text-white font-semibold">Ukupno</span>}
                  value={<span className="text-white font-semibold">{formatCurrency(summary.total)}</span>}
                />
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 bg-gray-900 border-t border-gray-800 rounded-b-2xl">
          <div className="px-5 md:px-6 py-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl border border-gray-700 text-gray-200 hover:bg-gray-800/60"
            >
              Otkaži
            </button>
            <button
              onClick={(e) => {
                const formEl = (
                  e.currentTarget.closest("[role='dialog']") as HTMLElement
                ).querySelector("form") as HTMLFormElement | null;
                if (formEl) formEl.requestSubmit();
              }}
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-teal-500 text-gray-900 font-semibold hover:bg-teal-400 disabled:opacity-60"
            >
              {loading ? "Slanje..." : "Poruči"}
            </button>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      <div
        className={`pointer-events-none fixed inset-0 z-[999] flex items-start justify-center transition-all duration-300 ${
          showToast ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      >
        <div
          className={`mt-10 transform-gpu transition-all ${
            showToast ? "scale-100 translate-y-0" : "scale-95 -translate-y-3"
          }`}
        >
          <div className="rounded-2xl bg-emerald-500/95 text-gray-900 shadow-2xl px-6 py-4 sm:px-8 sm:py-5">
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/90 shadow">
                ✅
              </span>
              <div className="text-left">
                <div className="text-lg sm:text-2xl font-extrabold leading-tight">
                  Poručeno!
                </div>
                <div className="text-sm sm:text-base opacity-90">
                  Potvrda stiže na e-mail. Hvala!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Toast */}
      <div
        className={`pointer-events-none fixed inset-0 z-[999] flex items-start justify-center transition-all duration-300 ${
          showErrorToast ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      >
        <div
          className={`mt-10 mx-4 transform-gpu transition-all ${
            showErrorToast ? "scale-100 translate-y-0" : "scale-95 -translate-y-3"
          }`}
        >
          <div className="rounded-2xl bg-rose-500/95 text-white shadow-2xl px-6 py-4 sm:px-8 sm:py-5 max-w-md">
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/90 shadow text-2xl">
                ⚠️
              </span>
              <div className="text-left flex-1">
                <div className="text-base sm:text-lg font-bold leading-tight">
                  Greška
                </div>
                <div className="text-sm sm:text-base opacity-90 mt-1">
                  {errMsg}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}