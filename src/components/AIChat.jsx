import { useEffect, useRef, useState } from "react";
import { sendMessage } from "../services/ai";

export const suggestedQuestions = [
  "What is Sandipan studying?", "Sandipan ko kya kya aata hai?", "What is he currently learning?", "Java mein kya kiya hai?",
];

const relatedSections = { education: { label: "Education", href: "#education" }, skills: { label: "Skills", href: "#skills" }, projects: { label: "Projects", href: "#projects" }, learning: { label: "Learning journey", href: "#journey" }, achievements: { label: "Achievements", href: "#achievements" }, profile: { label: "About", href: "#about" } };

function RelatedInformation({ sources }) {
  const related = [...new Set(sources)].map((source) => relatedSections[source]).filter(Boolean);
  if (!related.length) return null;
  return <div className="related-info"><span>Related information</span>{related.map((item) => <a href={item.href} key={item.href}>{item.label}</a>)}</div>;
}

export function AIChat({ showHeader = true }) {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const newestMessageRef = useRef(null);
  useEffect(() => { newestMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [messages, loading]);

  const submit = async (event, suggested) => {
    event?.preventDefault();
    const content = (suggested || draft).trim();
    if (!content || loading) return;
    const history = messages;
    setMessages((current) => [...current, { role: "user", content }]);
    setDraft(""); setError(""); setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 320));
      const reply = await sendMessage(content, history);
      setMessages((current) => [...current, { role: "assistant", content: reply.text, facts: reply.facts, sources: reply.sources, responseType: reply.responseType, language: reply.language }]);
    } catch (requestError) { setError(requestError.message || "The verified portfolio information could not be checked right now."); } finally { setLoading(false); }
  };

  const clear = () => { setMessages([]); setDraft(""); setError(""); inputRef.current?.focus(); };
  const onKeyDown = (event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); submit(); } };
  const hasConversation = messages.length > 0;
  return <section className={`ai-chat ${showHeader ? "with-header" : "in-sheet"}`} aria-labelledby={showHeader ? "chat-title" : undefined}>
    {showHeader && <header className="ai-chat-header"><div><p className="eyebrow">Portfolio assistant</p><h1 id="chat-title">Sandipan AI</h1><p>Answers are based on Sandipan’s verified portfolio information.</p></div>{hasConversation && <button className="clear-button" onClick={clear}>Clear conversation</button>}</header>}
    <div className={`chat-shell ${hasConversation ? "has-conversation" : ""}`}><div className="chat-surface" aria-live="polite">
      {!hasConversation ? <div className="chat-empty"><span className="ai-mark">S</span><h2>Hi, I’m Sandipan AI.</h2><p>I can help you explore Sandipan’s skills, projects, education and learning journey.</p><div className="suggestions">{suggestedQuestions.map((question) => <button key={question} onClick={(event) => submit(event, question)}>{question}<span>→</span></button>)}</div></div> : <div className="messages">{messages.map((message, index) => <article className={`message ${message.role} ${message.responseType || ""}`} key={`${message.role}-${index}`}><span className="message-label">{message.role === "user" ? "You" : "Sandipan AI"}</span>{message.content.split(/\n\n+/).map((paragraph, paragraphIndex) => (
  <p key={paragraphIndex}>
    {paragraph.split(/(\*\*[^*]+\*\*)/g).map((part, partIndex) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={partIndex}>{part.slice(2, -2)}</strong>
      ) : (
        part
      )
    )}
  </p>
))}{message.role === "assistant" && <RelatedInformation sources={message.sources || []} />}</article>)}{loading && <article className="message assistant loading"><span className="message-label">Sandipan AI</span><p><i /> <i /> <i /></p></article>}<div ref={newestMessageRef} /></div>}
      {error && <div className="chat-error" role="alert"><strong>Couldn’t send that question.</strong><span>{error}</span><button onClick={() => { setError(""); inputRef.current?.focus(); }}>Try again</button></div>}</div>
      {hasConversation && !loading && <div className="followups" aria-label="Suggested follow-up questions"><span>Continue exploring</span>{suggestedQuestions.slice(0, 3).map((question) => <button key={question} onClick={(event) => submit(event, question)}>{question}</button>)}<button className="clear-button" onClick={clear}>Clear conversation</button></div>}
      <form className="chat-composer" onSubmit={submit}><label className="sr-only" htmlFor="ai-question">Ask Sandipan AI a question</label><textarea id="ai-question" ref={inputRef} value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={onKeyDown} rows="1" placeholder="Ask Sandipan…" /><button className="button" type="submit" disabled={!draft.trim() || loading}>Send <span>↑</span></button></form></div>
    <p className="chat-disclaimer">Press Enter to send · Shift + Enter for a new line</p>
  </section>;
}
