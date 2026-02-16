function isoDate(dt) {
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const d = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseISO(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

// weekday in data: 1=Mo ... 7=So
function toJsWeekday(weekday) {
  // JS: 0=So ... 6=Sa
  return weekday % 7;
}

export function buildEvents(raw) {
  const oneOff = raw?.oneOff || [];
  const recurring = raw?.recurring || [];

  const out = [...oneOff];

  for (const r of recurring) {
    const start = parseISO(r.from);
    const end = r.to ? parseISO(r.to) : parseISO("2099-12-31");
    const targetJs = toJsWeekday(r.weekday);
    const step = Number(r.intervalDays);
    if (!Number.isFinite(step) || step <= 0) {
      throw new Error(
        `events.json recurring: intervalDays fehlt/ungültig (weekday=${r.weekday}, from=${r.from}, to=${r.to})`
      );
    }

    const cur = new Date(start);
    while (cur.getDay() !== targetJs) cur.setDate(cur.getDate() + 1);

    const { weekday, from, to, intervalDays, ...rest } = r;

    while (cur <= end) {
      out.push({
        ...rest,             // behält articleId + i18n
        date: isoDate(cur),
        i18n: rest.i18n || {}
      });
      cur.setDate(cur.getDate() + step);
    }
  }

  return out;
}
