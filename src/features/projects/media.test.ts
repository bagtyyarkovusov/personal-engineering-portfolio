import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { projectMedia } from "./media";

describe("MyORL project media", () => {
  it("ships four clinic screenshots with meaningful alt text", () => {
    const media = projectMedia["myorl-ent-clinic"];

    expect(media).toBeDefined();
    expect(media.shots).toHaveLength(4);
    expect(
      media.shots.every((shot) =>
        existsSync(path.join(process.cwd(), "public", shot.src)),
      ),
    ).toBe(true);
    expect(media.shots.every((shot) => shot.alt.length > 20)).toBe(true);
  });
});
