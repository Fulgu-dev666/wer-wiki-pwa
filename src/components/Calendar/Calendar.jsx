import { useMemo, useState } from "react";

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function pickI18n(obj, lang) {
  return (obj && (obj[lang] || obj.de || obj.en || obj.ru)) || {};
}

function eventText(e, lang) {
  const tr = pickI18n(e.i18n, lang);
  return {
    title: tr.title || "",
    location: tr.location || "",
  };
}

function isoDate(dt) {
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const d = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function Calendar({ EVENTS, lang, t, formatDateDE, onOpenArticle }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null); // 1..31 oder null

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-11

  // Events im aktuellen Monat nach Tag gruppieren
  const monthEventsByDay = useMemo(() => {
    const map = new Map();
    for (const e of EVENTS) {
      const [y, m, d] = e.date.split("-").map(Number);
      if (y === year && m === month + 1) {
        if (!map.has(d)) map.set(d, []);
        map.get(d).push(e);
      }
    }
    return map;
  }, [EVENTS, year, month]);

  const selectedEvents = selectedDay ? monthEventsByDay.get(selectedDay) || [] : [];

  // Heute & morgen (für "Nächste Termine")
  const nextTwoDays = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const dayAfter = new Date(today);
    dayAfter.setDate(today.getDate() + 2); // exklusives Ende

    return EVENTS
      .filter((e) => {
        const dt = new Date(`${e.date}T00:00:00`);
        return dt >= today && dt < dayAfter; // heute oder morgen
      })
      .slice()
      .sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return (a.startTime || "").localeCompare(b.startTime || "");
      });
  }, [EVENTS]);

  // Wenn Monat gewechselt wird: ausgewählten Tag zurücksetzen (verhindert "falsche" Tagesanzeige)
  function goMonth(delta) {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() + delta);
    setCurrentDate(d);
    setSelectedDay(null);
  }

  const daysInMonth = getDaysInMonth(year, month);
  const firstWeekday = new Date(year, month, 1).getDay(); // 0=So ... 6=Sa
  const offset = (firstWeekday + 6) % 7; // Montag=0 ... Sonntag=6

  const cells = [];
  for (let i = 0; i < offset; i++) cells.push({ empty: true, key: `e-${i}` });
  for (let day = 1; day <= daysInMonth; day++) cells.push({ day, key: `d-${day}` });

  const selectedDateIso =
    selectedDay ? `${year}-${String(month + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}` : null;

  return (
    <section className="card">
      <div className="calHeader">
        <h2 className="cardTitle" style={{ margin: 0 }}>
          {t(lang, "calendarTitle")}
        </h2>

        <div className="calNav">
          <button className="tab" onClick={() => goMonth(-1)} type="button">
            ◀
          </button>

          <div className="calMonth">
            {currentDate.toLocaleDateString(lang, { month: "long", year: "numeric" })}
          </div>

          <button className="tab" onClick={() => goMonth(1)} type="button">
            ▶
          </button>
        </div>
      </div>

      {/* Wochentage */}
      <div className="calWeekdays">
        {(() => {
          // 2023-01-02 war ein Montag
          const base = new Date(2023, 0, 2);
          const days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(base);
            d.setDate(base.getDate() + i);
            return new Intl.DateTimeFormat(lang, { weekday: "short" }).format(d);
          });

          return days.map((d, i) => (
            <div key={i} className="calWeekday">
              {d}
            </div>
          ));
        })()}
      </div>

      {/* Monats-Grid */}
      <div className="calGrid">
        {cells.map((c) => {
          if (c.empty) return <div key={c.key} className="calCell calEmpty" />;

          const dayEvents = monthEventsByDay.get(c.day) || [];

          return (
            <button
              key={c.key}
              className={"calCell calBtn" + (selectedDay === c.day ? " calSelected" : "")}
              onClick={() => setSelectedDay(c.day)}
              type="button"
            >
              <div className="calDay">{c.day}</div>

              {dayEvents.slice(0, 2).map((ev) => {
                const tx = eventText(ev, lang);
                return (
                  <div
                    key={ev.date + tx.title + (ev.startTime || "")}
                    className={"calEvent" + (ev.articleId ? " calEventLink" : "")}
                    title={`${tx.title}${tx.location ? " – " + tx.location : ""}`}
                    onClick={(e) => {
                      if (!ev.articleId) return;
                      e.stopPropagation();            // verhindert day-select button click
                      onOpenArticle?.(ev.articleId);  // <-- neuer Hook nach App
                    }}
                  >
                    {tx.title}
                  </div>
                );
              })}

              {dayEvents.length > 2 && (
                <div className="calMore muted">
                  +{dayEvents.length - 2} {t(lang, "more")}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Tagesansicht */}
      <div style={{ marginTop: 16 }}>
        <h3 style={{ margin: 0, marginBottom: 8 }}>
          {selectedDay
            ? `${formatDateDE(selectedDateIso)}`
            : t(lang, "selectDay")}
        </h3>

        {selectedDay && selectedEvents.length === 0 ? (
          <p className="muted">{t(lang, "noEventsThatDay")}</p>
        ) : selectedDay ? (
          <div className="list">
            {selectedEvents
              .slice()
              .sort((a, b) => (a.startTime || "").localeCompare(b.startTime || ""))
              .map((e) => {
                const tx = eventText(e, lang);
                return (
                  <div key={e.date + tx.title + (e.startTime || "")} className="listItem" style={{ marginBottom: 8 }}>
                    <div className="listTop">
                      <span className="badge">
                        {e.startTime ? e.startTime : ""}
                        {e.endTime ? `–${e.endTime}` : ""}
                      </span>
                      <span className="itemTitle">{tx.title}</span>
                    </div>
                    <div className="muted">{tx.location}</div>
                  </div>
                );
              })}
          </div>
        ) : null}
      </div>

      {/* Nächste Termine: nur heute & morgen */}
      <div style={{ marginTop: 16 }}>
        <h3 style={{ marginBottom: 8 }}>{t(lang, "nextEvents")}</h3>

        {nextTwoDays.length === 0 ? (
          <p className="muted">{t(lang, "noResults")}</p>
        ) : (
          nextTwoDays.map((e) => {
            const tx = eventText(e, lang);
            return (
              <div key={e.date + tx.title + (e.startTime || "")} className="listItem" style={{ marginBottom: 8 }}>
                <div className="listTop">
                  <span className="badge">
                    {formatDateDE(e.date)}
                    {e.startTime ? ` · ${e.startTime}` : ""}
                    {e.endTime ? `–${e.endTime}` : ""}
                  </span>
                  <span className="itemTitle">{tx.title}</span>
                </div>
                <div className="muted">{tx.location}</div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
