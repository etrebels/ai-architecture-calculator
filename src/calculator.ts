import { ArchitectureId, ArchitectureParams, ArchitectureResults } from "./types";

export interface Architecture {
  id: ArchitectureId;
  label: string;
  level: string;
  color: string;
  tagline: string;
  type: string;
  desc: string;
  fail: string;
}

export interface ParameterOption { v: number; l: string; s: string; }
export interface Parameter { id: keyof ArchitectureParams; label: string; opts: ParameterOption[]; }

export const ARCHITECTURES: Architecture[] = [
  { id: "llm", label: "Bare LLM", level: "Level 0", color: "#f87171", tagline: "Neural only, no retrieval", type: "Pure neural", desc: "The model answers from training. Works for exploration. Breaks where accuracy matters.", fail: "Hallucinated answers with full confidence. No audit path." },
  { id: "vrag", label: "VectorRAG", level: "Level 1", color: "#fbbf24", tagline: "Neural + unstructured retrieval", type: "Neural + similarity search", desc: "Splits documents into chunks, retrieves by vector similarity. Reduces hallucinations on direct lookups. Fails on relational queries.", fail: "Zero accuracy on schema-constrained or multi-hop queries (Diffbot: 0% on strategic planning)." },
  { id: "crag", label: "Corrective RAG", level: "Level 1.5", color: "#a78bfa", tagline: "Neural + self-correcting retrieval", type: "Neural + evaluated retrieval", desc: "Adds a retrieval evaluator that scores documents as Correct, Incorrect, or Ambiguous before generation. Self-corrects bad retrievals. ICLR 2024: +35.8 points on PubHealth over standard RAG.", fail: "Still vector-based retrieval. Web search fallback unusable with proprietary data. Per-query evaluation cost." },
  { id: "grag", label: "GraphRAG", level: "Level 2", color: "#60a5fa", tagline: "Neural + LLM-extracted graph", type: "Proto neuro-symbolic", desc: "LLM extracts entities and relationships at indexing time, building a graph. Enables multi-hop reasoning and global sensemaking.", fail: "LLM extraction errors compound. Non-English noise. High indexing cost." },
  { id: "arag", label: "Agentic RAG", level: "Level 2.5", color: "#f472b6", tagline: "Neural + reasoning agent", type: "Agent-supervised retrieval", desc: "MDP-based reasoning agent that plans retrieval, verifies claims, and iterates. RAG-Gym: 25.6% over baselines. High per-query cost.", fail: "Per-query reasoning cost compounds at scale. Agent errors are non-deterministic. Requires RL training infrastructure." },
  { id: "kgrag", label: "KnowledgeGraphRAG", level: "Level 3", color: "#34d399", tagline: "Neuro-symbolic AI", type: "Full neuro-symbolic", desc: "Pre-built, expert-maintained ontology with typed entities and formal relationships. Every inference is traceable. Subsumes all lower-level techniques.", fail: "Ontology design cannot be shortcut. Requires ongoing domain expertise. Not suited to live data without update pipeline." },
];

