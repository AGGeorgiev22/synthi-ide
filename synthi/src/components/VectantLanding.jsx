import { AuthorityStory } from "@/components/home/AuthorityStory";
import { CinematicHero } from "@/components/home/CinematicHero";
import { ControlPlaneAtlas } from "@/components/home/ControlPlaneAtlas";
import { FieldNotes } from "@/components/home/FieldNotes";
import { FinalApproach } from "@/components/home/FinalApproach";
import { GpuProofChapter } from "@/components/home/GpuProofChapter";
import { MissionProfiles } from "@/components/home/MissionProfiles";
import { RunBoundary } from "@/components/home/RunBoundary";
import { RuntimeFeedback } from "@/components/home/RuntimeFeedback";
import styles from "@/components/VectantLanding.module.css";

export function VectantLanding() {
  return (
    <main id="main-content" tabIndex={-1} className={styles.page}>
      <CinematicHero />
      <RunBoundary />
      <AuthorityStory />
      <GpuProofChapter />
      <RuntimeFeedback />
      <ControlPlaneAtlas />
      <MissionProfiles />
      <FieldNotes />
      <FinalApproach />
    </main>
  );
}
