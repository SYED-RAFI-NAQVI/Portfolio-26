export type JourneyMilestoneKind =
  | "origin"
  | "work"
  | "project"
  | "experiment"
  | "failure"
  | "achievement";

export type JourneyMilestone = {
  id: string;
  indexLabel: string;
  year: string;
  kind: JourneyMilestoneKind;
  title: string;
  summary: string;
  meta: string[];
  side: "above" | "below";
  /** The line shape connecting the timeline to the card. @default "vertical" */
  connector?: "vertical" | "deflect-right" | "deflect-left" | "double-bend-right" | "double-bend-left";
  /** Controls the card width in the timeline. @default "md" */
  size?: "sm" | "md" | "lg";
  media?: {
    label: string;
    aspect: "landscape" | "portrait" | "square";
  };
};

/**
 * Foundation-only placeholder data.
 * Replace these objects with Rafi's real milestones later.
 * Animation code does not depend on the content shape beyond this type.
 */
export const journeyMilestones: JourneyMilestone[] = [
  {
    id: "origin",
    indexLabel: "T-00",
    year: "YYYY",
    kind: "origin",
    title: "Origin point",
    summary: "A quiet opening frame for the first real milestone in the archive.",
    meta: ["PLACEHOLDER", "LOCATION / TBD"],
    side: "above",
    size: "sm",
    connector: "vertical",
    media: { label: "IMAGE / ARTIFACT", aspect: "landscape" },
  },
  {
    id: "first-build",
    indexLabel: "T-01",
    year: "YYYY",
    kind: "project",
    title: "First meaningful build",
    summary: "Space for a project, screenshot, technical note, or early proof of work.",
    meta: ["PROJECT", "STATUS / TBD"],
    side: "below",
    size: "md",
    connector: "deflect-right",
    media: { label: "PRODUCT / SCREENSHOT", aspect: "square" },
  },
  {
    id: "turning-point",
    indexLabel: "T-02",
    year: "YYYY",
    kind: "work",
    title: "Turning point",
    summary: "A milestone shell for a company, role, collaborator, or shift in direction.",
    meta: ["WORK", "COORD / TBD"],
    side: "above",
    size: "lg",
    connector: "double-bend-left",
    media: { label: "LOGO / PHOTO", aspect: "portrait" },
  },
  {
    id: "experiment",
    indexLabel: "T-03",
    year: "YYYY",
    kind: "experiment",
    title: "Experiment",
    summary: "A place for the weird attempt, failed prototype, lesson, or unexpected detour.",
    meta: ["EXPERIMENT", "RESULT / TBD"],
    side: "below",
    size: "sm",
    connector: "deflect-left",
    media: { label: "DIAGRAM / NOTES", aspect: "landscape" },
  },
  {
    id: "ship",
    indexLabel: "T-04",
    year: "YYYY",
    kind: "achievement",
    title: "Something shipped",
    summary: "A future frame for the output, metric, launch, users, or achievement that mattered.",
    meta: ["SHIP", "METRIC / TBD"],
    side: "above",
    size: "lg",
    connector: "vertical",
    media: { label: "METRIC / PRODUCT", aspect: "landscape" },
  },
  {
    id: "now",
    indexLabel: "T-05",
    year: "NOW",
    kind: "achievement",
    title: "Current edge",
    summary: "The timeline can keep expanding without changing the scroll architecture.",
    meta: ["CURRENT", "NEXT / OPEN"],
    side: "below",
    size: "md",
    connector: "double-bend-right",
  },
];