export const PARAMETERS: Parameter[] = [
  { id: "query", label: "Query complexity", opts: [{ v: 0, l: "Single-hop", s: "Direct lookup from one source" }, { v: 1, l: "Multi-hop", s: "Cross-document reasoning" }, { v: 2, l: "Global sensemaking", s: "Patterns across the whole corpus" }] },
  { id: "data", label: "Data structure", opts: [{ v: 0, l: "Unstructured text", s: "Documents, articles, transcripts" }, { v: 1, l: "Structured / tabular", s: "Reports, financials, specs" }, { v: 2, l: "Curated ontology", s: "Expert-maintained Knowledge Graph" }] },
  { id: "risk", label: "Hallucination tolerance", opts: [{ v: 0, l: "Exploratory", s: "Approximation acceptable" }, { v: 1, l: "Operational", s: "Errors carry business cost" }, { v: 2, l: "Regulated", s: "Full provenance legally required" }] },
  { id: "schema", label: "Query nature", opts: [{ v: 0, l: "Free-form", s: "Open-ended natural language" }, { v: 1, l: "Schema-constrained", s: "Entity precision required" }] },
  { id: "update", label: "Data currency", opts: [{ v: 0, l: "Static corpus", s: "Fixed knowledge base" }, { v: 1, l: "Periodic refresh", s: "Weekly or monthly" }, { v: 2, l: "Live / real-time", s: "Continuous stream" }] },
  { id: "cost", label: "Build investment", opts: [{ v: 0, l: "Fast MVP", s: "Days" }, { v: 1, l: "Weeks", s: "Weeks with engineering support" }, { v: 2, l: "3+ months", s: "Full commitment" }] },
  { id: "ml", label: "Language scope", opts: [{ v: 0, l: "Single language", s: "Monolingual" }, { v: 1, l: "Bilingual / regional", s: "Two to five languages" }, { v: 2, l: "Enterprise multilingual", s: "Six+ languages, regulated" }] },
  { id: "provenance", label: "Provenance tracking", opts: [{ v: 0, l: "Not required", s: "No audit trail needed" }, { v: 1, l: "Preferred", s: "Traceable answers valued" }, { v: 2, l: "Required for audit", s: "Every output must trace to source" }] },
  { id: "errorCost", label: "Error cost", opts: [{ v: 0, l: "Low", s: "Internal drafts, brainstorming" }, { v: 1, l: "Medium", s: "Customer-facing, operational" }, { v: 2, l: "High", s: "Financial, clinical, regulatory" }] },
  { id: "volume", label: "Query volume", opts: [{ v: 0, l: "Low", s: "Under 1,000 queries/month" }, { v: 1, l: "Medium", s: "1,000 to 50,000/month" }, { v: 2, l: "High", s: "50,000+ queries/month" }] },
];

export const DIMENSIONS = ["Factual Accuracy", "Hallucination Safety", "Multi-hop Reasoning", "Comprehensiveness", "Explainability", "Compliance & Audit"];
export const DIMENSION_SCORE_INDICES = [0, 1, 2, 3, 4, 6];

const BASE: Record<ArchitectureId, number[]> = {
  llm:   [40, 30, 10, 42, 15, 98,  8],
  vrag:  [64, 60, 16, 50, 30, 85, 20],
  crag:  [72, 72, 28, 58, 35, 75, 25],
  grag:  [76, 70, 78, 74, 55, 42, 52],
  arag:  [74, 68, 65, 68, 45, 35, 35],
  kgrag: [80, 85, 76, 60, 80, 18, 80],
};

