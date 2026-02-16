export const LANGS = [
  { code: "de", label: "Deutsch" },
  { code: "en", label: "English" },
  { code: "ru", label: "Русский" },
];

export const T = {
  de: {
    appTitle: "WeR",
    appSubtitle: "Kalender & Wissen",
    tabCalendar: "Kalender",
    tabKnowledge: "Wissen",
    searchEvents: "Suche Termine…",
    searchArticles: "Suche Artikel…",
    calendarTitle: "Kalender",
    nextEvents: "Nächste Termine",
    knowledgeTitle: "Wissensdatenbank",
    noResults: "Keine Treffer.",
    language: "Sprache",
    more: "mehr",
    selectDay: "Tag auswählen",
    noEventsThatDay: "Keine Termine an diesem Tag."
  },
  en: {
    appTitle: "WeR",
    appSubtitle: "Calendar & Knowledge",
    tabCalendar: "Calendar",
    tabKnowledge: "Knowledge",
    searchEvents: "Search events…",
    searchArticles: "Search articles…",
    calendarTitle: "Calendar",
    nextEvents: "Next events",
    knowledgeTitle: "Knowledge base",
    noResults: "No results.",
    language: "Language",
    more: "more",
    selectDay: "Select a day",
    noEventsThatDay: "No events on this day."
  },
  ru: {
    appTitle: "WeR",
    appSubtitle: "Календарь и база знаний",
    tabCalendar: "Календарь",
    tabKnowledge: "База знаний",
    searchEvents: "Поиск событий…",
    searchArticles: "Поиск статей…",
    calendarTitle: "Календарь",
    nextEvents: "Ближайшие события",
    knowledgeTitle: "База знаний",
    noResults: "Ничего не найдено.",
    language: "Язык",
    more: "ещё",
    selectDay: "Выберите день",
    noEventsThatDay: "На этот день нет событий."
},
};

export function getLang() {
  const saved = localStorage.getItem("lang");
  if (saved && T[saved]) return saved;

  const nav = (navigator.language || "de").slice(0, 2).toLowerCase();
  if (T[nav]) return nav;

  return "de";
}

export function setLang(code) {
  localStorage.setItem("lang", code);
}

export function t(lang, key) {
  return (T[lang] && T[lang][key]) || T.de[key] || key;
}
