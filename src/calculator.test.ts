import { describe, it, expect } from "vitest";
import {
  calculateArchitectureResults,
  getInsight,
  getDiscoveryQuestion,
  ARCHITECTURES,
  DIMENSIONS,
  DIMENSION_SCORE_INDICES,
} from "./calculator";
import { DEFAULT_ARCHITECTURE_PARAMS } from "./types";
import type { ArchitectureId, ArchitectureParams } from "./types";

const ALL_IDS: ArchitectureId[] = ["llm", "vrag", "crag", "grag", "arag", "kgrag"];

// A profile every parameter table pushes toward the fast, cheap end:
// cost=0 subtracts up to 24 points from kgrag and boosts llm/vrag/crag,
// risk=0 strips kgrag's explainability/compliance edge.
const FAST_MVP_PARAMS: ArchitectureParams = {
  query: 0,
  data: 0,
  risk: 0,
  schema: 0,
  update: 0,
  cost: 0,
  ml: 0,
  provenance: 0,
  errorCost: 0,
  volume: 1,
};

// A profile every parameter table pushes toward the governed end:
// curated ontology, regulated risk, schema-constrained, full build
// investment, enterprise multilingual, audit-grade provenance.
const REGULATED_PARAMS: ArchitectureParams = {
  query: 1,
  data: 2,
  risk: 2,
  schema: 1,
  update: 0,
  cost: 2,
  ml: 2,
  provenance: 2,
  errorCost: 2,
  volume: 2,
};

describe("calculateArchitectureResults", () => {
  it("returns scores, composite, and ranking for all six architectures", () => {
    const r = calculateArchitectureResults(DEFAULT_ARCHITECTURE_PARAMS);

    for (const id of ALL_IDS) {
      expect(r.scores[id]).toHaveLength(7); // 7 raw dimensions per architecture
      expect(typeof r.composite[id]).toBe("number");
    }
    expect(r.ranked).toHaveLength(ALL_IDS.length);
    expect(new Set(r.ranked.map(([id]) => id)).size).toBe(ALL_IDS.length);
  });

  it("ranks architectures by composite, descending, with a consistent margin", () => {
    const r = calculateArchitectureResults(DEFAULT_ARCHITECTURE_PARAMS);

    for (let i = 1; i < r.ranked.length; i++) {
      expect(r.ranked[i - 1][1]).toBeGreaterThanOrEqual(r.ranked[i][1]);
    }
    expect(r.topId).toBe(r.ranked[0][0]);
    expect(r.secondId).toBe(r.ranked[1][0]);
    expect(r.marginDiff).toBe(r.ranked[0][1] - r.ranked[1][1]);
    expect(r.marginDiff).toBeGreaterThanOrEqual(0);
  });

  it("clamps every dimension score to integers in [4, 99] at the extremes", () => {
    const allZero: ArchitectureParams = {
      query: 0, data: 0, risk: 0, schema: 0, update: 0,
      cost: 0, ml: 0, provenance: 0, errorCost: 0, volume: 0,
    };
    const allMax: ArchitectureParams = {
      query: 2, data: 2, risk: 2, schema: 1, update: 2,
      cost: 2, ml: 2, provenance: 2, errorCost: 2, volume: 2,
    };
    for (const params of [DEFAULT_ARCHITECTURE_PARAMS, allZero, allMax]) {
      const r = calculateArchitectureResults(params);
      for (const id of ALL_IDS) {
        for (const score of r.scores[id]) {
          expect(Number.isInteger(score)).toBe(true);
          expect(score).toBeGreaterThanOrEqual(4);
          expect(score).toBeLessThanOrEqual(99);
        }
        // Composite is a normalized weighted average of clamped scores,
        // so it must stay inside the same bounds.
        expect(Number.isInteger(r.composite[id])).toBe(true);
        expect(r.composite[id]).toBeGreaterThanOrEqual(4);
        expect(r.composite[id]).toBeLessThanOrEqual(99);
      }
    }
  });

  it("is deterministic for identical inputs", () => {
    const a = calculateArchitectureResults(DEFAULT_ARCHITECTURE_PARAMS);
    const b = calculateArchitectureResults(DEFAULT_ARCHITECTURE_PARAMS);
    expect(b).toEqual(a);
  });

  it("recommends KnowledgeGraphRAG for a regulated, ontology-backed profile", () => {
    const r = calculateArchitectureResults(REGULATED_PARAMS);
    expect(r.topId).toBe("kgrag");
  });

  it("does not recommend KnowledgeGraphRAG for a fast-MVP exploratory profile", () => {
    const r = calculateArchitectureResults(FAST_MVP_PARAMS);
    expect(r.topId).not.toBe("kgrag");
    // cost=0 and risk=0 penalties must leave even a bare LLM ahead of kgrag.
    expect(r.composite.llm).toBeGreaterThan(r.composite.kgrag);
  });
});

describe("model metadata", () => {
  it("keeps DIMENSIONS and DIMENSION_SCORE_INDICES aligned", () => {
    expect(DIMENSIONS).toHaveLength(6);
    expect(DIMENSION_SCORE_INDICES).toHaveLength(6);
    const r = calculateArchitectureResults(DEFAULT_ARCHITECTURE_PARAMS);
    for (const idx of DIMENSION_SCORE_INDICES) {
      for (const id of ALL_IDS) {
        expect(r.scores[id][idx]).toBeDefined();
      }
    }
  });

  it("declares each architecture exactly once", () => {
    expect(ARCHITECTURES.map((a) => a.id).sort()).toEqual([...ALL_IDS].sort());
  });
});

describe("getInsight", () => {
  it("returns a distinct, non-empty insight for every architecture", () => {
    const insights = ALL_IDS.map((id) => getInsight(id, DEFAULT_ARCHITECTURE_PARAMS));
    for (const text of insights) {
      expect(text.length).toBeGreaterThan(0);
    }
    expect(new Set(insights).size).toBe(ALL_IDS.length);
  });
});

describe("getDiscoveryQuestion", () => {
  it("returns a non-empty question for every architecture", () => {
    for (const id of ALL_IDS) {
      expect(
        getDiscoveryQuestion(id, DEFAULT_ARCHITECTURE_PARAMS).length,
      ).toBeGreaterThan(0);
    }
  });

  it("prioritizes the audit-trail question when provenance is required", () => {
    // provenance === 2 is checked before topId, so every architecture
    // gets the auditor question.
    for (const id of ALL_IDS) {
      const q = getDiscoveryQuestion(id, {
        ...DEFAULT_ARCHITECTURE_PARAMS,
        provenance: 2,
      });
      expect(q).toContain("auditor");
    }
  });
});