function computeScores(p: ArchitectureParams): Record<ArchitectureId, number[]> {
  const s: Record<string, number[]> = {};
  ARCHITECTURES.forEach((a) => { s[a.id] = [...BASE[a.id]]; });
  if (p.query === 0) { s.llm[0]+=18;s.llm[1]+=8;s.llm[3]+=12;s.vrag[0]+=20;s.vrag[1]+=6;s.vrag[3]+=10;s.crag[0]+=10;s.crag[1]+=6;s.crag[3]+=6;s.grag[0]-=12;s.grag[2]-=18;s.grag[3]-=10;s.arag[0]-=6;s.arag[2]-=12;s.kgrag[2]-=10;s.kgrag[3]-=5; }
  if (p.query === 1) { s.llm[0]-=18;s.llm[2]-=5;s.vrag[0]-=16;s.vrag[2]-=5;s.crag[0]-=10;s.crag[2]-=3;s.grag[0]+=8;s.grag[2]+=10;s.arag[0]+=6;s.arag[2]+=10;s.kgrag[0]+=6;s.kgrag[2]+=8; }
  if (p.query === 2) { s.llm[0]-=22;s.llm[3]-=25;s.vrag[0]-=20;s.vrag[3]-=24;s.crag[0]-=16;s.crag[3]-=18;s.grag[0]+=12;s.grag[3]+=18;s.grag[2]+=6;s.arag[0]+=4;s.arag[3]+=8;s.arag[2]+=4;s.kgrag[0]+=4;s.kgrag[3]+=10;s.kgrag[2]+=4; }
  if (p.data === 0) { s.vrag[0]+=8;s.vrag[3]+=6;s.crag[0]+=6;s.crag[3]+=5;s.llm[3]+=4;s.kgrag[3]-=3; }
  if (p.data === 1) { s.llm[0]+=10;s.llm[4]+=5;s.vrag[0]-=6;s.vrag[3]-=4;s.crag[0]-=4;s.crag[3]-=3;s.grag[0]-=10; }
  if (p.data === 2) { s.kgrag[0]+=12;s.kgrag[2]+=8;s.kgrag[4]+=6;s.kgrag[6]+=8;s.grag[0]-=8;s.arag[0]-=4; }
  if (p.risk === 0) { s.llm[0]+=14;s.llm[1]+=20;s.llm[3]+=10;s.vrag[0]+=10;s.vrag[1]+=12;s.vrag[3]+=6;s.crag[0]+=8;s.crag[1]+=10;s.crag[3]+=5;s.arag[0]+=6;s.arag[3]+=4;s.kgrag[4]-=18;s.kgrag[6]-=24;s.kgrag[0]-=4;s.grag[4]-=10;s.grag[6]-=14; }
  if (p.risk === 2) { s.llm[1]-=14;s.llm[6]-=10;s.llm[4]-=5;s.vrag[1]-=8;s.vrag[0]-=8;s.vrag[6]-=12;s.vrag[4]-=6;s.crag[1]-=4;s.crag[6]-=6;s.grag[6]+=10;s.grag[4]+=4;s.arag[4]+=3;s.arag[6]+=4;s.kgrag[1]+=8;s.kgrag[4]+=10;s.kgrag[6]+=6; }
  if (p.schema === 0) { s.llm[0]+=8;s.llm[3]+=6;s.vrag[3]-=3;s.arag[3]+=4; }
  if (p.schema === 1) { s.llm[0]-=20;s.llm[4]-=5;s.vrag[0]-=24;s.vrag[4]-=4;s.crag[0]-=18;s.crag[4]-=3;s.arag[0]-=8;s.arag[4]-=2;s.grag[0]+=6;s.grag[6]+=6;s.kgrag[0]+=8;s.kgrag[4]+=8;s.kgrag[6]+=8; }
  if (p.update === 0) { s.kgrag[0]+=5;s.kgrag[6]+=4;s.grag[0]+=4;s.grag[6]+=3; }
  if (p.update === 1) { s.kgrag[0]-=6;s.kgrag[6]-=4;s.grag[0]-=5;s.grag[6]-=3;s.vrag[0]+=6;s.vrag[6]+=4;s.crag[0]+=5;s.crag[6]+=3;s.llm[0]-=3; }
  if (p.update === 2) { s.kgrag[0]-=16;s.kgrag[6]-=14;s.kgrag[4]-=8;s.grag[0]-=12;s.grag[6]-=10;s.grag[4]-=5;s.arag[0]-=4;s.arag[6]-=4;s.vrag[0]+=10;s.vrag[6]+=6;s.crag[0]+=8;s.crag[6]+=5;s.llm[0]-=8;s.llm[3]-=4; }
  if (p.cost === 0) { s.llm[0]+=10;s.llm[3]+=8;s.llm[1]+=5;s.vrag[0]+=12;s.vrag[4]+=8;s.vrag[1]+=4;s.crag[0]+=4;s.crag[4]+=2;s.crag[1]+=2;s.grag[0]-=14;s.grag[4]-=12;s.grag[6]-=12;s.arag[0]-=16;s.arag[4]-=14;s.arag[6]-=14;s.kgrag[0]-=24;s.kgrag[1]-=12;s.kgrag[4]-=22;s.kgrag[6]-=26; }
  if (p.cost === 1) { s.vrag[0]+=6;s.vrag[4]+=4;s.crag[0]+=5;s.crag[4]+=3;s.grag[0]+=4;s.grag[4]+=3;s.arag[0]-=4;s.arag[4]-=3;s.kgrag[0]-=8;s.kgrag[4]-=6;s.kgrag[6]-=6; }
  if (p.cost === 2) { s.grag[0]+=8;s.grag[4]+=7;s.grag[6]+=8;s.arag[0]+=12;s.arag[4]+=8;s.arag[6]+=8;s.arag[2]+=6;s.kgrag[0]+=8;s.kgrag[1]+=4;s.kgrag[4]+=7;s.kgrag[6]+=8; }
  if (p.ml === 1) { s.vrag[0]-=6;s.vrag[6]-=6;s.crag[0]-=5;s.crag[6]-=5;s.kgrag[0]+=5;s.kgrag[6]+=6; }
  if (p.ml === 2) { s.llm[0]-=10;s.llm[6]-=12;s.vrag[0]-=22;s.vrag[6]-=22;s.crag[0]-=18;s.crag[6]-=18;s.grag[0]-=10;s.grag[6]-=10;s.arag[0]-=8;s.arag[6]-=8;s.kgrag[0]+=15;s.kgrag[4]+=10;s.kgrag[6]+=14; }
  if (p.provenance === 1) { s.kgrag[4]+=6;s.kgrag[6]+=4;s.grag[4]+=4;s.grag[6]+=3;s.arag[4]+=2;s.arag[6]+=2;s.llm[4]-=4;s.llm[6]-=3;s.vrag[4]-=3;s.vrag[6]-=2;s.crag[4]-=2;s.crag[6]-=1; }
  if (p.provenance === 2) { s.kgrag[4]+=14;s.kgrag[6]+=12;s.kgrag[1]+=6;s.grag[4]+=8;s.grag[6]+=8;s.grag[1]+=3;s.arag[4]+=4;s.arag[6]+=4;s.llm[4]-=10;s.llm[6]-=12;s.llm[1]-=6;s.vrag[4]-=8;s.vrag[6]-=10;s.vrag[1]-=4;s.crag[4]-=6;s.crag[6]-=8;s.crag[1]-=3; }
  if (p.errorCost === 0) { s.llm[0]+=8;s.llm[1]+=10;s.vrag[0]+=4;s.vrag[1]+=6;s.crag[0]+=3;s.crag[1]+=4; }
  if (p.errorCost === 2) { s.llm[0]-=8;s.llm[1]-=12;s.vrag[1]-=6;s.crag[1]+=4;s.crag[0]+=3;s.grag[1]+=4;s.grag[0]+=3;s.arag[1]+=3;s.arag[0]+=2;s.kgrag[1]+=8;s.kgrag[0]+=5;s.kgrag[6]+=4; }
  if (p.volume === 0) { s.llm[0]+=4;s.vrag[0]+=3;s.crag[0]+=2;s.arag[0]+=8;s.arag[2]+=4;s.kgrag[0]-=6; }
  if (p.volume === 2) { s.arag[0]-=10;s.arag[1]-=6;s.crag[0]-=3;s.kgrag[0]+=8;s.kgrag[6]+=4;s.grag[0]+=4; }
  Object.keys(s).forEach((a) => { s[a] = s[a].map((v) => Math.min(99, Math.max(4, Math.round(v)))); });
  return s as Record<ArchitectureId, number[]>;
}

