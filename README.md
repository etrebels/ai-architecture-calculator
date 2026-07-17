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

## Built by LangOptima

LangOptima builds AI-ready data and knowledge-graph systems for enterprises. This is one of our open-source [free tools](https://tools.langoptima.com) — [langoptima.com](https://www.langoptima.com).

## License

[Apache-2.0](./LICENSE). Free to use, modify, and redistribute. The **LangOptima name and marks are not licensed** — a fork may not imply endorsement (see [`NOTICE`](./NOTICE)). Contributions: [`CONTRIBUTING.md`](./CONTRIBUTING.md) · Support: [`SUPPORT.md`](./SUPPORT.md).
