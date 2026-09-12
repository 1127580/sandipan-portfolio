import { useEffect, useMemo, useState } from "react";
import { searchableContent } from "../data";

export function SearchDialog({ open, onClose }) {
  const [query, setQuery] = useState("");
  useEffect(() => { if (open) setQuery(""); }, [open]);
  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return searchableContent.slice(0, 5);
    return searchableContent.filter((item) => JSON.stringify(item).toLowerCase().includes(term));
  }, [query]);
  if (!open) return null;
  return <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}>
    <section className="search-dialog" role="dialog" aria-modal="true" aria-label="Search portfolio" onMouseDown={(e) => e.stopPropagation()}>
      <div className="search-input"><span aria-hidden="true">⌕</span><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search portfolio knowledge…" /><button onClick={onClose}>Esc</button></div>
      <p className="search-hint">Searches verified portfolio data — skills, projects, education, achievements, and learning.</p>
      <div className="results">{results.length ? results.map((result, index) => <article key={`${result.type}-${result.title}-${index}`}><span>{result.type}</span><div><strong>{result.title}</strong><p>{result.summary}</p></div></article>) : <p className="empty">No matching portfolio information yet.</p>}</div>
    </section>
  </div>;
}