function computeComposite(scores: Record<ArchitectureId, number[]>, p: ArchitectureParams): Record<ArchitectureId, number> {
  let w = [0.19, 0.19, 0.16, 0.14, 0.15, 0.17];
  if (p.risk === 0 && p.query === 0) w = [0.28, 0.10, 0.05, 0.28, 0.17, 0.12];
  else if (p.risk === 0 && p.query <= 1) w = [0.25, 0.12, 0.12, 0.24, 0.15, 0.12];
  else if (p.risk === 0) w = [0.22, 0.12, 0.15, 0.26, 0.13, 0.12];
  else if (p.risk === 2 && p.query >= 1) w = [0.12, 0.23, 0.14, 0.08, 0.16, 0.27];
  else if (p.risk === 2) w = [0.12, 0.25, 0.08, 0.08, 0.17, 0.30];
  else if (p.query === 2) w = [0.15, 0.15, 0.17, 0.28, 0.12, 0.13];
  else if (p.query === 1) w = [0.17, 0.17, 0.26, 0.14, 0.13, 0.13];
  else if (p.schema === 1) w = [0.22, 0.18, 0.12, 0.09, 0.22, 0.17];
  if (p.cost === 0) w = w.map((v, i) => (i === 5 ? v * 0.6 : v + (v * 0.4 * w[5]) / (1 - w[5])));
  if (p.ml === 2) w = w.map((v, i) => (i === 5 ? v + 0.08 : v - 0.08 / 5));
  if (p.provenance === 2) w = w.map((v, i) => (i === 4 ? v + 0.06 : i === 5 ? v + 0.06 : v - 0.12 / 4));
  if (p.errorCost === 2) w = w.map((v, i) => (i === 1 ? v + 0.05 : v - 0.05 / 5));
  if (p.volume === 2) w = w.map((v, i) => (i === 5 ? v + 0.03 : v - 0.03 / 5));
  // Floor at zero before normalizing: stacked flat subtractions can push a
  // small base weight negative, inverting that dimension's effect.
  w = w.map((v) => Math.max(0, v));
  const t = w.reduce((a, b) => a + b, 0);
  const wn = w.map((v) => v / t);
  const scoreIdx = [0, 1, 2, 3, 4, 6];
  const c: Record<string, number> = {};
  ARCHITECTURES.forEach((a) => { c[a.id] = Math.round(scoreIdx.reduce((sum, si, wi) => sum + scores[a.id][si] * wn[wi], 0)); });
  return c as Record<ArchitectureId, number>;
}

