import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { DataService } from "./data.service";
import { AppData } from "../models/data.models";

const MOCK_DATA: AppData = {
  features: [
    {
      id: "instructions",
      name: "Instructions",
      description: "Persistent guidance files",
      category: "configuration",
      sortOrder: 1,
    },
    {
      id: "hooks",
      name: "Hooks",
      description: "Event-driven automation",
      category: "automation",
      sortOrder: 4,
    },
  ],
  implementations: [
    {
      id: "claude-md",
      name: "CLAUDE.md",
      featureId: "instructions",
      description: "Claude instruction file",
      example: "# CLAUDE.md\n- Use strict mode",
      syntax: "markdown",
      docUrl: "https://example.com/claude-md",
      userExtensible: true,
    },
    {
      id: "agents-md",
      name: "AGENTS.md",
      featureId: "instructions",
      description: "Cross-tool instruction file",
      example: "# AGENTS.md\n- Follow patterns",
      syntax: "markdown",
      docUrl: "https://example.com/agents-md",
      userExtensible: true,
    },
    {
      id: "claude-hooks",
      name: "Claude Hooks",
      featureId: "hooks",
      description: "Hook system",
      example: '{ "hooks": {} }',
      syntax: "json",
      docUrl: "https://example.com/hooks",
      userExtensible: true,
    },
  ],
  harnesses: [
    {
      id: "claude-code",
      name: "Claude Code",
      icon: "claude-code.svg",
      website: "https://claude.ai/code",
      platforms: [
        { id: "cli", name: "CLI" },
        { id: "vscode", name: "VS Code" },
      ],
      implementations: [
        {
          implementation: {
            id: "claude-md",
            name: "CLAUDE.md",
            featureId: "instructions",
            description: "Claude instruction file",
            example: "# CLAUDE.md\n- Use strict mode",
            syntax: "markdown",
            docUrl: "https://example.com/claude-md",
            userExtensible: true,
          },
          platforms: ["cli", "vscode"],
          notes: "Auto-loaded",
        },
        {
          implementation: {
            id: "agents-md",
            name: "AGENTS.md",
            featureId: "instructions",
            description: "Cross-tool instruction file",
            example: "# AGENTS.md\n- Follow patterns",
            syntax: "markdown",
            docUrl: "https://example.com/agents-md",
            userExtensible: true,
          },
          platforms: ["cli", "vscode"],
          notes: "Also supported",
        },
        {
          implementation: {
            id: "claude-hooks",
            name: "Claude Hooks",
            featureId: "hooks",
            description: "Hook system",
            example: '{ "hooks": {} }',
            syntax: "json",
            docUrl: "https://example.com/hooks",
            userExtensible: true,
          },
          platforms: ["cli", "vscode"],
          notes: "Via settings.json",
        },
      ],
    },
    {
      id: "opencode",
      name: "OpenCode",
      icon: "opencode.svg",
      website: "https://opencode.ai",
      platforms: [{ id: "cli", name: "CLI" }],
      implementations: [
        {
          implementation: {
            id: "agents-md",
            name: "AGENTS.md",
            featureId: "instructions",
            description: "Cross-tool instruction file",
            example: "# AGENTS.md\n- Follow patterns",
            syntax: "markdown",
            docUrl: "https://example.com/agents-md",
            userExtensible: true,
          },
          platforms: ["cli"],
          notes: "Primary format",
        },
      ],
    },
  ],
};

describe("DataService", () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(DataService);
    service.loadData(MOCK_DATA);
  });

  it("should return all features sorted by sortOrder", () => {
    const features = service.getFeatures();
    expect(features.length).toBe(2);
    expect(features[0].id).toBe("instructions");
    expect(features[1].id).toBe("hooks");
  });

  it("should return a single feature by id", () => {
    const feature = service.getFeature("instructions");
    expect(feature).toBeTruthy();
    expect(feature!.name).toBe("Instructions");
  });

  it("should return null for unknown feature", () => {
    expect(service.getFeature("nonexistent")).toBeNull();
  });

  it("should return all harnesses", () => {
    const harnesses = service.getHarnesses();
    expect(harnesses.length).toBe(2);
  });

  it("should return a single harness by id", () => {
    const harness = service.getHarness("claude-code");
    expect(harness).toBeTruthy();
    expect(harness!.name).toBe("Claude Code");
  });

  it("should return implementations for a feature", () => {
    const impls = service.getImplementationsForFeature("instructions");
    expect(impls.length).toBe(2);
    expect(impls.map((i) => i.id)).toContain("claude-md");
    expect(impls.map((i) => i.id)).toContain("agents-md");
  });

  it("should build a comparison matrix", () => {
    const matrix = service.getComparisonMatrix("instructions");
    expect(matrix).toBeTruthy();
    expect(matrix!.feature.id).toBe("instructions");
    expect(matrix!.harnesses.length).toBe(2);
    expect(matrix!.rows.length).toBe(2);

    const claudeMdRow = matrix!.rows.find((r) => r.implementation.id === "claude-md")!;
    const claudeCodeCell = claudeMdRow.cells.find((c) => c.harness.id === "claude-code")!;
    expect(claudeCodeCell.supported).toBe(true);
    expect(claudeCodeCell.platforms).toEqual(["cli", "vscode"]);

    const openCodeCell = claudeMdRow.cells.find((c) => c.harness.id === "opencode")!;
    expect(openCodeCell.supported).toBe(false);
  });

  it("should find agents-md shared between harnesses", () => {
    const matrix = service.getComparisonMatrix("instructions");
    const agentsMdRow = matrix!.rows.find((r) => r.implementation.id === "agents-md")!;
    const claudeCell = agentsMdRow.cells.find((c) => c.harness.id === "claude-code")!;
    const openCodeCell = agentsMdRow.cells.find((c) => c.harness.id === "opencode")!;
    expect(claudeCell.supported).toBe(true);
    expect(openCodeCell.supported).toBe(true);
  });

  it("should search across features, implementations, and harnesses", () => {
    const results = service.search("claude");
    expect(results.implementations.map((i) => i.id)).toContain("claude-md");
    expect(results.harnesses.map((h) => h.id)).toContain("claude-code");
  });

  it("should return empty search results for no match", () => {
    const results = service.search("zzzznonexistent");
    expect(results.features.length).toBe(0);
    expect(results.implementations.length).toBe(0);
    expect(results.harnesses.length).toBe(0);
  });
});

