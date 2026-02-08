/**
 * Bullying detection utility
 * Detects bullying-related content in conversations
 */

const BULLYING_KEYWORDS = [
  "pesten", "gepest", "pest", "pester", "pesters", "pestgedrag",
  "cyberpesten", "online pesten", "digitaal pesten",
  "uitlachen", "uitgelachen", "lachen om", "belachelijk maken",
  "negeren", "genegeerd", "doen alsof ik lucht ben",
  "buitensluiten", "buitengesloten", "niet meedoen", "niet uitgenodigd",
  "roddelen", "roddel", "achter mijn rug", "praatjes", "geruchten",
  "screenshots delen", "screenshot", "doorsturen", "foto's delen",
  "uit de groep", "groepschat",
  "gemeen", "gemene dingen", "gemeen doen", "rot doen",
  "plagen", "geplaagd", "sarren", "treiteren", "treiteraar",
  "schelden", "gescholden", "uitschelden", "scheldwoorden",
  "bedreigen", "bedreigd", "bang maken", "intimideren",
  "slaan", "schoppen", "duwen", "fysiek", "geweld",
  "spullen pakken", "afpakken", "verstopt", "kapot maken",
  "verraad", "geheim doorverteld",
  "niet durven", "bang op school", "niet naar school willen",
  "voor gek gezet", "vernederd", "beschaamd"
];

/**
 * Detect if bullying is mentioned in messages
 * Returns true if bullying keywords are found
 */
export function detectBullying(messages: Array<{ role: string; content: string }>): boolean {
  // Combine all user messages
  const userMessages = messages
    .filter((m) => m.role === "user")
    .map((m) => m.content.toLowerCase())
    .join(" ");

  if (!userMessages.trim()) {
    return false;
  }

  // Check for bullying keywords
  for (const keyword of BULLYING_KEYWORDS) {
    const regex = new RegExp(`\\b${keyword}\\w*\\b`, "gi");
    if (regex.test(userMessages)) {
      return true;
    }
  }

  return false;
}

/**
 * Get bullying severity level based on keywords
 * Returns "low", "medium", or "high"
 */
export function getBullyingSeverity(messages: Array<{ role: string; content: string }>): "low" | "medium" | "high" {
  const userMessages = messages
    .filter((m) => m.role === "user")
    .map((m) => m.content.toLowerCase())
    .join(" ");

  // High severity keywords
  const highSeverityKeywords = [
    "bedreigen", "bedreigd", "bang maken", "intimideren",
    "slaan", "schoppen", "duwen", "fysiek", "geweld",
    "niet naar school willen", "bang op school",
    "zelfmoord", "dood", "pijn doen"
  ];

  // Medium severity keywords
  const mediumSeverityKeywords = [
    "cyberpesten", "screenshots delen", "doorsturen",
    "uit de groep", "buitengesloten",
    "schelden", "gescholden", "uitschelden",
    "vernederd", "beschaamd", "voor gek gezet"
  ];

  // Check for high severity
  for (const keyword of highSeverityKeywords) {
    const regex = new RegExp(`\\b${keyword}\\w*\\b`, "gi");
    if (regex.test(userMessages)) {
      return "high";
    }
  }

  // Check for medium severity
  for (const keyword of mediumSeverityKeywords) {
    const regex = new RegExp(`\\b${keyword}\\w*\\b`, "gi");
    if (regex.test(userMessages)) {
      return "medium";
    }
  }

  return "low";
}