export function calculateArchitectureResults(params: ArchitectureParams): ArchitectureResults {
  const scores = computeScores(params);
  const composite = computeComposite(scores, params);
  const ranked = (Object.entries(composite) as [ArchitectureId, number][]).sort((a, b) => b[1] - a[1]);
  return { scores, composite, ranked, topId: ranked[0][0], secondId: ranked[1][0], marginDiff: ranked[0][1] - ranked[1][1] };
}

export function getInsight(topId: ArchitectureId, p: ArchitectureParams): string {
  if (topId === "llm") return "A bare LLM scores highest for your parameters. Every output is a draft, not a decision. The moment accuracy carries business cost, retrieval becomes essential.";
  if (topId === "vrag") return "VectorRAG scores highest. It reduces hallucination sharply on direct lookups and deploys quickly. The structural limitation: it retrieves similar text, not connected facts.";
  if (topId === "crag") return "Corrective RAG scores highest. Its self-evaluation catches retrieval errors before they reach the LLM (ICLR 2024: +35.8 points on PubHealth). Still vector-based \u2014 no structural provenance.";
  if (topId === "grag") return "GraphRAG scores highest. It bridges vector retrieval and full knowledge graphs \u2014 adding relational reasoning without ontology investment. NVIDIA 2024: excels in correctness.";
  if (topId === "arag") return "Agentic RAG scores highest. Its reasoning agent verifies claims iteratively (RAG-Gym: +25.6% over baselines). Watch per-query cost at scale.";
  return "KnowledgeGraphRAG scores highest. Every inference traces to a typed, authoritative source. The investment in ontology design pays dividends in accuracy, explainability, and audit readiness.";
}

export function getDiscoveryQuestion(topId: ArchitectureId, p: ArchitectureParams): string {
  if (p.provenance === 2) return "When an auditor asks to trace which source documents led to a specific AI output, what does that process look like today?";
  if (p.risk === 2) return "When a regulator asks why the AI said that, what does your current answer look like?";
  if (topId === "crag") return "When your RAG pipeline retrieves irrelevant documents, how do you catch it before the LLM generates a confident wrong answer?";
  if (topId === "arag") return "How many reasoning steps does your agent take per query, and what does that cost at your expected volume?";
  if (topId === "llm") return "When your AI gives a confident wrong answer, what is your recovery process?";
  if (topId === "grag") return "How do you validate that entities your LLM extracted are actually correct?";
  return "What is the cost \u2014 in time, money, or trust \u2014 of a wrong answer from your AI today?";
}
