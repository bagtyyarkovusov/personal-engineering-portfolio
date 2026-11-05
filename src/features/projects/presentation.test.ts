import { describe, expect, it } from "vitest";
import { getProjectLifecycle } from "./presentation";

describe("project lifecycle presentation", () => {
  it("uses live language for shipped production work", () => {
    expect(getProjectLifecycle("car-marketplace").label).toBe("Live");
    expect(getProjectLifecycle("myorl-ent-clinic").label).toBe("Live");
    expect(getProjectLifecycle("personal-engineering-portfolio").label).toBe("Live");
  });

  it("keeps Tayyn's internal pilot boundary visible", () => {
    const lifecycle = getProjectLifecycle("tayyn-hyzmat");

    expect(lifecycle.label).toBe("Internal pilot");
    expect(lifecycle.detail).toContain("synthetic data");
    expect(lifecycle.shortLabel).toBe("Internal pilot · synthetic data");
  });

  it("does not invent a production state for an unknown slug", () => {
    const lifecycle = getProjectLifecycle("renamed-project");

    expect(lifecycle.label).toBe("Published");
    expect(lifecycle.shortLabel).toBe("Published");
    expect(lifecycle.tone).toBe("neutral");
  });
});
