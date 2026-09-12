# Sandipan Paul Portfolio

A light-first, data-driven personal portfolio and searchable knowledge base for **Sandipan Paul**, with **Sayan** as a secondary nickname/brand reference. It is intentionally an extendable foundation: details that have not been verified are clearly marked as placeholders.

## Run locally

Requires a current Node.js installation and npm.

```bash
npm install
npm run dev
```

Use `npm run build` to create a production build.

## Structure

```text
src/
  components/       Reusable interface pieces
  data/             Structured portfolio knowledge
  App.jsx           Page composition
  styles.css        Responsive visual system
```

## Updating portfolio information

Add verified information only in `src/data/`:

- `profile.js` — identity, bio, links, contact
- `skills.js` — skills grouped by category
- `projects.js` — project summaries, stack, and links
- `education.js`, `achievements.js`, `learning.js` — respective records

`src/data/index.js` creates `searchableContent`, a normalized local index used by the global search. This keeps the interface separate from the information and provides the basis for future AI grounding.

## Sandipan AI Architecture

Sandipan AI opens as an in-context bottom sheet over the portfolio. It currently uses local verified-data retrieval and is not connected to an LLM or external provider.

- **Knowledge base:** `src/data/knowledge/` adapts the existing `src/data/` records into categorized AI-ready knowledge. It imports the original portfolio data rather than copying it, so the portfolio data remains the source of truth.
- **Retrieval layer:** `src/services/knowledge/searchKnowledge.js` performs local keyword and lightweight intent matching, including common English, Hindi, and Hinglish terms for skills, education, learning, projects, and achievements.
- **Conversation state:** `src/components/AIChat.jsx` maintains the current browser-session message history and passes it to the service abstraction with each request.
- **AI service abstraction:** `src/services/ai/sendMessage.js` is the only module the interface calls. Today it returns explicitly marked local verified-data lookups; a future backend provider can replace its implementation without rewriting the chat UI.
- **Strict data boundary:** the service can answer only from the knowledge base. When no verified information is found, it says so rather than inferring personal details.

For a real integration, add a server-side endpoint that retrieves approved context, sends it to an LLM with the same strict boundary, and returns a response. Never expose provider API keys in frontend code: anything bundled in the browser can be read by visitors.
