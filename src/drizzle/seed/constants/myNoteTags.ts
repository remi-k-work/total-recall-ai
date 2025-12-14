// All available note tags for the demo user
export const MY_NOTE_TAGS_MAP = {
  "⭐Important": crypto.randomUUID(),
  "🔥Quick Thoughts": crypto.randomUUID(),
  "🧠Ideas": crypto.randomUUID(),
  "❓Questions": crypto.randomUUID(),
  "📌To Remember": crypto.randomUUID(),
  "📅Plans": crypto.randomUUID(),
  "📚Learning": crypto.randomUUID(),
  "✍️Writing": crypto.randomUUID(),
  "💼Work Stuff": crypto.randomUUID(),
  "🏠Personal": crypto.randomUUID(),
  "🛒Lists": crypto.randomUUID(),
  "✨Inspiration": crypto.randomUUID(),
} as const;

export const MY_NOTE_TAGS = [
  { id: MY_NOTE_TAGS_MAP["⭐Important"], name: "⭐Important" },
  { id: MY_NOTE_TAGS_MAP["🔥Quick Thoughts"], name: "🔥Quick Thoughts" },
  { id: MY_NOTE_TAGS_MAP["🧠Ideas"], name: "🧠Ideas" },
  { id: MY_NOTE_TAGS_MAP["❓Questions"], name: "❓Questions" },
  { id: MY_NOTE_TAGS_MAP["📌To Remember"], name: "📌To Remember" },
  { id: MY_NOTE_TAGS_MAP["📅Plans"], name: "📅Plans" },
  { id: MY_NOTE_TAGS_MAP["📚Learning"], name: "📚Learning" },
  { id: MY_NOTE_TAGS_MAP["✍️Writing"], name: "✍️Writing" },
  { id: MY_NOTE_TAGS_MAP["💼Work Stuff"], name: "💼Work Stuff" },
  { id: MY_NOTE_TAGS_MAP["🏠Personal"], name: "🏠Personal" },
  { id: MY_NOTE_TAGS_MAP["🛒Lists"], name: "🛒Lists" },
  { id: MY_NOTE_TAGS_MAP["✨Inspiration"], name: "✨Inspiration" },
] as const;
