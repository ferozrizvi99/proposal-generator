import { useState, useEffect, useRef } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const STEPS = [
  { id: "client",   label: "Client",    icon: "01" },
  { id: "project",  label: "Project",   icon: "02" },
  { id: "details",  label: "Details",   icon: "03" },
  { id: "business", label: "Business",  icon: "04" },
];

const TONES = [
  { value: "professional", label: "Professional", desc: "Formal and polished" },
  { value: "friendly",     label: "Friendly",     desc: "Warm and approachable" },
  { value: "bold",         label: "Bold",         desc: "Confident and direct" },
  { value: "consultative", label: "Consultative", desc: "Expert and advisory" },
];

const PROJECT_TYPES = [
  "Web Design & Development",
  "Brand Identity & Logo",
  "Marketing & Content Strategy",
  "Photography / Videography",
  "Consulting & Strategy",
  "Landscaping & Property",
  "Interior Design",
  "IT & Tech Services",
  "Accounting & Finance",
  "Other",
];

const INITIAL_FORM = {
  clientName: "",
  clientCompany: "",
  projectType: "",
  scopeDescription: "",
  timeline: "",
  budgetRange: "",
  keyDeliverables: "",
  tone: "professional",
  businessName: "",
  contactInfo: "",
};

// ─── STYLES ───────────────────────────────────────────────────────────────────

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,300;1,9..144,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cream:   #F7F4EF;
    --parchment: #EDE9E1;
    --ink:     #1A1714;
    --ink-60:  #6B6560;
    --ink-30:  #C5BFB8;
    --copper:  #B5622A;
    --copper-light: #F2E8DF;
    --copper-mid: #D4845A;
    --sage:    #3D5A4A;
    --white:   #FFFFFF;
    --shadow-sm: 0 1px 3px rgba(26,23,20,0.08);
    --shadow-md: 0 4px 16px rgba(26,23,20,0.10);
    --shadow-lg: 0 12px 40px rgba(26,23,20,0.14);
    --radius:  10px;
    --radius-sm: 6px;
  }

  body {
    background: var(--cream);
    font-family: 'DM Sans', sans-serif;
    color: var(--ink);
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }

  /* ── LAYOUT ── */
  .app-shell {
    display: grid;
    grid-template-columns: 340px 1fr;
    min-height: 100vh;
  }

  /* ── SIDEBAR ── */
  .sidebar {
    background: var(--ink);
    color: var(--cream);
    padding: 40px 32px;
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow: hidden;
  }

  .sidebar-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 48px;
  }

  .logo-mark {
    width: 32px;
    height: 32px;
    background: var(--copper);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Fraunces', serif;
    font-size: 18px;
    font-weight: 600;
    color: white;
    flex-shrink: 0;
  }

  .logo-text {
    font-family: 'Fraunces', serif;
    font-size: 15px;
    font-weight: 500;
    letter-spacing: -0.02em;
    line-height: 1.2;
    color: var(--cream);
  }

  .logo-sub {
    font-size: 10px;
    font-weight: 400;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink-30);
    margin-top: 1px;
  }

  .sidebar-steps {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .step-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 12px 14px;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: background 0.15s ease;
    position: relative;
  }

  .step-item:hover { background: rgba(247,244,239,0.06); }
  .step-item.active { background: rgba(181,98,42,0.18); }
  .step-item.completed .step-num { background: var(--sage); color: white; }

  .step-num {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(247,244,239,0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: var(--ink-30);
    flex-shrink: 0;
    transition: all 0.2s ease;
    font-family: 'DM Sans', sans-serif;
  }

  .step-item.active .step-num {
    background: var(--copper);
    color: white;
  }

  .step-label {
    font-size: 13px;
    font-weight: 500;
    color: var(--ink-30);
    transition: color 0.15s ease;
  }
  .step-item.active .step-label { color: var(--cream); }
  .step-item.completed .step-label { color: rgba(247,244,239,0.6); }

  .step-connector {
    width: 1px;
    height: 20px;
    background: rgba(247,244,239,0.1);
    margin-left: 27px;
  }

  .sidebar-footer {
    border-top: 1px solid rgba(247,244,239,0.1);
    padding-top: 24px;
    margin-top: 24px;
  }

  .sidebar-hint {
    font-size: 12px;
    color: var(--ink-30);
    line-height: 1.6;
  }

  /* ── MAIN ── */
  .main {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .main-header {
    padding: 32px 48px 0;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }

  .step-title {
    font-family: 'Fraunces', serif;
    font-size: 32px;
    font-weight: 400;
    letter-spacing: -0.03em;
    color: var(--ink);
    line-height: 1.1;
  }

  .step-title em {
    font-style: italic;
    color: var(--copper);
  }

  .step-subtitle {
    font-size: 13px;
    color: var(--ink-60);
    margin-top: 6px;
    font-weight: 400;
  }

  .progress-pill {
    background: var(--copper-light);
    color: var(--copper);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 6px 14px;
    border-radius: 99px;
    white-space: nowrap;
    margin-top: 6px;
  }

  /* ── FORM AREA ── */
  .form-area {
    flex: 1;
    padding: 32px 48px 48px;
    max-width: 720px;
  }

  .field-group {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .field-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .field-label {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--ink-60);
  }

  .field-required {
    color: var(--copper);
    margin-left: 2px;
  }

  .field input,
  .field textarea,
  .field select {
    background: var(--white);
    border: 1.5px solid var(--parchment);
    border-radius: var(--radius-sm);
    padding: 12px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: var(--ink);
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
    outline: none;
    width: 100%;
  }

  .field input:focus,
  .field textarea:focus,
  .field select:focus {
    border-color: var(--copper-mid);
    box-shadow: 0 0 0 3px rgba(181,98,42,0.1);
  }

  .field input::placeholder,
  .field textarea::placeholder { color: var(--ink-30); }

  .field textarea { resize: vertical; min-height: 100px; line-height: 1.6; }

  .field select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%236B6560' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 36px; cursor: pointer; }

  /* ── TONE PICKER ── */
  .tone-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
  }

  .tone-card {
    padding: 14px 12px;
    border: 1.5px solid var(--parchment);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all 0.15s ease;
    background: var(--white);
    text-align: left;
  }

  .tone-card:hover { border-color: var(--copper-mid); }

  .tone-card.selected {
    border-color: var(--copper);
    background: var(--copper-light);
  }

  .tone-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--ink);
    margin-bottom: 3px;
  }

  .tone-desc {
    font-size: 11px;
    color: var(--ink-60);
    line-height: 1.4;
  }

  .tone-card.selected .tone-name { color: var(--copper); }

  /* ── NAV BUTTONS ── */
  .nav-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 40px;
    padding-top: 24px;
    border-top: 1px solid var(--parchment);
  }

  .btn {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    padding: 11px 24px;
    border-radius: var(--radius-sm);
    cursor: pointer;
    border: none;
    transition: all 0.15s ease;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    letter-spacing: 0.01em;
  }

  .btn-ghost {
    background: transparent;
    color: var(--ink-60);
    border: 1.5px solid var(--parchment);
  }

  .btn-ghost:hover { border-color: var(--ink-30); color: var(--ink); }

  .btn-primary {
    background: var(--copper);
    color: white;
  }

  .btn-primary:hover { background: #A3561E; transform: translateY(-1px); box-shadow: var(--shadow-md); }
  .btn-primary:active { transform: translateY(0); }

  .btn-primary:disabled {
    background: var(--parchment);
    color: var(--ink-30);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  /* ── GENERATE VIEW ── */
  .generate-view {
    padding: 48px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .generate-header {
    margin-bottom: 32px;
  }

  .summary-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 32px;
  }

  .summary-card {
    background: var(--white);
    border: 1px solid var(--parchment);
    border-radius: var(--radius);
    padding: 16px 20px;
  }

  .summary-card-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink-30);
    margin-bottom: 4px;
  }

  .summary-card-value {
    font-size: 14px;
    font-weight: 500;
    color: var(--ink);
  }

  .generate-btn-wrap {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 36px;
  }

  .btn-generate {
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    padding: 14px 32px;
    border-radius: var(--radius-sm);
    cursor: pointer;
    border: none;
    background: var(--copper);
    color: white;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    letter-spacing: 0.01em;
    transition: all 0.15s ease;
    position: relative;
    overflow: hidden;
  }

  .btn-generate:hover:not(:disabled) { background: #A3561E; transform: translateY(-1px); box-shadow: var(--shadow-lg); }
  .btn-generate:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

  .generate-hint {
    font-size: 12px;
    color: var(--ink-60);
  }

  /* ── PROPOSAL PREVIEW ── */
  .proposal-wrap {
    background: var(--white);
    border: 1px solid var(--parchment);
    border-radius: var(--radius);
    box-shadow: var(--shadow-md);
    overflow: hidden;
    flex: 1;
  }

  .proposal-toolbar {
    background: var(--parchment);
    padding: 10px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--ink-30);
  }

  .toolbar-dots {
    display: flex;
    gap: 6px;
  }

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }

  .dot-red { background: #FF5F57; }
  .dot-yellow { background: #FFBD2E; }
  .dot-green { background: #28CA42; }

  .toolbar-label {
    font-size: 11px;
    font-weight: 500;
    color: var(--ink-60);
    letter-spacing: 0.03em;
  }

  .proposal-copy-btn {
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 600;
    padding: 5px 12px;
    border-radius: 4px;
    background: var(--white);
    border: 1px solid var(--ink-30);
    color: var(--ink-60);
    cursor: pointer;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .proposal-copy-btn:hover { background: var(--ink); color: white; border-color: var(--ink); }

  .proposal-content {
    padding: 40px 48px;
    font-size: 14px;
    line-height: 1.8;
    color: var(--ink);
    font-family: 'DM Sans', sans-serif;
    max-height: 560px;
    overflow-y: auto;
  }

  .proposal-content::-webkit-scrollbar { width: 4px; }
  .proposal-content::-webkit-scrollbar-track { background: transparent; }
  .proposal-content::-webkit-scrollbar-thumb { background: var(--ink-30); border-radius: 2px; }

  .proposal-placeholder {
    padding: 80px 48px;
    text-align: center;
    color: var(--ink-30);
  }

  .placeholder-icon {
    font-size: 40px;
    margin-bottom: 16px;
    opacity: 0.3;
  }

  .placeholder-text {
    font-family: 'Fraunces', serif;
    font-size: 18px;
    font-style: italic;
    font-weight: 300;
    color: var(--ink-30);
  }

  /* ── PROPOSAL MARKDOWN ── */
  .p-doc h1 {
    font-family: 'Fraunces', serif;
    font-size: 26px;
    font-weight: 500;
    letter-spacing: -0.03em;
    color: var(--ink);
    margin-bottom: 6px;
    line-height: 1.2;
  }

  .p-doc .p-meta {
    font-size: 12px;
    color: var(--ink-60);
    margin-bottom: 28px;
    padding-bottom: 20px;
    border-bottom: 1.5px solid var(--parchment);
  }

  .p-doc h2 {
    font-family: 'Fraunces', serif;
    font-size: 15px;
    font-weight: 500;
    color: var(--copper);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin: 24px 0 10px;
  }

  .p-doc p {
    color: var(--ink);
    margin-bottom: 12px;
    font-size: 13.5px;
    line-height: 1.75;
  }

  .p-doc ul {
    padding-left: 20px;
    margin-bottom: 12px;
  }

  .p-doc ul li {
    font-size: 13.5px;
    line-height: 1.75;
    color: var(--ink);
    margin-bottom: 4px;
  }

  .p-doc .divider {
    border: none;
    border-top: 1px solid var(--parchment);
    margin: 20px 0;
  }

  .p-doc .p-cta {
    background: var(--copper-light);
    border-left: 3px solid var(--copper);
    padding: 14px 18px;
    border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
    font-size: 13.5px;
    color: var(--ink);
    line-height: 1.65;
    margin-top: 8px;
  }

  /* ── LOADING ── */
  .loading-wrap {
    padding: 80px 48px;
    text-align: center;
  }

  .loader-ring {
    width: 40px;
    height: 40px;
    border: 3px solid var(--parchment);
    border-top-color: var(--copper);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 20px;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .loader-text {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-size: 16px;
    color: var(--ink-60);
  }

  .loader-sub {
    font-size: 12px;
    color: var(--ink-30);
    margin-top: 6px;
  }

  /* ── REVIEW NOTICE ── */
  .review-notice {
    background: #FFFBF5;
    border: 1px solid #F0D9C0;
    border-radius: var(--radius-sm);
    padding: 12px 16px;
    font-size: 12px;
    color: var(--copper);
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 20px;
    line-height: 1.5;
  }

  .review-notice::before { content: '⚠'; flex-shrink: 0; }

  /* ── REVIEW CHECKBOX ── */
  .review-check {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    cursor: pointer;
    font-size: 13px;
    color: var(--ink-60);
    user-select: none;
  }

  .review-check input { width: 16px; height: 16px; accent-color: var(--sage); cursor: pointer; }
  .review-check.checked { color: var(--sage); font-weight: 500; }

  /* ── BACK EDIT ── */
  .back-edit {
    font-size: 12px;
    color: var(--ink-60);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 0;
    border: none;
    background: none;
    font-family: 'DM Sans', sans-serif;
    transition: color 0.15s;
  }
  .back-edit:hover { color: var(--ink); }

  /* ── COPIED STATE ── */
  .copied-toast {
    position: fixed;
    bottom: 32px;
    right: 32px;
    background: var(--sage);
    color: white;
    font-size: 13px;
    font-weight: 500;
    padding: 10px 20px;
    border-radius: var(--radius-sm);
    box-shadow: var(--shadow-md);
    animation: toastIn 0.2s ease;
    z-index: 100;
  }

  @keyframes toastIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── FADE IN ── */
  .fade-in {
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── CHAR COUNT ── */
  .char-count {
    font-size: 11px;
    color: var(--ink-30);
    text-align: right;
    margin-top: 4px;
  }
`;

// ─── PROMPT BUILDER ───────────────────────────────────────────────────────────

function buildPrompt(form) {
  return `You are a professional proposal writer for small service businesses. Write a complete, compelling business proposal based on the details below. The proposal should sound ${form.tone}, tailored to the client, and ready to send.

BUSINESS DETAILS:
- Business Name: ${form.businessName}
- Contact Info: ${form.contactInfo}

CLIENT DETAILS:
- Client Name: ${form.clientName}
- Client Company: ${form.clientCompany}

PROJECT DETAILS:
- Project Type: ${form.projectType}
- Project Scope: ${form.scopeDescription}
- Key Deliverables: ${form.keyDeliverables}
- Timeline: ${form.timeline}
- Budget Range: ${form.budgetRange}
- Tone: ${form.tone}

Write the proposal with these exact sections in this order:
1. EXECUTIVE SUMMARY — 2-3 sentences introducing the proposal and the opportunity
2. UNDERSTANDING YOUR NEEDS — Show empathy and understanding of the client's challenge
3. OUR APPROACH — How you will solve their problem, method and philosophy
4. SCOPE OF WORK — Bullet list of specific deliverables
5. TIMELINE — Clear phased breakdown
6. INVESTMENT — Pricing structured around the budget range provided. Label all figures as "estimated" and note they are subject to final scope confirmation.
7. WHY US — 2-3 sentences on what makes this business uniquely qualified
8. NEXT STEPS — Clear, friendly call to action

Format rules:
- Use "## SECTION NAME" for section headers
- Use bullet points (starting with -) for lists
- Keep each section concise and high-quality
- Do not include generic filler content
- Write as if ${form.businessName} is speaking directly to ${form.clientName} at ${form.clientCompany}
- Do NOT include a subject line or "Dear..." opening — start directly with the Executive Summary section`;
}

// ─── PROPOSAL RENDERER ────────────────────────────────────────────────────────

// Strip markdown formatting characters LLMs sometimes add
function cleanMd(str) {
  return str
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^#+\s*/, "")
    .trim();
}

function renderProposal(text, form) {
  const lines = text.split("\n");
  const elements = [];
  let key = 0;

  // Title block
  elements.push(
    <div key={key++}>
      <h1>{form.projectType} Proposal</h1>
      <p className="p-meta">
        Prepared for {form.clientName}{form.clientCompany ? ` · ${form.clientCompany}` : ""} &nbsp;·&nbsp;
        Prepared by {form.businessName} &nbsp;·&nbsp;
        {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
      </p>
    </div>
  );

  let inList = false;
  let listItems = [];
  let lastHeading = "";

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(<ul key={key++}>{listItems.map((li, i) => <li key={i}>{cleanMd(li)}</li>)}</ul>);
      listItems = [];
      inList = false;
    }
  };

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      return;
    }

    const isHashHeading = /^#{1,3}\s+/.test(trimmed);
    const isBoldHeading = /^\*\*[A-Z][A-Z\s&!?:–-]{3,}\*\*$/.test(trimmed);
    const isAllCapsHeading = /^[A-Z][A-Z\s&!?:–-]{3,}$/.test(trimmed) && trimmed.length < 60;

    if (isHashHeading || isBoldHeading || isAllCapsHeading) {
      flushList();
      const heading = cleanMd(trimmed);
      lastHeading = heading;
      if (heading === "NEXT STEPS") {
        elements.push(<hr key={key++} className="divider" />);
      }
      elements.push(<h2 key={key++}>{heading}</h2>);
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("• ") || trimmed.startsWith("* ")) {
      inList = true;
      listItems.push(trimmed.replace(/^[-•*]\s*/, ""));
    } else {
      flushList();
      if (lastHeading === "NEXT STEPS") {
        elements.push(<div key={key++} className="p-cta">{cleanMd(trimmed)}</div>);
      } else {
        elements.push(<p key={key++}>{cleanMd(trimmed)}</p>);
      }
    }
  });

  flushList();
  return <div className="p-doc fade-in">{elements}</div>;
}

// ─── STEP COMPONENTS ──────────────────────────────────────────────────────────

function StepClient({ form, onChange }) {
  return (
    <div className="field-group fade-in">
      <div className="field-row">
        <div className="field">
          <label className="field-label">Client Name <span className="field-required">*</span></label>
          <input value={form.clientName} onChange={e => onChange("clientName", e.target.value)} placeholder="Jane Smith" />
        </div>
        <div className="field">
          <label className="field-label">Client Company</label>
          <input value={form.clientCompany} onChange={e => onChange("clientCompany", e.target.value)} placeholder="Acme Corp" />
        </div>
      </div>
      <div className="field">
        <label className="field-label">Project Type <span className="field-required">*</span></label>
        <select value={form.projectType} onChange={e => onChange("projectType", e.target.value)}>
          <option value="">Select a project type…</option>
          {PROJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
    </div>
  );
}

function StepProject({ form, onChange }) {
  return (
    <div className="field-group fade-in">
      <div className="field">
        <label className="field-label">Project Scope <span className="field-required">*</span></label>
        <textarea
          value={form.scopeDescription}
          onChange={e => onChange("scopeDescription", e.target.value)}
          placeholder="Describe the project in a few sentences. What does the client need and what problem are you solving?"
          rows={4}
        />
        <div className="char-count">{form.scopeDescription.length} / 600</div>
      </div>
      <div className="field">
        <label className="field-label">Key Deliverables <span className="field-required">*</span></label>
        <textarea
          value={form.keyDeliverables}
          onChange={e => onChange("keyDeliverables", e.target.value)}
          placeholder="List the specific outputs you'll deliver (e.g. 5-page website, logo + brand guide, monthly report…)"
          rows={3}
        />
      </div>
    </div>
  );
}

function StepDetails({ form, onChange }) {
  return (
    <div className="field-group fade-in">
      <div className="field-row">
        <div className="field">
          <label className="field-label">Timeline <span className="field-required">*</span></label>
          <input value={form.timeline} onChange={e => onChange("timeline", e.target.value)} placeholder="e.g. 6 weeks, by March 31" />
        </div>
        <div className="field">
          <label className="field-label">Budget Range <span className="field-required">*</span></label>
          <input value={form.budgetRange} onChange={e => onChange("budgetRange", e.target.value)} placeholder="e.g. $3,000–$5,000" />
        </div>
      </div>
      <div className="field">
        <label className="field-label">Proposal Tone</label>
        <div className="tone-grid">
          {TONES.map(t => (
            <div
              key={t.value}
              className={`tone-card${form.tone === t.value ? " selected" : ""}`}
              onClick={() => onChange("tone", t.value)}
            >
              <div className="tone-name">{t.label}</div>
              <div className="tone-desc">{t.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepBusiness({ form, onChange }) {
  return (
    <div className="field-group fade-in">
      <div className="field">
        <label className="field-label">Your Business Name <span className="field-required">*</span></label>
        <input value={form.businessName} onChange={e => onChange("businessName", e.target.value)} placeholder="Your Studio / Freelance Name" />
      </div>
      <div className="field">
        <label className="field-label">Your Contact Info <span className="field-required">*</span></label>
        <input value={form.contactInfo} onChange={e => onChange("contactInfo", e.target.value)} placeholder="email@yoursite.com  ·  +1 (555) 000-0000" />
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function ProposalGenerator() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL_FORM);
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showGenerate, setShowGenerate] = useState(false);
  const proposalRef = useRef(null);

  const onChange = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const stepValid = () => {
    if (step === 0) return form.clientName && form.projectType;
    if (step === 1) return form.scopeDescription && form.keyDeliverables;
    if (step === 2) return form.timeline && form.budgetRange;
    if (step === 3) return form.businessName && form.contactInfo;
    return true;
  };

  const next = () => {
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else setShowGenerate(true);
  };

  const back = () => {
    if (showGenerate) { setShowGenerate(false); setStep(STEPS.length - 1); }
    else if (step > 0) setStep(s => s - 1);
  };

  const generate = async () => {
    setLoading(true);
    setProposal(null);
    setReviewed(false);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "You are a professional proposal writer for small service businesses. Write proposals that are tailored, compelling, and ready to send. Never add preamble or explanation — output only the proposal content.",
          messages: [{ role: "user", content: buildPrompt(form) }]
        })
      });
      const data = await res.json();
      const text = data.content?.find(b => b.type === "text")?.text || "Unable to generate proposal. Please try again.";
      setProposal(text);
    } catch (e) {
      setProposal("An error occurred while generating the proposal. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyProposal = () => {
    if (!proposal) return;
    navigator.clipboard.writeText(proposal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const STEP_CONFIGS = [
    { title: <><em>Who</em> are you proposing to?</>, subtitle: "Client info and project type", content: <StepClient form={form} onChange={onChange} /> },
    { title: <>What's the <em>scope?</em></>,        subtitle: "Project description and deliverables", content: <StepProject form={form} onChange={onChange} /> },
    { title: <>Timeline &amp; <em>budget</em></>,    subtitle: "Schedule and investment range", content: <StepDetails form={form} onChange={onChange} /> },
    { title: <>About <em>your</em> business</>,      subtitle: "Your name and contact details", content: <StepBusiness form={form} onChange={onChange} /> },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="app-shell">

        {/* ── SIDEBAR ── */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-mark">P</div>
            <div>
              <div className="logo-text">ProposalAI</div>
              <div className="logo-sub">Proposal Generator</div>
            </div>
          </div>

          <nav className="sidebar-steps">
            {STEPS.map((s, i) => (
              <div key={s.id}>
                <div
                  className={`step-item${step === i && !showGenerate ? " active" : ""}${i < step || showGenerate ? " completed" : ""}`}
                  onClick={() => { if (!showGenerate && i <= step) setStep(i); }}
                >
                  <div className="step-num">
                    {(i < step || showGenerate) ? "✓" : s.icon}
                  </div>
                  <span className="step-label">{s.label}</span>
                </div>
                {i < STEPS.length - 1 && <div className="step-connector" />}
              </div>
            ))}
            <div className="step-connector" />
            <div className={`step-item${showGenerate ? " active" : ""}`}>
              <div className="step-num" style={{ background: showGenerate ? "var(--copper)" : undefined, color: showGenerate ? "white" : undefined }}>✦</div>
              <span className="step-label" style={{ color: showGenerate ? "var(--cream)" : undefined }}>Generate</span>
            </div>
          </nav>

          <div className="sidebar-footer">
            <div className="sidebar-hint">
              Fill in all four sections, then generate a polished proposal in seconds.
              Always review before sending.
            </div>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className="main">
          {!showGenerate ? (
            <>
              <div className="main-header">
                <div>
                  <h1 className="step-title">{STEP_CONFIGS[step].title}</h1>
                  <p className="step-subtitle">{STEP_CONFIGS[step].subtitle}</p>
                </div>
                <div className="progress-pill">Step {step + 1} of {STEPS.length}</div>
              </div>

              <div className="form-area">
                {STEP_CONFIGS[step].content}

                <div className="nav-row">
                  {step > 0
                    ? <button className="btn btn-ghost" onClick={back}>← Back</button>
                    : <span />
                  }
                  <button className="btn btn-primary" onClick={next} disabled={!stepValid()}>
                    {step < STEPS.length - 1 ? "Continue →" : "Review & Generate →"}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="generate-view">
              <div className="generate-header">
                <button className="back-edit" onClick={back}>← Edit answers</button>
                <h1 className="step-title" style={{ marginTop: 12 }}>
                  Ready to <em>generate</em>
                </h1>
                <p className="step-subtitle">Your proposal for {form.clientName || "your client"} — {form.projectType}</p>
              </div>

              <div className="summary-cards">
                {[
                  ["Client",    form.clientName + (form.clientCompany ? ` · ${form.clientCompany}` : "")],
                  ["Project",   form.projectType],
                  ["Timeline",  form.timeline],
                  ["Budget",    form.budgetRange],
                  ["Tone",      form.tone.charAt(0).toUpperCase() + form.tone.slice(1)],
                  ["From",      form.businessName],
                ].map(([label, value]) => (
                  <div className="summary-card" key={label}>
                    <div className="summary-card-label">{label}</div>
                    <div className="summary-card-value">{value || "—"}</div>
                  </div>
                ))}
              </div>

              <div className="generate-btn-wrap">
                <button className="btn-generate" onClick={generate} disabled={loading}>
                  {loading ? (
                    <><span className="loader-ring" style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", marginBottom: 0, display: "inline-block" }} /> Generating…</>
                  ) : (
                    <>✦ Generate Proposal</>
                  )}
                </button>
                {!loading && !proposal && (
                  <span className="generate-hint">Takes about 10–15 seconds</span>
                )}
                {proposal && !loading && (
                  <span className="generate-hint" style={{ color: "var(--sage)" }}>✓ Proposal generated — review before sending</span>
                )}
              </div>

              {/* Review notice + checkbox */}
              {proposal && !loading && (
                <>
                  <div className="review-notice">
                    Review all figures, timelines, and claims carefully before sending. AI-generated proposals may contain estimated or inaccurate details.
                  </div>
                  <label className={`review-check${reviewed ? " checked" : ""}`}>
                    <input type="checkbox" checked={reviewed} onChange={e => setReviewed(e.target.checked)} />
                    I have reviewed this proposal and confirm it is accurate
                  </label>
                </>
              )}

              {/* Proposal preview */}
              <div className="proposal-wrap">
                <div className="proposal-toolbar">
                  <div className="toolbar-dots">
                    <div className="dot dot-red" />
                    <div className="dot dot-yellow" />
                    <div className="dot dot-green" />
                  </div>
                  <span className="toolbar-label">{form.projectType || "Proposal"} · {form.clientName || "Client"}</span>
                  <button className="proposal-copy-btn" onClick={copyProposal} disabled={!proposal || !reviewed}>
                    {copied ? "✓ Copied" : "Copy text"}
                  </button>
                </div>

                {loading ? (
                  <div className="loading-wrap">
                    <div className="loader-ring" />
                    <div className="loader-text">Writing your proposal…</div>
                    <div className="loader-sub">Crafting sections based on your inputs</div>
                  </div>
                ) : proposal ? (
                  <div className="proposal-content" ref={proposalRef}>
                    {renderProposal(proposal, form)}
                  </div>
                ) : (
                  <div className="proposal-placeholder">
                    <div className="placeholder-icon">✦</div>
                    <div className="placeholder-text">Your proposal will appear here</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {copied && <div className="copied-toast">Copied to clipboard ✓</div>}
    </>
  );
}
