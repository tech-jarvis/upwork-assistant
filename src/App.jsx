import { useState, useRef, useEffect } from "react";
import "./App.css";

const PORTFOLIO = `
NAME: Ashar Ali
ROLE: Senior Full-Stack Developer & Tech Lead
EXPERIENCE: 9+ years
LINKEDIN: https://www.linkedin.com/in/ash-ar/
GITHUB: https://github.com/tech-jarvis

PROJECTS (with live links):
1. Kallidus → https://www.kallidus.com
   Stack: Ruby on Rails, Angular, PostgreSQL, AWS, Jenkins
   Highlights: Led 15 devs + 5 QA. Boosted app performance 85%, reduced deployment time 40%, test coverage 96%. Full HCM SaaS platform.

2. HoneyBricks → https://www.honeybricks.com
   Stack: Solidity, Java, React, NestJS, Ethereum, Polygon, AWS, Kubernetes
   Highlights: Tokenized real estate platform — built entire smart contract pipeline, KYC/AML, fractional ownership for US real estate securities.

3. Dafi Protocol → https://dafi.io
   Stack: Go, Solidity, React, Ethereum, Polygon, GCP
   Highlights: DeFi Super Staking platform. Smart contracts for staking/rewards, gas fee optimization, multi-chain Ethereum + Polygon.

4. Zed / CarTaxi (Al Ghurair UAE) → iOS App (UAE ride-hailing)
   Stack: React Native, NestJS, Spring Boot, AWS, Google Maps API, Stripe, Firebase
   Highlights: Real-time ride tracking, secure payments, CI/CD pipelines, AWS infrastructure. Built for Al-Ghurair Investment.

5. Playwire → https://www.playwire.com
   Stack: React, Next.js, TypeScript, Node.js, PostgreSQL, MongoDB, AWS
   Highlights: Global ad revenue platform. Built custom design system, analytics views, ad behavior configuration engine.

6. Agzaga → https://agzaga.com
   Stack: React, Next.js, Ruby on Rails, AWS, Stripe, Firebase
   Highlights: Built full e-commerce platform from scratch. NetSuite ERP integration, Amazon/eBay/Target seller integrations, real-time analytics.

7. Advekit → https://www.advekit.com
   Stack: React, Next.js, Ruby on Rails, PostgreSQL, AWS
   Highlights: Patient-therapist matching platform. Security hardening, performance optimization, full feature buildout.

8. ToMarket → https://tomarket.com
   Stack: NestJS, PostgreSQL, GraphQL, AWS
   Highlights: Migrated REST to GraphQL — reduced response time 35%. 95% unit test coverage. Sprint spill reduced 3 days → 1 day.

9. Projectory (Aqua Properties UAE) → https://projectory.ae
   Stack: React, Next.js, Node.js, MongoDB, AWS, Google Maps, Mapbox
   Highlights: UAE off-plan real estate marketplace. Sub-second search, interactive map, SEO for Dubai keywords, dynamic payment plan calculator.

10. Trials.ai → https://trials.ai
    Stack: OpenAI, LlamaParser, OCR, AWS Textract, Kafka, Celery, Dgraph, S3
    Highlights: Clinical trials AI — 200+ page document parsing, RAG pipeline, 90%+ ontology mapping accuracy, GPT-4o fine-tuning.

11. Motorola Solutions → (Telecom AI, enterprise)
    Stack: Python, ML models, integrated APIs, automated billing
    Highlights: ML-powered query classifier, accelerated proposal response time 80%, automated billing sheet generation.

12. Integrity → (Document Processing AI)
    Stack: Flask, FastAPI, Redis, AWS Textract, HuggingFace Donut, DocVQA, PostgreSQL
    Highlights: Tax return (Form 1040) + insurance claims parsing. Custom Donut model fine-tuning. OCR on low-quality scanned docs.

13. Health Query Intelligence → (Healthcare NLP)
    Stack: Python, LangChain, RAG, OpenAI, Llama2, GCP BigQuery, Vertex AI
    Highlights: NL-to-SQL accuracy improved 73.4% → 87.3% using RAG + few-shot. Fine-tuned CodeLlama with LoRA/PEFT, cut costs 70%.

14. Exchange Hub → (Medicine Distribution)
    Stack: Kubernetes, Terraform, Helm, GCP GKE, Prometheus, Grafana
    Highlights: 40+ microservices. Full CI/CD GitHub Actions. Kubernetes clusters (Prod/DR/Dev). Prometheus + Grafana monitoring.

15. SwervePay → https://www.swervepay.io
    Stack: React, NestJS, Node.js, PostgreSQL, GraphQL, MongoDB, AWS
    Highlights: Global payments (500M+ bank accounts/wallets). Legacy migration, ML pipelines, real-time dashboards, 90%+ test coverage.

16. EverlyHealth → https://www.everlywell.com
    Stack: React, Next.js, NestJS, Node.js, PostgreSQL, GraphQL, MongoDB, AWS
    Highlights: Healthcare platform. REST APIs, code quality boost 60% via Code Climate.

17. HiClark → (EdTech tutoring platform)
    Stack: ElectronJS, GraphQL, Ruby on Rails
    Highlights: Introduced microservices — improved performance 35%.

SKILLS:
- Frontend: React, Next.js, Remix, Redux, React Native, Tailwind, TypeScript
- Backend: Node.js, NestJS, Spring Boot, Express, Django, Flask, FastAPI, Ruby on Rails
- Blockchain: Solidity, Smart Contracts, Ethereum, Polygon, NFT, DeFi, DAOs
- Databases: PostgreSQL, MongoDB, MySQL, Redis, Neo4J, Firebase, DynamoDB, Pinecone, FAISS
- DevOps/Cloud: AWS, GCP, Azure, Docker, Kubernetes, Terraform, CI/CD, Jenkins
- AI/ML: OpenAI, LangChain, RAG, LangGraph, HuggingFace, PyTorch, TensorFlow, NLP, MLflow
- Languages: JavaScript, TypeScript, Python, Java, Go, Rust, Solidity, Ruby

INDUSTRIES: Blockchain/DeFi, Real Estate, Ride-Hailing, Healthcare, Fintech, E-Commerce, Ad Tech, Clinical Trials AI, Telecom, DevOps, EdTech
LEADERSHIP: Managed 60+ engineers, sprint planning, backlog grooming, code reviews, release engineering
CERTIFICATIONS: Scrum, HIPAA
AVAILABILITY: Open to new projects, flexible timezone
RATES: $60-150/hr depending on complexity, fixed price available for well-scoped projects
`;

