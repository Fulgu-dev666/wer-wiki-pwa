import rawEvents from "./data/events.json";
import articles from "./data/articles.json";
import { buildEvents } from "./services/eventsService";

export const EVENTS = buildEvents(rawEvents);
export const ARTICLES = articles;
