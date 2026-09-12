import { useEffect, useRef } from "react";
import { AIChat } from "./AIChat";

export function AISheet({ open, onClose }) {
  const closeButtonRef = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => { if (event.key === "Escape") onClose(); };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", onKeyDown); };
  }, [open, onClose]);

  return <div className={`ai-sheet-layer ${open ? "is-open" : ""}`} aria-hidden={!open}>
    <div className="ai-sheet-overlay" onMouseDown={onClose} />
    <section className="ai-sheet" role="dialog" aria-modal="true" aria-labelledby="ai-sheet-title" onMouseDown={(event) => event.stopPropagation()}>
      <div className="sheet-handle" aria-hidden="true" />
      <header className="ai-sheet-header"><div><h2 id="ai-sheet-title">✦ Sandipan AI</h2><p>Ask anything about Sandipan.</p><small>Answers are based on verified portfolio information.</small></div><button className="sheet-close" ref={closeButtonRef} onClick={onClose} aria-label="Close Sandipan AI">×</button></header>
      <AIChat showHeader={false} />
    </section>
  </div>;
}