const PROPOSAL_SYSTEM = `You are writing Upwork proposals on behalf of Ashar Ali, a Senior Full-Stack Developer & Tech Lead with 9+ years of experience.

${PORTFOLIO}

When given a job posting, respond ONLY in valid JSON:
{
  "score": <1-10>,
  "verdict": "BID" or "SKIP",
  "matchedSkills": [<2-4 specific skills or project names matching this job>],
  "reasons": [<3-4 short bullet reasons for verdict>],
  "redFlags": [<red flags or empty array []>],
  "suggestedRate": "<specific rate + 1 sentence reasoning>",
  "proposal": "<full proposal per rules below>"
}

PROPOSAL RULES:
1. HOOK: First sentence references something SPECIFIC from the job.
2. PROJECTS: Include 2-3 relevant projects formatted as:
   "→ ProjectName (URL) — one sentence what it is + one concrete metric."
3. APPROACH: 2-3 sentences on how Ashar solves THEIR specific problem.
4. CTA: Short confident close — suggest a call or ask one specific project question.
5. TONE: Confident, direct, human. NEVER "Hi I am a developer" or "I have X years".
6. LENGTH: 200-280 words.

Respond ONLY with valid JSON. No markdown, no backticks.`;

const QA_SYSTEM = `You are Ashar Ali, a Senior Full-Stack Developer & Tech Lead with 9+ years of experience. A potential client is asking you questions directly. Respond AS Ashar — in first person, naturally, like a real professional having a conversation.

${PORTFOLIO}

RESPONSE RULES:
- Speak in first person as Ashar ("I built...", "In my experience...", "I've handled...")
- Be warm, confident, and specific — reference real projects and metrics when relevant
- Keep answers concise but substantive (2-5 sentences unless a detailed answer is genuinely needed)
- If asked about something outside your experience, be honest but pivot to what you CAN do
- Never sound like a bot or use bullet points unless the client asks for a list
- If asked about availability, rates, or timeline — answer directly and professionally
- Sound like a senior engineer who is confident in their work, not overselling`;

