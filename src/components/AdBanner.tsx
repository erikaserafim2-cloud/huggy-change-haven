import { useEffect, useRef } from "react";

/**
 * AdBanner
 * ----------------------------------------------------------------
 * Espaço reutilizável reservado para futura integração com o
 * Google AdSense. Nenhum código de anúncio é injetado agora —
 * apenas o placeholder visual e a estrutura semântica.
 *
 * Uso futuro (quando o AdSense for aprovado):
 *   1. Adicionar o script do AdSense no <head> (via __root.tsx).
 *   2. Preencher `slot` e `client` com os IDs da conta.
 *   3. Descomentar o bloco <ins className="adsbygoogle" ... />
 *      e a chamada `(window.adsbygoogle = window.adsbygoogle || []).push({})`.
 */

export type AdSlot =
  | "horizontal"       // 728x90 / responsivo horizontal (topo/rodapé)
  | "rectangle"        // 300x250 (in-content)
  | "large-rectangle"  // 336x280
  | "square"           // 250x250
  | "vertical"         // 160x600 (sidebar)
  | "responsive";      // auto responsivo

export interface AdBannerProps {
  /** Formato do bloco — controla o tamanho mínimo reservado. */
  slot?: AdSlot;
  /** Ad slot ID (data-ad-slot) — preencher quando ativar o AdSense. */
  adSlot?: string;
  /** Publisher ID (data-ad-client), ex: "ca-pub-XXXXXXXXXXXXXXXX". */
  adClient?: string;
  /** Rótulo opcional exibido no placeholder. */
  label?: string;
  /** Classe extra para posicionamento no layout. */
  className?: string;
}

const SLOT_SIZES: Record<AdSlot, { minH: string; maxW: string }> = {
  horizontal:       { minH: "90px",  maxW: "728px" },
  rectangle:        { minH: "250px", maxW: "300px" },
  "large-rectangle":{ minH: "280px", maxW: "336px" },
  square:           { minH: "250px", maxW: "250px" },
  vertical:         { minH: "600px", maxW: "160px" },
  responsive:       { minH: "120px", maxW: "100%"  },
};

export function AdBanner({
  slot = "responsive",
  adSlot,
  adClient,
  label = "Espaço publicitário",
  className = "",
}: AdBannerProps) {
  const ref = useRef<HTMLModElement | null>(null);
  const enabled = Boolean(adClient && adSlot);

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;
    try {
      // @ts-expect-error — adsbygoogle é injetado pelo script do AdSense
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* silencia falhas do adsbygoogle */
    }
  }, [enabled]);

  const size = SLOT_SIZES[slot];

  return (
    <aside
      role="complementary"
      aria-label={label}
      className={`ad-banner mx-auto w-full ${className}`}
      style={{ maxWidth: size.maxW }}
      data-ad-slot-format={slot}
    >
      {enabled ? (
        <ins
          ref={ref}
          className="adsbygoogle block"
          style={{ display: "block", minHeight: size.minH, width: "100%" }}
          data-ad-client={adClient}
          data-ad-slot={adSlot}
          data-ad-format={slot === "responsive" ? "auto" : undefined}
          data-full-width-responsive={slot === "responsive" ? "true" : undefined}
        />
      ) : (
        <div
          className="flex items-center justify-center rounded-2xl border border-dashed border-border/60 bg-[color-mix(in_oklab,var(--muted)_60%,transparent)] text-[11px] uppercase tracking-widest text-muted-foreground"
          style={{ minHeight: size.minH }}
          aria-hidden
        >
          {label}
        </div>
      )}
    </aside>
  );
}

export default AdBanner;
