export type { ArchitectureId, ArchitectureParams, ArchitectureResults } from "./types";
export { DEFAULT_ARCHITECTURE_PARAMS } from "./types";
export {
  calculateArchitectureResults,
  getInsight,
  getDiscoveryQuestion,
  ARCHITECTURES,
  PARAMETERS,
  DIMENSIONS,
  DIMENSION_SCORE_INDICES,
} from "./calculator";
export type { Architecture, Parameter, ParameterOption } from "./calculator";
