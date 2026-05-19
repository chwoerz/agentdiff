export interface Feature {
  id: string;
  name: string;
  description: string;
  category: string;
  sortOrder: number;
}

export interface Implementation {
  id: string;
  name: string;
  featureId: string;
  description: string;
  example: string;
  syntax: string;
  docUrl: string;
  userExtensible: boolean;
  extensibilityNote?: string;
  customExample?: string;
}

export interface Platform {
  id: string;
  name: string;
}

export interface HarnessImplementation {
  implementationId: string;
  platforms: string[];
  notes: string;
}

export interface Harness {
  id: string;
  name: string;
  icon: string;
  website: string;
  platforms: Platform[];
  implementations: HarnessImplementation[];
}

export interface ResolvedHarnessImplementation {
  implementation: Implementation;
  platforms: string[];
  notes: string;
}

export interface ResolvedHarness {
  id: string;
  name: string;
  icon: string;
  website: string;
  platforms: Platform[];
  implementations: ResolvedHarnessImplementation[];
}

export interface ComparisonCell {
  harness: ResolvedHarness;
  supported: boolean;
  platforms: string[];
  notes: string;
}

export interface ComparisonRow {
  implementation: Implementation;
  cells: ComparisonCell[];
}

export interface ComparisonMatrix {
  feature: Feature;
  harnesses: ResolvedHarness[];
  rows: ComparisonRow[];
}

export interface FullMatrixCellImpl {
  implementationId: string;
  implementationName: string;
  platforms: string[];
  notes: string;
}

export interface FullMatrixCell {
  harnessId: string;
  harnessName: string;
  harnessIcon: string;
  supportedCount: number;
  totalCount: number;
  implementations: FullMatrixCellImpl[];
}

export interface FullMatrixRow {
  feature: Feature;
  totalImplementations: number;
  cells: FullMatrixCell[];
}

export interface FullMatrix {
  harnesses: ResolvedHarness[];
  rows: FullMatrixRow[];
}

export interface AppData {
  features: Feature[];
  implementations: Implementation[];
  harnesses: ResolvedHarness[];
}
