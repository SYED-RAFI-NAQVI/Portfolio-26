import type { Metadata } from "next";
import { JourneyExperience } from "../../components/journey/JourneyExperience";
import { journeyMilestones } from "../../data/journey";

export const metadata: Metadata = {
  title: "Journey — Rafi Naqvi",
  description: "A visual archive of work, experiments, milestones, and lessons.",
};

export default function JourneyPage() {
  return <JourneyExperience milestones={journeyMilestones} />;
}
