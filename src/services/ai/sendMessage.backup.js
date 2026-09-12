import { searchKnowledge } from "../knowledge/index.js";
import { buildAssessmentResponse, buildFactualResponse, detectLanguage, isPortfolioQuestion, offTopicResponse, unavailableResponse } from "./responsePolicy.js";

// Provider seam: a future backend will receive this message, conversationHistory,
// retrieved context, and sandipanAIInstructions. No provider or API key lives here.
export async function sendMessage(message, conversationHistory) {
  const normalizedMessage = message.trim();
  if (!normalizedMessage) throw new Error("Please enter a question about Sandipan's portfolio.");

  const language = detectLanguage(normalizedMessage);
  const assessment = buildAssessmentResponse(normalizedMessage, language);
  if (assessment) {
    const evidence = searchKnowledge("skills education projects learning", conversationHistory);
    return { text: assessment, facts: evidence.map(({ title, text }) => ({ title, text })), sources: [...new Set(evidence.map((item) => item.category))], responseType: "assessment", language };
  }

  const matches = searchKnowledge(normalizedMessage, conversationHistory);
  if (!matches.length) {
    const text = isPortfolioQuestion(normalizedMessage) ? unavailableResponse(language) : offTopicResponse(language);
    return { text, facts: [], sources: [], responseType: "unavailable", language };
  }

  const text = buildFactualResponse(normalizedMessage, matches, language) || unavailableResponse(language);
  return { text, facts: matches.map(({ title, text: factText }) => ({ title, text: factText })), sources: [...new Set(matches.map((match) => match.category))], responseType: "fact", language };
}
