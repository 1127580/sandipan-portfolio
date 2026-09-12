import { searchKnowledge } from "../knowledge/index.js";

const API_URL = "http://localhost:3001/api/chat";

function buildKnowledgeContext(matches) {
  return matches
    .map(
      ({ title, text, category }) =>
        `[${category || "portfolio"}] ${title}\n${text}`
    )
    .join("\n\n");
}

function detectRelatedSections(message, evidence) {
  const text = `${message} ${evidence
    .map((item) => `${item.title} ${item.text} ${item.category || ""}`)
    .join(" ")}`
    .toLowerCase();

  const sections = [];

  const add = (section) => {
    if (!sections.includes(section)) {
      sections.push(section);
    }
  };

  // Education-focused questions
  if (
    text.includes("semester") ||
    text.includes("university") ||
    text.includes("bca") ||
    text.includes("education") ||
    text.includes("study") ||
    text.includes("padh")
  ) {
    add("education");
  }

  // Skills-focused questions
  if (
    text.includes("skill") ||
    text.includes("java") ||
    text.includes("javascript") ||
    text.includes("html") ||
    text.includes("css") ||
    text.includes("sql") ||
    text.includes("mysql") ||
    text.includes("dbms") ||
    text.includes("git") ||
    text.includes("github")
  ) {
    add("skills");
  }

  // Projects-focused questions
  if (
    text.includes("project") ||
    text.includes("built") ||
    text.includes("build")
  ) {
    add("projects");
  }

  // Learning-focused questions
  if (
    text.includes("learn") ||
    text.includes("learning") ||
    text.includes("currently learning") ||
    text.includes("seekh") ||
    text.includes("journey")
  ) {
    add("learning");
  }

  // Achievement-focused questions
  if (
    text.includes("achievement") ||
    text.includes("certificate") ||
    text.includes("award")
  ) {
    add("achievements");
  }

  // Only show About for clearly profile-oriented questions.
  if (
    text.includes("who is sandipan") ||
    text.includes("who is sayan") ||
    text.includes("about sandipan") ||
    text.includes("about sayan") ||
    text.includes("profile")
  ) {
    add("profile");
  }

  // Keep the UI clean: maximum 3 related sections.
  return sections.slice(0, 3);
}
export async function sendMessage(message, conversationHistory = []) {
  const normalizedMessage = message.trim();

  if (!normalizedMessage) {
    throw new Error("Please enter a question about Sandipan's portfolio.");
  }

  // Retrieve only verified portfolio information.
  const matches = searchKnowledge(normalizedMessage, conversationHistory);

  // For assessment-style questions, provide broader verified evidence.
  const lowerMessage = normalizedMessage.toLowerCase();

  const isAssessmentQuestion =
    lowerMessage.includes("suitable") ||
    lowerMessage.includes("ready") ||
    lowerMessage.includes("good developer") ||
    lowerMessage.includes("developer ban") ||
    lowerMessage.includes("kesa developer") ||
    lowerMessage.includes("kaisa developer") ||
    lowerMessage.includes("job") ||
    lowerMessage.includes("career") ||
    lowerMessage.includes("junior");

  const evidence = isAssessmentQuestion
    ? searchKnowledge("skills education projects learning", conversationHistory)
    : matches;

  const knowledge = buildKnowledgeContext(evidence);

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: normalizedMessage,
      history: conversationHistory,
      knowledge,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Sandipan AI could not process the request right now."
    );
  }

  return {
    text: data.text,
    facts: evidence.map(({ title, text }) => ({ title, text })),
    sources: detectRelatedSections(normalizedMessage, evidence),
    responseType: isAssessmentQuestion ? "assessment" : "fact",
  };
}