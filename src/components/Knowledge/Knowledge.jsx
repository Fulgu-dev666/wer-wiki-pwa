import { useEffect, useMemo, useRef } from "react";

function pickI18n(value, lang) {
  // value kann sein: {de:"..", en:".."} oder string oder undefined
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") return value[lang] || value.de || value.en || value.ru || "";
  return "";
}

function articleText(article, lang) {
  return {
    id: article?.articleId || "",
    title: pickI18n(article?.title, lang),
    category: pickI18n(article?.category, lang),
    body: pickI18n(article?.content, lang),
  };
}

export default function Knowledge({
  ARTICLES,
  lang,
  t,
  query,
  openArticleId,
  onOpened,
}) {
  const list = Array.isArray(ARTICLES) ? ARTICLES : [];
  const q = (query || "").trim().toLowerCase();

  const filtered = useMemo(() => {
    return list
      .filter((a) => {
        const tx = articleText(a, lang);
        if (!q) return true;
        return (tx.title + " " + tx.category + " " + tx.body)
          .toLowerCase()
          .includes(q);
      })
      .sort((a, b) => {
        const ta = articleText(a, lang);
        const tb = articleText(b, lang);
        return (
          (ta.category || "").localeCompare(tb.category || "") ||
          (ta.title || "").localeCompare(tb.title || "")
        );
      });
  }, [list, lang, q]);

  // Wenn ein Artikel gezielt geöffnet werden soll (z.B. aus dem Kalender),
  // zeigen wir ihn bevorzugt oben an.
  const ordered = useMemo(() => {
    if (!openArticleId) return filtered;

    const top = [];
    const rest = [];
    for (const a of filtered) {
      if (a?.articleId === openArticleId) top.push(a);
      else rest.push(a);
    }
    return top.length ? [...top, ...rest] : filtered;
  }, [filtered, openArticleId]);

  const grouped = useMemo(() => {
    const map = new Map();
    for (const a of ordered) {
      const g = pickI18n(a?.group, lang) || "Ohne Gruppe";
      if (!map.has(g)) map.set(g, []);
      map.get(g).push(a);
    }
    return Array.from(map.entries());
  }, [ordered, lang]);

  // Scroll/Highlight auf den geöffneten Artikel
  const openRef = useRef(null);

  useEffect(() => {
    if (!openArticleId) return;

    // kleine Verzögerung, damit DOM sicher steht
    const id = window.setTimeout(() => {
      if (openRef.current) {
        openRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      onOpened?.();
    }, 50);

    return () => window.clearTimeout(id);
  }, [openArticleId, onOpened]);

  return (
  <section className="card">
    <h2 className="cardTitle">{t(lang, "knowledgeTitle")}</h2>

    {grouped.length === 0 ? (
      <p className="muted">{t(lang, "noResults")}</p>
    ) : (
      grouped.map(([groupName, items]) => (
        <div key={groupName} className="kbGroup">
          <h3 className="kbGroupTitle">{groupName}</h3>

          <ul className="list">
            {items.map((a, idx) => {
              const tx = articleText(a, lang);
              const isOpen =
                openArticleId && a?.articleId === openArticleId;

              return (
                <li
                  key={a?.articleId || idx}
                  className={"listItem" + (isOpen ? " isOpen" : "")}
                  ref={isOpen ? openRef : null}
                >
                  <div className="listTop">
                    {tx.category && (
                      <span className="badge">{tx.category}</span>
                    )}
                    <span className="itemTitle">{tx.title}</span>
                  </div>

                  <pre className="articleBody">{tx.body}</pre>
                </li>
              );
            })}
          </ul>
        </div>
      ))
    )}
  </section>
);
}
