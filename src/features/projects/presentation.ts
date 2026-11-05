import {
  CarFront,
  Code2,
  Stethoscope,
  Truck,
  type LucideIcon,
} from "lucide-react";

export type ProjectLifecycle = {
  label: string;
  shortLabel: string;
  detail: string;
  icon: LucideIcon;
  tone: "verified" | "inProgress" | "neutral";
};

const lifecycleBySlug: Record<string, ProjectLifecycle> = {
  "car-marketplace": {
    label: "Live",
    shortLabel: "Live",
    detail: "Live on Google Play and maintained with ongoing updates.",
    icon: CarFront,
    tone: "verified",
  },
  "myorl-ent-clinic": {
    label: "Live",
    shortLabel: "Live",
    detail: "Live in production and maintained for clinic staff and patients.",
    icon: Stethoscope,
    tone: "verified",
  },
  "tayyn-hyzmat": {
    label: "Internal pilot",
    shortLabel: "Internal pilot · synthetic data",
    detail: "Internal pilot with synthetic data, maintained as the system evolves.",
    icon: Truck,
    tone: "inProgress",
  },
  "personal-engineering-portfolio": {
    label: "Live",
    shortLabel: "Live",
    detail: "Live in production and maintained with ongoing updates.",
    icon: Code2,
    tone: "verified",
  },
};

const defaultLifecycle: ProjectLifecycle = {
  label: "Published",
  shortLabel: "Published",
  detail: "Published project. See the case study for current status.",
  icon: Code2,
  tone: "neutral",
};

export function getProjectLifecycle(slug: string): ProjectLifecycle {
  return lifecycleBySlug[slug] ?? defaultLifecycle;
}
