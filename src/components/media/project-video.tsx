import { getProjectVideo } from "@/features/projects/media";
import { cn } from "@/lib/utils";

/*
  Self-hosted project video. Renders nothing until a video is registered in
  projectVideos. Never autoplays and loads nothing until the visitor presses
  play, so it is safe under reduced motion and on slow connections.
*/
export function ProjectVideo({
  videoKey,
  className,
}: {
  videoKey: string;
  className?: string;
}) {
  const video = getProjectVideo(videoKey);
  if (!video) return null;

  return (
    <figure className={cn("space-y-3", className)}>
      <video
        controls
        preload="none"
        playsInline
        poster={video.poster}
        aria-label={video.title}
        className="aspect-video h-auto w-full rounded-xl border border-border bg-card"
      >
        <source src={video.src} type="video/mp4" />
        <track
          kind="captions"
          src={video.captions}
          srcLang="en"
          label="English"
          default
        />
      </video>
      <figcaption className="font-mono text-xs text-muted-foreground">
        {video.title}
      </figcaption>
    </figure>
  );
}
