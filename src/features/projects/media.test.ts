import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  getProjectCardShot,
  getProjectShotSizes,
  normalizeProjectBody,
  projectMedia,
} from "./media";

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

describe("project gallery image sizing", () => {
  it("matches portrait images to the mobile two-column slot", () => {
    expect(
      getProjectShotSizes({
        src: "/example.jpg",
        alt: "Example",
        width: 720,
        height: 1600,
      }),
    ).toBe("(min-width: 640px) 160px, calc((100vw - 5rem) / 2)");
  });

  it("matches wide images to the padded case-study content column", () => {
    expect(
      getProjectShotSizes({
        src: "/example.jpg",
        alt: "Example",
        width: 1440,
        height: 900,
      }),
    ).toBe("(min-width: 768px) 704px, calc(100vw - 4rem)");
  });
});

describe("normalizeProjectBody", () => {
  it("moves the seeded Carberk feature graphic to the optimized asset", () => {
    expect(
      normalizeProjectBody(
        "![Carberk by Alpha Motors](/carberk/feature-graphic.png)",
      ),
    ).toContain("/carberk/feature-graphic.webp");
  });

  it("ships a smaller optimized feature graphic", () => {
    const original = statSync(
      join(process.cwd(), "public/carberk/feature-graphic.png"),
    ).size;
    const optimized = statSync(
      join(process.cwd(), "public/carberk/feature-graphic.webp"),
    ).size;

    expect(optimized).toBeLessThan(original * 0.75);
  });
});

describe("project card media", () => {
  it("uses a real Carberk product screenshot", () => {
    expect(getProjectCardShot("car-marketplace")?.src).toBe("/carberk/01-feed.jpg");
  });
});