describe("getFullMatrix", () => {
  it("should return a row for each feature", () => {
    const service = new DataService(null as any);
    service.loadData({
      features: [
        { id: "f1", name: "Feature 1", description: "", category: "cat", sortOrder: 1 },
        { id: "f2", name: "Feature 2", description: "", category: "cat", sortOrder: 2 },
      ],
      implementations: [
        { id: "impl1", name: "Impl 1", featureId: "f1", description: "", example: "", syntax: "", docUrl: "", userExtensible: false },
        { id: "impl2", name: "Impl 2", featureId: "f1", description: "", example: "", syntax: "", docUrl: "", userExtensible: false },
        { id: "impl3", name: "Impl 3", featureId: "f2", description: "", example: "", syntax: "", docUrl: "", userExtensible: false },
      ],
      harnesses: [
        {
          id: "h1", name: "Harness 1", icon: "h1.svg", website: "", platforms: [{ id: "cli", name: "CLI" }],
          implementations: [
            { implementation: { id: "impl1", name: "Impl 1", featureId: "f1", description: "", example: "", syntax: "", docUrl: "", userExtensible: false }, platforms: ["cli"], notes: "note1" },
            { implementation: { id: "impl3", name: "Impl 3", featureId: "f2", description: "", example: "", syntax: "", docUrl: "", userExtensible: false }, platforms: ["cli"], notes: "" },
          ],
        },
        {
          id: "h2", name: "Harness 2", icon: "h2.svg", website: "", platforms: [{ id: "cli", name: "CLI" }],
          implementations: [
            { implementation: { id: "impl1", name: "Impl 1", featureId: "f1", description: "", example: "", syntax: "", docUrl: "", userExtensible: false }, platforms: ["cli"], notes: "" },
            { implementation: { id: "impl2", name: "Impl 2", featureId: "f1", description: "", example: "", syntax: "", docUrl: "", userExtensible: false }, platforms: ["cli"], notes: "" },
          ],
        },
      ],
    });

    const matrix = service.getFullMatrix();

    expect(matrix.harnesses).toHaveLength(2);
    expect(matrix.rows).toHaveLength(2);

    const row1 = matrix.rows[0];
    expect(row1.feature.id).toBe("f1");
    expect(row1.totalImplementations).toBe(2);
    expect(row1.cells[0].supportedCount).toBe(1); // h1
    expect(row1.cells[1].supportedCount).toBe(2); // h2

    const row2 = matrix.rows[1];
    expect(row2.feature.id).toBe("f2");
    expect(row2.totalImplementations).toBe(1);
    expect(row2.cells[0].supportedCount).toBe(1); // h1
    expect(row2.cells[1].supportedCount).toBe(0); // h2
  });

  it("should include implementation details in cells", () => {
    const service = new DataService(null as any);
    service.loadData({
      features: [
        { id: "f1", name: "F1", description: "", category: "cat", sortOrder: 1 },
      ],
      implementations: [
        { id: "impl1", name: "Impl 1", featureId: "f1", description: "", example: "", syntax: "", docUrl: "", userExtensible: false },
      ],
      harnesses: [
        {
          id: "h1", name: "H1", icon: "h1.svg", website: "", platforms: [{ id: "cli", name: "CLI" }],
          implementations: [
            { implementation: { id: "impl1", name: "Impl 1", featureId: "f1", description: "", example: "", syntax: "", docUrl: "", userExtensible: false }, platforms: ["cli"], notes: "Some note" },
          ],
        },
      ],
    });

    const matrix = service.getFullMatrix();
    const cell = matrix.rows[0].cells[0];
    expect(cell.implementations).toHaveLength(1);
    expect(cell.implementations[0].implementationName).toBe("Impl 1");
    expect(cell.implementations[0].platforms).toEqual(["cli"]);
    expect(cell.implementations[0].notes).toBe("Some note");
  });
});
