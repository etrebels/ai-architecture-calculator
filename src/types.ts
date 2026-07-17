export type ArchitectureId = "llm" | "vrag" | "crag" | "grag" | "arag" | "kgrag";

export interface ArchitectureParams {
  query: number;
  data: number;
  risk: number;
  schema: number;
  update: number;
  cost: number;
  ml: number;
  provenance: number;
  errorCost: number;
  volume: number;
}

export interface ArchitectureResults {
  scores: Record<ArchitectureId, number[]>;
  composite: Record<ArchitectureId, number>;
  ranked: [ArchitectureId, number][];
  topId: ArchitectureId;
  secondId: ArchitectureId;
  marginDiff: number;
}

export const DEFAULT_ARCHITECTURE_PARAMS: ArchitectureParams = {
  query: 1,
  data: 0,
  risk: 1,
  schema: 0,
  update: 0,
  cost: 1,
  ml: 0,
  provenance: 0,
  errorCost: 1,
  volume: 1,
};
