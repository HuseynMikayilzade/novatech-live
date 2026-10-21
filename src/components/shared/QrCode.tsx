"use client";

import QRCode from "qrcode";
import { useEffect, useState } from "react";

interface QrCodeProps {
  /** Path on the current origin, so the code always matches the deployed domain. */
  readonly path?: string;
  readonly size?: number;
  readonly className?: string;
}

export function QrCode({ path = "/", size = 240, className }: QrCodeProps) {
  const [svg, setSvg] = useState<string | null>(null);
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    const target = new URL(path, window.location.origin).toString();
    setUrl(target);
    let cancelled = false;
    QRCode.toString(target, { type: "svg", margin: 1, errorCorrectionLevel: "M", color: { dark: "#0e1528", light: "#ffffff" } })
      .then((markup) => !cancelled && setSvg(markup))
      .catch(() => !cancelled && setSvg(null));
    return () => {
      cancelled = true;
    };
  }, [path]);

  return (
    <div
      className={className}
      style={{ width: size, height: size }}
      role="img"
      aria-label={url ? `QR kod: ${url}` : "QR kod yüklənir"}
      // Markup comes from the qrcode library, generated from our own origin.
      dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
    />
  );
}