export default function App() {
  const [activeTab, setActiveTab] = useState("proposal");

  // Proposal state
  const [jobText, setJobText] = useState("");
  const [result, setResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [proposalError, setProposalError] = useState("");
  const [copied, setCopied] = useState(false);

  // Chat state
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm Ashar. Feel free to ask me anything about my experience, past projects, tech stack, availability, or how I'd approach your project. I'm happy to answer directly." }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const callAPI = async (system, messages, maxTokens = 1200) => {
    const res = await fetch("/api/anthropic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: maxTokens,
        system,
        messages,
      }),
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`API error: ${res.status} — ${errText}`);
    }
    return res.json();
  };

  const analyzeJob = async () => {
    if (!jobText.trim()) return;
    setAnalyzing(true);
    setProposalError("");
    setResult(null);
    setCopied(false);
    try {
      const data = await callAPI(
        PROPOSAL_SYSTEM,
        [{ role: "user", content: `Analyze this Upwork job posting:\n\n${jobText}` }],
        1200
      );
      const text = data.content?.map(i => i.text || "").join("") || "";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      setResult(parsed);
    } catch {
      setProposalError("Analysis failed. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = { role: "user", content: chatInput.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setChatInput("");
    setChatLoading(true);
    try {
      const apiMessages = updated
        .filter(m => m.role !== "assistant" || updated.indexOf(m) > 0)
        .map(m => ({ role: m.role, content: m.content }));

      const data = await callAPI(QA_SYSTEM, apiMessages, 1000);
      const reply = data.content?.map(i => i.text || "").join("") || "Sorry, I couldn't respond right now.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Something went wrong. Please try again." }]);
    } finally {
      setChatLoading(false);
    }
  };

  const copyProposal = () => {
    if (result?.proposal) {
      navigator.clipboard.writeText(result.proposal);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const scoreColor = s => s >= 8 ? "#22c55e" : s >= 5 ? "#f59e0b" : "#ef4444";
  const scoreBg = s => s >= 8 ? "#052e16" : s >= 5 ? "#1c1407" : "#1c0505";

  const renderWithLinks = (text) =>
    text.split("\n").map((line, i) => (
      <div key={i} style={{ marginBottom: line === "" ? 8 : 2 }}>
        {line.split(/(https?:\/\/[^\s)]+)/g).map((part, j) =>
          /^https?:\/\//.test(part)
            ? <a key={j} href={part} target="_blank" rel="noreferrer" style={{ color: "#818cf8", textDecoration: "underline" }}>{part}</a>
            : <span key={j}>{part}</span>
        )}
      </div>
    ));

  const tab = (id, label, icon) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`tab-btn ${activeTab === id ? "tab-active" : ""}`}
    >{icon} {label}</button>
  );

  return (
    <div className="app-root">

      {/* Header */}
      <div className="header">
        <div className="header-left">
          <div className="logo-icon">⚡</div>
          <div>
            <div className="logo-title">Upwork Sniper</div>
            <div className="logo-subtitle">Ashar Ali · Senior Full-Stack · 9+ Years</div>
          </div>
        </div>
        <div className="header-right">
          React · Node · Rails · Blockchain · AI/ML<br />AWS · GCP · Kubernetes · 17 Projects
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-bar">
        {tab("proposal", "Job Analyzer", "📋")}
        {tab("chat", "Ask Ashar", "💬")}
      </div>

      {/* ── PROPOSAL TAB ── */}
      {activeTab === "proposal" && (
        <div className="content-area">
          <div style={{ marginBottom: 14 }}>
            <div className="section-label">Paste Job Posting</div>
            <textarea
              value={jobText}
              onChange={e => setJobText(e.target.value)}
              placeholder="Copy the full Upwork job description and paste it here..."
              className="job-textarea"
            />
          </div>

          <button
            onClick={analyzeJob}
            disabled={analyzing || !jobText.trim()}
            className="analyze-btn"
          >
            {analyzing ? "⏳  Analyzing against your portfolio..." : "⚡  Analyze Job & Write Proposal"}
          </button>

          {proposalError && <div className="error-box">{proposalError}</div>}

          {result && (
            <div className="results-container">
              {/* Score / Verdict / Rate */}
              <div className="score-grid">
                <div className="score-card" style={{ background: scoreBg(result.score), borderColor: `${scoreColor(result.score)}33` }}>
                  <div className="section-label">Score</div>
                  <div className="score-value" style={{ color: scoreColor(result.score) }}>{result.score}<span className="score-max">/10</span></div>
                </div>
                <div className="score-card" style={{ background: result.verdict === "BID" ? "#052e16" : "#1c0505", borderColor: result.verdict === "BID" ? "#22c55e44" : "#ef444444" }}>
                  <div className="section-label">Verdict</div>
                  <div className="verdict-value" style={{ color: result.verdict === "BID" ? "#22c55e" : "#ef4444" }}>{result.verdict === "BID" ? "✅ BID" : "❌ SKIP"}</div>
                </div>
                <div className="score-card card-dark">
                  <div className="section-label">Your Rate</div>
                  <div className="rate-value">{result.suggestedRate?.split(" ").slice(0, 3).join(" ") || "—"}</div>
                </div>
              </div>

              {/* Matched Skills */}
              {result.matchedSkills?.length > 0 && (
                <div className="card-dark" style={{ padding: "14px 18px" }}>
                  <div className="section-label" style={{ marginBottom: 10 }}>Portfolio Match</div>
                  <div className="skills-list">
                    {result.matchedSkills.map((s, i) => <span key={i} className="skill-tag">{s}</span>)}
                  </div>
                </div>
              )}

              {/* Analysis + Red Flags */}
              <div className="analysis-grid" style={{ gridTemplateColumns: result.redFlags?.length ? "1fr 1fr" : "1fr" }}>
                <div className="card-dark" style={{ padding: "14px 18px" }}>
                  <div className="section-label" style={{ marginBottom: 10 }}>Analysis</div>
                  {result.reasons?.map((r, i) => (
                    <div key={i} className="reason-item">
                      <span className="reason-bullet">▸</span><span>{r}</span>
                    </div>
                  ))}
                </div>
                {result.redFlags?.length > 0 && (
                  <div className="redflag-card">
                    <div className="section-label redflag-label" style={{ marginBottom: 10 }}>⚠ Red Flags</div>
                    {result.redFlags.map((r, i) => (
                      <div key={i} className="redflag-item">
                        <span className="redflag-bullet">▸</span><span>{r}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Rate */}
              <div className="card-dark" style={{ padding: "13px 18px" }}>
                <div className="section-label" style={{ marginBottom: 7 }}>💰 Rate Reasoning</div>
                <div className="rate-reasoning">{result.suggestedRate}</div>
              </div>

              {/* Proposal */}
              <div className="card-dark" style={{ padding: 18 }}>
                <div className="proposal-header">
                  <div className="section-label">📝 Ready-to-Send Proposal</div>
                  <button onClick={copyProposal} className={`copy-btn ${copied ? "copied" : ""}`}>
                    {copied ? "✓ Copied!" : "Copy"}
                  </button>
                </div>
                <div className="proposal-text">
                  {renderWithLinks(result.proposal)}
                </div>
              </div>

              <button onClick={() => { setResult(null); setJobText(""); }} className="reset-btn">
                Analyze Another Job →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── CHAT TAB ── */}
      {activeTab === "chat" && (
        <div className="chat-container">

          {/* Chat header */}
          <div className="chat-header">
            <div className="chat-avatar">A</div>
            <div>
              <div className="chat-name">Ashar Ali</div>
              <div className="chat-status">● Online · Senior Full-Stack Developer</div>
            </div>
            <div className="chat-header-hint">
              Ask about experience, projects,<br />tech stack, timeline, rates…
            </div>
          </div>

          {/* Messages */}
          <div className="messages-area">
            {messages.map((msg, i) => (
              <div key={i} className={`message-row ${msg.role === "user" ? "message-user" : "message-assistant"}`}>
                {msg.role === "assistant" && (
                  <div className="msg-avatar assistant-avatar">A</div>
                )}
                <div className={`msg-bubble ${msg.role === "user" ? "bubble-user" : "bubble-assistant"}`}>
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="msg-avatar user-avatar">U</div>
                )}
              </div>
            ))}
            {chatLoading && (
              <div className="message-row message-assistant">
                <div className="msg-avatar assistant-avatar">A</div>
                <div className="bubble-assistant typing-indicator">
                  {[0, 1, 2].map(n => (
                    <div key={n} className="typing-dot" style={{ animationDelay: `${n * 0.2}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Questions */}
          <div className="quick-questions">
            {["What's your rate?", "Have you built DeFi apps?", "Can you lead a team?", "What's your availability?", "Tell me about your AI experience"].map((q, i) => (
              <button key={i} onClick={() => { setChatInput(q); }} className="quick-q-btn">
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="chat-input-bar">
            <input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendChat()}
              placeholder="Ask Ashar anything about his experience..."
              className="chat-input"
            />
            <button
              onClick={sendChat}
              disabled={chatLoading || !chatInput.trim()}
              className="send-btn"
            >➤</button>
          </div>
        </div>
      )}
    </div>
  );
}
