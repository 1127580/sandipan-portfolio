import { knowledgeBase } from "../../data/knowledge/index.js";

const intentTerms = {
  skills: ["skill", "skills", "technology", "technologies", "know", "aata", "aati", "kya kya", "jaanta", "janta", "seekh"],
  education: ["university", "college", "study", "studying", "padh", "bca", "semester", "course", "program", "programme"],
  projects: ["project", "projects", "portfolio", "working", "work", "bana", "ban raha"],
  learning: ["learning", "learn", "currently", "focus", "journey", "seekh", "padh"],
  achievements: ["achievement", "achievements", "certificate", "certificates", "certification", "award"],
};

const stopWords = new Set(["a", "an", "and", "about", "are", "does", "he", "his", "in", "is", "me", "of", "sandipan", "tell", "the", "to", "what", "where", "who"]);
const tokenize = (value) => value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((token) => token && !stopWords.has(token));

/** Local keyword/intent retrieval, replaceable with semantic search later. */
export function searchKnowledge(query, conversationHistory = []) {
  const tokens = tokenize(query);
  const fullQuery = query.toLowerCase();
  const inferredCategories = Object.entries(intentTerms)
    .filter(([, terms]) => terms.some((term) => fullQuery.includes(term)))
    .map(([category]) => category);
  const activeCategories = inferredCategories.length ? inferredCategories : Object.keys(knowledgeBase);
  const candidates = activeCategories.flatMap((category) => (knowledgeBase[category] || []).map((item) => ({ ...item, category })));

  const scored = candidates.map((item) => {
    const searchable = `${item.title} ${item.text} ${item.keywords.join(" ")}`.toLowerCase();
    const tokenScore = tokens.reduce((score, token) => score + (searchable.includes(token) ? 1 : 0), 0);
    const categoryScore = inferredCategories.includes(item.category) ? 2 : 0;
    return { ...item, score: tokenScore + categoryScore };
  }).filter((item) => item.score > 0).sort((a, b) => b.score - a.score);

  // Conversation history is accepted now so a future semantic layer can resolve
  // pronouns and follow-ups with richer context without changing its API.
  void conversationHistory;
  return scored.slice(0, 8);
}
