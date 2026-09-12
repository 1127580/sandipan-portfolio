import { behaviorConfig } from "./instructions.js";

const hindiTerms = /[\u0900-\u097F]|\bhindi\b/i;
const hinglishTerms = /\b(hinglish|kya|kaisa|kaunsi|kaunsa|kis|kaha|padhta|aata|seekh|aur|iske|mein|hai)\b/i;
const careerTerms = /\b(suitable|ready|junior|internship|role|strength|improve|should.*learn|career|developer)\b|\b(ready|improve|strength)\b/i;
const personalityTerms = /\b(kaisa|personality|what kind of person|what is sandipan like|kind of developer)\b/i;
const portfolioTerms = /\b(sandipan|he|his|iske|isne|skills?|technology|university|college|semester|bca|learn|learning|project|portfolio|java|sql|mysql|dbms|html|css|javascript|git|github|career|internship|developer)\b|\b(kya|kaisa|kaha|padhta|aata|seekh)\b/i;

export function detectLanguage(message) {
  if (/\bhinglish\b/i.test(message) || hinglishTerms.test(message) && !hindiTerms.test(message)) return "hinglish";
  if (hindiTerms.test(message)) return "hindi";
  return "english";
}

const phrase = (language, english, hindi, hinglish) => ({ english, hindi, hinglish })[language];
const list = (items) => new Intl.ListFormat("en", { style: "long", type: "conjunction" }).format(items);

function formatSkills(matches, language) {
  const skills = matches.filter((item) => item.category === "skills");
  const working = skills.filter((item) => item.text.includes("Working Knowledge")).map((item) => item.title);
  const learning = skills.filter((item) => item.text.includes("Learning")).map((item) => item.title);
  if (!skills.length) return null;
  if (language === "hindi") return `दस्तावेज़ के अनुसार, Sandipan को ${list(working)} का working knowledge है। वह ${list(learning)} सीख रहे हैं।`;
  if (language === "hinglish") return `Documented portfolio ke mutabik, Sandipan ko ${list(working)} ka working knowledge hai. Woh ${list(learning)} seekh rahe hain.`;
  return `Sandipan currently lists working knowledge of ${list(working)}. He is learning ${list(learning)}.`;
}

function formatEducation(language) {
  return phrase(language,
    "Sandipan is pursuing a Bachelor of Computer Applications (BCA) at Adamas University and is currently in the 5th Semester.",
    "Sandipan Adamas University से Bachelor of Computer Applications (BCA) कर रहे हैं और वर्तमान में 5th Semester में हैं।",
    "Sandipan Adamas University se Bachelor of Computer Applications (BCA) kar rahe hain aur abhi 5th Semester mein hain.");
}

function formatLearning(matches, language) {
  const details = matches.filter((item) => item.category === "learning").map((item) => item.text);
  if (!details.length) return null;
  const summary = details.join(" ");
  if (language === "hindi") return `उनकी documented learning journey में BCA studies, Java, DBMS/SQL, web development और इस portfolio को बनाना शामिल है। ${summary}`;
  if (language === "hinglish") return `Unki documented learning journey mein BCA studies, Java, DBMS/SQL, web development aur yeh portfolio banana shamil hai. ${summary}`;
  return `Sandipan's documented learning journey includes BCA studies, Java, DBMS/SQL, web development, and building this portfolio. ${summary}`;
}

function formatProjects(matches, language) {
  const active = matches.find((item) => item.category === "projects" && item.text.includes("In progress"));
  if (!active) return null;
  return phrase(language,
    "Sandipan's current documented project is this personal portfolio knowledge base. It is in progress and is designed around structured information, local search, and a future AI-ready interface.",
    "Sandipan का वर्तमान documented project यह personal portfolio knowledge base है। यह in progress है और structured information, local search और future AI-ready interface के लिए बनाया जा रहा है।",
    "Sandipan ka current documented project yeh personal portfolio knowledge base hai. Yeh in progress hai aur structured information, local search aur future AI-ready interface ke around ban raha hai.");
}

export function buildFactualResponse(message, matches, language) {
  const lower = message.toLowerCase();
  if (/\b(java)\b/i.test(message) && !/\b(project|portfolio)\b/i.test(message)) {
    return phrase(language,
      "Java is documented as one of Sandipan's areas of working knowledge. The portfolio does not currently document a separate Java project.",
      "Java, Sandipan के working knowledge के रूप में documented है। Portfolio में अभी कोई अलग Java project documented नहीं है।",
      "Java Sandipan ke working knowledge ke roop mein documented hai. Portfolio mein abhi koi separate Java project documented nahi hai.");
  }
  if (matches.some((item) => item.category === "skills")) return formatSkills(matches, language);
  if (matches.some((item) => item.category === "education") || /semester|university|college|study|padh/i.test(lower)) return formatEducation(language);
  if (matches.some((item) => item.category === "learning")) return formatLearning(matches, language);
  if (matches.some((item) => item.category === "projects")) return formatProjects(matches, language);
  return null;
}

export function buildAssessmentResponse(message, language) {
  const lower = message.toLowerCase();
  if (!careerTerms.test(lower) && !personalityTerms.test(lower)) return null;
  const webRole = /web|frontend|front-end/i.test(lower);
  const improve = /improve|should.*learn/i.test(lower);
  const personality = personalityTerms.test(lower);
  const fact = webRole
    ? "Sandipan has documented working knowledge of HTML and CSS, is learning JavaScript, and is currently building this portfolio."
    : "Sandipan's portfolio documents BCA studies, Java and web-development learning, database learning, and an active portfolio project.";
  let assessment;
  if (improve) assessment = "A reasonable next step would be to deepen the current foundations through more documented projects and practice. The portfolio does not currently document professional experience, so it cannot support a stronger claim than that.";
  else if (personality) assessment = "From the portfolio, Sandipan appears focused on continuous learning and practical development. This is an observation about documented portfolio activity, not a complete judgment about his personality.";
  else assessment = "Based on this documented foundation, he appears relevant to an entry-level learning opportunity in this area. The portfolio does not provide enough evidence to guarantee readiness, selection, or job performance.";
  if (language === "hindi") return `तथ्य: ${fact}\n\nआकलन: ${assessment}`;
  if (language === "hinglish") return `Fact: ${fact}\n\nAssessment: ${assessment}`;
  return `Documented facts: ${fact}\n\n${behaviorConfig.assessmentPrefix} ${assessment}`;
}

export function isPortfolioQuestion(message) { return portfolioTerms.test(message); }

export function unavailableResponse(language) {
  return phrase(language, behaviorConfig.unavailable, "मेरे पास यह जानकारी अभी Sandipan के portfolio में documented नहीं है।", "Mere paas yeh information abhi Sandipan ke portfolio mein documented nahi hai.");
}

export function offTopicResponse(language) {
  return phrase(language, behaviorConfig.offTopic, "मैं मुख्य रूप से Sandipan, उनके work, skills और learning journey के बारे में मदद करने के लिए बना हूँ। कृपया उनसे या उनके portfolio से जुड़ा सवाल पूछें।", "Main primarily Sandipan, unke work, skills aur learning journey ko explore karne mein help karta hoon. Unke ya unke portfolio ke baare mein poochhiye.");
}
