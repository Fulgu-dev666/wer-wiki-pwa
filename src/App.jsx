import { useMemo, useState } from "react";
import "./App.css";
import { EVENTS, ARTICLES } from "./data";

function formatDateDE(iso) {
  // iso = YYYY-MM-DD
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString("de-DE", { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function App() {
  const [tab, setTab] = useState("kalender"); // "kalender" | "wiki"
  const [query, setQuery] = useState("");

  const filteredEvents = useMemo(() => {
    const q = query.trim().toLowerCase();
    return EVENTS.filter((e) => {
      if (!q) return true;
      return (e.title + " " + e.location + " " + e.date).toLowerCase().includes(q);
    }).sort((a, b) => a.date.localeCompare(b.date));
  }, [query]);

  const filteredArticles = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ARTICLES.filter((a) => {
      if (!q) return true;
      return (a.title + " " + a.category + " " + a.body).toLowerCase().includes(q);
    }).sort((a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title));
  }, [query]);

  return (
    <div className="container">
      <header className="header">
        <div>
          <h1 className="title">WeR Jugend</h1>
          <p className="subtitle">Kalender & Wissen</p>
        </div>

        <div className="tabs">
          <button className={tab === "kalender" ? "tab active" : "tab"} onClick={() => setTab("kalender")}>
            Kalender
          </button>
          <button className={tab === "wiki" ? "tab active" : "tab"} onClick={() => setTab("wiki")}>
            Wissen
          </button>
        </div>
      </header>

      <div className="toolbar">
        <input
          className="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={tab === "kalender" ? "Suche Termine…" : "Suche Artikel…"}
        />
      </div>

      <main className="main">
        {tab === "kalender" ? (
          <section className="card">
            <h2 className="cardTitle">Termine</h2>
            {filteredEvents.length === 0 ? (
              <p className="muted">Keine Treffer.</p>
            ) : (
              <ul className="list">
                {filteredEvents.map((e) => (
                  <li key={e.date + e.title} className="listItem">
                    <div className="listTop">
                      <span className="badge">{formatDateDE(e.date)}</span>
                      <span className="itemTitle">{e.title}</span>
                    </div>
                    <div className="muted">{e.location}</div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ) : (
          <section className="card">
            <h2 className="cardTitle">Wissensdatenbank</h2>
            {filteredArticles.length === 0 ? (
              <p className="muted">Keine Treffer.</p>
            ) : (
              <ul className="list">
                {filteredArticles.map((a) => (
                  <li key={a.id} className="listItem">
                    <div className="listTop">
                      <span className="badge">{a.category}</span>
                      <span className="itemTitle">{a.title}</span>
                    </div>
                    <pre className="articleBody">{a.body}</pre>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </main>

      <footer className="footer muted">
        Tipp: Später können wir daraus eine installierbare PWA machen und den Spielplan als Datei pflegen.
      </footer>
    </div>
  );
}
