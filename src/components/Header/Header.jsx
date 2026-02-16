export default function Header({
  lang,
  setLanguage,
  LANGS,
  t,
  tab,
  setTab
}) {
  return (
    <header className="header headerGrid">
      <div className="headerLeft">
        <h1 className="title">{t(lang, "appTitle")}</h1>
        <p className="subtitle">{t(lang, "appSubtitle")}</p>
      </div>

      <div className="headerCenter">
        <span className="muted" style={{ fontSize: 12 }}>
          {t(lang, "language")}:
        </span>

        <select
          value={lang}
          onChange={(e) => setLanguage(e.target.value)}
          className="tab"
          style={{ padding: "6px 10px" }}
        >
          {LANGS.map((l) => (
            <option key={l.code} value={l.code}>
              {l.label}
            </option>
          ))}
        </select>
      </div>

      <div className="headerRight">
        <div className="tabs">
          <button
            className={tab === "kalender" ? "tab active" : "tab"}
            onClick={() => setTab("kalender")}
          >
            {t(lang, "tabCalendar")}
          </button>

          <button
            className={tab === "wiki" ? "tab active" : "tab"}
            onClick={() => setTab("wiki")}
          >
            {t(lang, "tabKnowledge")}
          </button>
        </div>
      </div>
    </header>
  );
}
