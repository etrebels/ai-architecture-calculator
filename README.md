# AI Architecture Choice Calculator

**Open-source model for choosing an AI retrieval architecture** — LLM-only, vector RAG, property graph, or knowledge graph — scored on accuracy, cost, latency, and auditability. For CTOs, ML engineers, and data architects deciding how to ground an AI system.

▶ **Use the live tool:** [tools.langoptima.com/llm-architecture-choice](https://tools.langoptima.com/llm-architecture-choice)

The live version walks through the decision interactively. This repo is the open scoring model — inspect the trade-offs and adapt the weights to your constraints.

## What it models

- Comparative scoring of retrieval architectures against your accuracy, cost, latency, and governance/auditability requirements.
- Discovery prompts to surface which constraint actually dominates your decision.

## Install & use

```bash
npm install
npm run typecheck && npm test
```

```ts
import {
  calculateArchitectureResults,
  DEFAULT_ARCHITECTURE_PARAMS,
} from "@langoptima/ai-architecture-calculator";

const result = calculateArchitectureResults(DEFAULT_ARCHITECTURE_PARAMS);
```

Framework-agnostic TypeScript, zero runtime dependencies.

## Research behind the model

Base scores are calibrated composites across published benchmarks and peer-reviewed research (Gartner, NVIDIA, Lettria/AWS, ICLR 2024, and clinical KG studies) — not single benchmark values, so individual scores won't match any one study exactly. Peer-reviewed evidence for grounding retrieval in a knowledge graph in regulated, high-risk domains:

- Gene, V. & Sosoni, V. (2026). *Dual-Metric Compliance and Quality Evaluation of Knowledge Graph Mediated Translation in Regulated Domains.* NeTTIT 2026. [doi.org/10.26615/issn.2815-4711.2026_015](https://doi.org/10.26615/issn.2815-4711.2026_015)
- Gene, V. & Sosoni, V. (2026). *Knowledge-guided machine translation for regulatory compliance in high-risk industries.* Convergence 2026 (University of Surrey).

Both papers are downloadable from [tools.langoptima.com/research](https://tools.langoptima.com/research).

## Built by LangOptima

LangOptima builds AI-ready data and knowledge-graph systems for enterprises. This is one of our open-source [free tools](https://tools.langoptima.com) — [langoptima.com](https://www.langoptima.com).

## License

[Apache-2.0](./LICENSE). Free to use, modify, and redistribute. The **LangOptima name and marks are not licensed** — a fork may not imply endorsement (see [`NOTICE`](./NOTICE)). Contributions: [`CONTRIBUTING.md`](./CONTRIBUTING.md) · Support: [`SUPPORT.md`](./SUPPORT.md).
