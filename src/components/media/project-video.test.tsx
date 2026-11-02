import { describe, it, expect, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

vi.mock("@/features/projects/media", () => ({
  getProjectVideo: (key: string) =>
    key === "intro"
      ? {
          src: "/videos/intro.mp4",
          poster: "/videos/intro-poster.jpg",
          captions: "/videos/intro.vtt",
          title: "Intro, 60 seconds",
        }
      : undefined,
}));

import { ProjectVideo } from "./project-video";

describe("ProjectVideo", () => {
  it("renders nothing when no video is registered", () => {
    expect(renderToStaticMarkup(<ProjectVideo videoKey="missing" />)).toBe("");
  });

  it("renders a click-to-play video with poster and default captions", () => {
    const html = renderToStaticMarkup(<ProjectVideo videoKey="intro" />);
    expect(html).toContain("<video");
    expect(html).toContain('preload="none"');
    expect(html).toContain("controls");
    expect(html).toContain("playsInline");
    expect(html).not.toContain("autoPlay");
    expect(html).not.toContain("autoplay");
    expect(html).toContain('poster="/videos/intro-poster.jpg"');
    expect(html).toContain('src="/videos/intro.mp4"');
    expect(html).toMatch(/<track[^>]*kind="captions"[^>]*src="\/videos\/intro\.vtt"/);
    expect(html).toMatch(/<track[^>]*default/);
    expect(html).toContain("rounded-xl border border-border");
  });
});
