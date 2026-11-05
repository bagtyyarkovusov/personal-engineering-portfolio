import {
  CarFront,
  Code2,
  Stethoscope,
  Truck,
  type LucideIcon,
} from "lucide-react";

export type ProjectLifecycle = {
  label: string;
  detail: string;
  icon: LucideIcon;
  tone: "verified" | "inProgress";
};

const lifecycleBySlug: Record<string, ProjectLifecycle> = {
  "car-marketplace": {
    label: "Live",
    detail: "Live on Google Play and maintained with ongoing updates.",
    icon: CarFront,
    tone: "verified",
  },
  "myorl-ent-clinic": {
    label: "Live",
    detail: "Live in production and maintained for clinic staff and patients.",
    icon: Stethoscope,
    tone: "verified",
  },
  "tayyn-hyzmat": {
    label: "Internal pilot",
    detail: "Internal pilot with synthetic data, maintained as the system evolves.",
    icon: Truck,
    tone: "inProgress",
  },
  "personal-engineering-portfolio": {
    label: "Live",
    detail: "Live in production and maintained with ongoing updates.",
    icon: Code2,
    tone: "verified",
  },
};

const defaultLifecycle: ProjectLifecycle = {
  label: "Maintained",
  detail: "Production work under active maintenance.",
  icon: Code2,
  tone: "verified",
};

export function getProjectLifecycle(slug: string): ProjectLifecycle {
  return lifecycleBySlug[slug] ?? defaultLifecycle;
}
