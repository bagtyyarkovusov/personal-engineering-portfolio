export type ProjectLifecycle = {
  label: string;
  shortLabel: string;
  detail: string;
  tone: "verified" | "inProgress" | "neutral";
};

export type ProjectBrand = {
  markSrc: string;
  markAlt: string;
  surfaceClass: string;
  borderClass: string;
};

const lifecycleBySlug: Record<string, ProjectLifecycle> = {
  "car-marketplace": {
    label: "Live",
    shortLabel: "Live",
    detail: "Live on Google Play and maintained with ongoing updates.",
    tone: "verified",
  },
  "myorl-ent-clinic": {
    label: "Live",
    shortLabel: "Live",
    detail: "Live in production and maintained for clinic staff and patients.",
    tone: "verified",
  },
  "tayyn-hyzmat": {
    label: "Internal pilot",
    shortLabel: "Internal pilot · synthetic data",
    detail: "Internal pilot with synthetic data, maintained as the system evolves.",
    tone: "inProgress",
  },
  "personal-engineering-portfolio": {
    label: "Live",
    shortLabel: "Live",
    detail: "Live in production and maintained with ongoing updates.",
    tone: "verified",
  },
};

const defaultLifecycle: ProjectLifecycle = {
  label: "Published",
  shortLabel: "Published",
  detail: "Published project. See the case study for current status.",
  tone: "neutral",
};

const brandBySlug: Record<string, ProjectBrand> = {
  "car-marketplace": {
    markSrc: "/carberk/app-icon.png",
    markAlt: "Carberk app mark",
    surfaceClass: "bg-project-carberk/15",
    borderClass: "border-project-carberk/40",
  },
  "tayyn-hyzmat": {
    markSrc: "/project-marks/tayyn-mark.png",
    markAlt: "Tayyn Hyzmat product mark",
    surfaceClass: "bg-project-tayyn/15",
    borderClass: "border-project-tayyn/40",
  },
  "myorl-ent-clinic": {
    markSrc: "/project-marks/myorl-mark.png",
    markAlt: "MyORL clinic header mark",
    surfaceClass: "bg-project-myorl/15",
    borderClass: "border-project-myorl/40",
  },
  "personal-engineering-portfolio": {
    markSrc: "/icon.svg",
    markAlt: "Bagtyyar portfolio mark",
    surfaceClass: "bg-project-portfolio/10",
    borderClass: "border-project-portfolio/35",
  },
};

const defaultBrand: ProjectBrand = {
  markSrc: "/icon.svg",
  markAlt: "Project mark",
  surfaceClass: "bg-background",
  borderClass: "border-border",
};

export function getProjectLifecycle(slug: string): ProjectLifecycle {
  return lifecycleBySlug[slug] ?? defaultLifecycle;
}

export function getProjectBrand(slug: string): ProjectBrand {
  return brandBySlug[slug] ?? defaultBrand;
}

export function getProjectLifecycleClasses(
  tone: ProjectLifecycle["tone"],
): { badge: string; text: string } {
  if (tone === "verified") {
    return {
      badge: "bg-status-verified/10 text-status-verified",
      text: "text-status-verified",
    };
  }

  if (tone === "inProgress") {
    return {
      badge: "bg-status-in-progress/10 text-status-in-progress",
      text: "text-status-in-progress",
    };
  }

  return {
    badge: "bg-status-neutral/10 text-status-neutral",
    text: "text-status-neutral",
  };
}
