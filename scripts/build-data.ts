import * as fs from "fs";
import * as path from "path";
import * as yaml from "js-yaml";

interface RawFeature {
  id: string;
  name: string;
  description: string;
  category: string;
  sortOrder: number;
}

interface RawImplementation {
  id: string;
  name: string;
  featureId: string;
  description: string;
  example: string;
  syntax: string;
  docUrl: string;
  userExtensible?: boolean;
  extensibilityNote?: string;
  customExample?: string;
}

interface RawHarnessImplementation {
  implementationId: string;
  platforms: string[];
  notes: string;
}

interface RawHarness {
  id: string;
  name: string;
  icon: string;
  website: string;
  platforms: { id: string; name: string }[];
  implementations: RawHarnessImplementation[];
}

interface ResolvedHarnessImplementation {
  implementation: RawImplementation;
  platforms: string[];
  notes: string;
}

interface ResolvedHarness {
  id: string;
  name: string;
  icon: string;
  website: string;
  platforms: { id: string; name: string }[];
  implementations: ResolvedHarnessImplementation[];
}

interface AppData {
  features: RawFeature[];
  implementations: RawImplementation[];
  harnesses: ResolvedHarness[];
}

const DATA_DIR = path.resolve(__dirname, "../data");
const OUTPUT_PATH = path.resolve(__dirname, "../src/assets/data.json");

function readYamlDir<T>(dir: string): T[] {
  const dirPath = path.join(DATA_DIR, dir);
  if (!fs.existsSync(dirPath)) return [];
  return fs
    .readdirSync(dirPath)
    .filter((f) => f.endsWith(".yaml") || f.endsWith(".yml"))
    .map((f) => yaml.load(fs.readFileSync(path.join(dirPath, f), "utf8")) as T);
}

function build(): void {
  const features = readYamlDir<RawFeature>("features").sort(
    (a, b) => a.sortOrder - b.sortOrder
  );
  const implementations = readYamlDir<RawImplementation>("implementations");
  const rawHarnesses = readYamlDir<RawHarness>("harnesses");

  const implMap = new Map(implementations.map((i) => [i.id, i]));

  const harnesses: ResolvedHarness[] = rawHarnesses.map((h) => ({
    id: h.id,
    name: h.name,
    icon: h.icon,
    website: h.website,
    platforms: h.platforms,
    implementations: h.implementations.map((hi) => {
      const impl = implMap.get(hi.implementationId);
      if (!impl) {
        throw new Error(
          `Harness "${h.id}" references unknown implementation "${hi.implementationId}"`
        );
      }
      return {
        implementation: impl,
        platforms: hi.platforms,
        notes: hi.notes,
      };
    }),
  }));

  // Validate all implementations reference valid features
  const featureIds = new Set(features.map((f) => f.id));
  for (const impl of implementations) {
    if (!featureIds.has(impl.featureId)) {
      throw new Error(
        `Implementation "${impl.id}" references unknown feature "${impl.featureId}"`
      );
    }
  }

  const data: AppData = { features, implementations, harnesses };

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2));

  console.log(
    `Built data.json: ${features.length} features, ${implementations.length} implementations, ${harnesses.length} harnesses`
  );
}

build();
