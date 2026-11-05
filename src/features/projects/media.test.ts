import { existsSync } from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";
import {
  getProjectFacts,
  getProjectVideo,
  projectFacts,
  projectGalleries,
  projectVideos,
} from "./media";

const publicPath = (src: string) => path.join(process.cwd(), "public", src);

describe("getProjectVideo", () => {
  it("returns undefined for a slug without a video", () => {
    expect(getProjectVideo("no-such-project")).toBeUndefined();
  });

  it("ignores inherited object keys", () => {
    expect(getProjectVideo("constructor")).toBeUndefined();
    expect(getProjectVideo("toString")).toBeUndefined();
  });

  it("returns the registered entry for every key", () => {
    for (const [key, video] of Object.entries(projectVideos)) {
      expect(getProjectVideo(key)).toBe(video);
    }
  });

  it("points every registered video at self-hosted MP4, poster and VTT files", () => {
    for (const video of Object.values(projectVideos)) {
      expect(video.src).toMatch(/^\/videos\/.+\.mp4$/);
      expect(video.captions).toMatch(/^\/videos\/.+\.vtt$/);
      expect(video.poster).toMatch(/^\/videos\/.+\.(jpg|webp)$/);
      expect(video.title.trim()).not.toBe("");
      for (const file of [video.src, video.captions, video.poster]) {
        expect(existsSync(publicPath(file)), file).toBe(true);
      }
    }
  });
});

describe("getProjectFacts", () => {
  it("returns the proof line for Carberk", () => {
    expect(getProjectFacts("car-marketplace")).toBe(
      "Solo. May to Oct 2026. Live on Google Play.",
    );
  });

  it("labels Tayyn Hyzmat as an internal pilot with synthetic data", () => {
    expect(getProjectFacts("tayyn-hyzmat")).toBe(
      "Internal pilot. Synthetic data.",
    );
  });

  it("returns undefined for unknown or inherited keys", () => {
    expect(getProjectFacts("tm-whatsapp")).toBeUndefined();
    expect(getProjectFacts("constructor")).toBeUndefined();
  });

  it("keeps fact lines free of em and en dashes", () => {
    for (const fact of Object.values(projectFacts)) {
      expect(fact).not.toMatch(/[–—]/);
    }
  });
});

describe("projectGalleries", () => {
  it("labels the Carberk staff admin as unreleased sample data", () => {
    const [admin] = projectGalleries["car-marketplace"];
    expect(admin.title).toContain("ships in the next update");
    expect(admin.title).toContain("sample data");
    expect(admin.title.toLowerCase()).not.toContain("live");
  });

  it("ships every gallery image in /public", () => {
    for (const galleries of Object.values(projectGalleries)) {
      for (const gallery of galleries) {
        for (const shot of gallery.shots) {
          expect(existsSync(publicPath(shot.src)), shot.src).toBe(true);
          expect(shot.alt.trim()).not.toBe("");
        }
      }
    }
  });
});
