import { useMemo, useState } from "react";
import "./App.css";
import { EVENTS, ARTICLES } from "./data";
import { LANGS, getLang, setLang, t } from "./i18n";
import Calendar from "./components/Calendar/Calendar";
import Knowledge from "./components/Knowledge/Knowledge";
import Header from "./components/Header/Header";


function formatDateDE(iso) {
  // iso = YYYY-MM-DD
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString("de-DE", { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric" });
}

function pickI18n(value, lang) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") return value[lang] || value.de || value.en || value.ru || "";
  return "";
}

function eventText(ev, lang) {
  // deine Events haben i18n: {de:{title,location}, ...}
  const tr = (ev && ev.i18n && (ev.i18n[lang] || ev.i18n.de || ev.i18n.en || ev.i18n.ru)) || {};
  return {
    title: tr.title || ev.title || "",
    location: tr.location || ev.location || ""
  };
}

export default function App() {
  const [tab, setTab] = useState("kalender"); // "kalender" | "wiki"
  const [lang, setLanguage] = useState(getLang());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [queryEvents, setQueryEvents] = useState("");
  const [queryArticles, setQueryArticles] = useState("");
  const [openArticleId, setOpenArticleId] = useState(null);

const filteredEvents = useMemo(() => {
  const q = queryEvents.trim().toLowerCase();
  return EVENTS
    .filter((e) => {
      if (!q) return true;
      const tx = eventText(e, lang);
      return (tx.title + " " + tx.location + " " + e.date).toLowerCase().includes(q);
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}, [queryEvents, lang]);

const filteredArticles = useMemo(() => {
  const q = queryArticles.trim().toLowerCase();
  return ARTICLES
    .filter((a) => {
      if (!q) return true;
      const title = pickI18n(a.title, lang);
      const category = pickI18n(a.category, lang);
      const body = pickI18n(a.content, lang);
      return (title + " " + category + " " + body).toLowerCase().includes(q);
    })
    .sort((a, b) => {
      const ca = pickI18n(a.category, lang);
      const cb = pickI18n(b.category, lang);
      const ta = pickI18n(a.title, lang);
      const tb = pickI18n(b.title, lang);
      return ca.localeCompare(cb) || ta.localeCompare(tb);
    });
}, [queryArticles, lang]);

  return (
    <div className="container">
      <Header
        lang={lang}
        setLanguage={(code) => {
          setLanguage(code);
          setLang(code);
        }}
          LANGS={LANGS}
          t={t}
          tab={tab}
          setTab={setTab}
      />

      <div className="toolbar">
        <input
          className="search"
          value={tab === "kalender" ? queryEvents : queryArticles}
          onChange={(e) => {
            const v = e.target.value;
            if (tab === "kalender") setQueryEvents(v);
            else setQueryArticles(v);
          }}
          placeholder={tab === "kalender" ? t(lang, "searchEvents") : t(lang, "searchArticles")}
        />
      </div>

      <main className="main">
        {tab === "kalender" ? (
          <Calendar
            EVENTS={filteredEvents}
            lang={lang}
            t={t}
            formatDateDE={formatDateDE}
            onOpenArticle={(articleId) => {
              setQueryArticles("");      // Wiki-Suche leeren
              setOpenArticleId(articleId);
              setTab("wiki");
            }}
          />
        ) : (
          <Knowledge
            ARTICLES={filteredArticles}
            lang={lang}
            t={t}
            query={queryArticles}
            openArticleId={openArticleId}
            onOpened={() => setOpenArticleId(null)}
          />
        )}
      </main>

      <footer className="footer muted">
        Demo Version
      </footer>
    </div>
  );
}
