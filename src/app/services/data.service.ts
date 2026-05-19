import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import {
  AppData,
  Feature,
  Implementation,
  ResolvedHarness,
  ComparisonMatrix,
  ComparisonRow,
  ComparisonCell,
} from "../models/data.models";

export interface SearchResults {
  features: Feature[];
  implementations: Implementation[];
  harnesses: ResolvedHarness[];
}

@Injectable({ providedIn: "root" })
export class DataService {
  private data: AppData = { features: [], implementations: [], harnesses: [] };

  constructor(private http: HttpClient) {}

  async init(): Promise<void> {
    const data = await firstValueFrom(
      this.http.get<AppData>("assets/data.json")
    );
    this.loadData(data);
  }

  loadData(data: AppData): void {
    this.data = data;
  }

  getFeatures(): Feature[] {
    return [...this.data.features].sort((a, b) => a.sortOrder - b.sortOrder);
  }

  getFeature(id: string): Feature | null {
    return this.data.features.find((f) => f.id === id) ?? null;
  }

  getHarnesses(): ResolvedHarness[] {
    return this.data.harnesses;
  }

  getHarness(id: string): ResolvedHarness | null {
    return this.data.harnesses.find((h) => h.id === id) ?? null;
  }

  getImplementation(id: string): Implementation | null {
    return this.data.implementations.find((i) => i.id === id) ?? null;
  }

  getImplementationsForFeature(featureId: string): Implementation[] {
    return this.data.implementations.filter((i) => i.featureId === featureId);
  }

  getComparisonMatrix(featureId: string): ComparisonMatrix | null {
    const feature = this.getFeature(featureId);
    if (!feature) return null;

    const implementations = this.getImplementationsForFeature(featureId);
    const harnesses = this.data.harnesses;

    const rows: ComparisonRow[] = implementations.map((impl) => {
      const cells: ComparisonCell[] = harnesses.map((harness) => {
        const match = harness.implementations.find(
          (hi) => hi.implementation.id === impl.id
        );
        return {
          harness,
          supported: !!match,
          platforms: match?.platforms ?? [],
          notes: match?.notes ?? "",
        };
      });
      return { implementation: impl, cells };
    });

    return { feature, harnesses, rows };
  }

  search(query: string): SearchResults {
    const q = query.toLowerCase();
    return {
      features: this.data.features.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q)
      ),
      implementations: this.data.implementations.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q)
      ),
      harnesses: this.data.harnesses.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.website.toLowerCase().includes(q)
      ),
    };
  }
}
