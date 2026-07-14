import { CinematicHero } from "@/components/home/CinematicHero";
import { ControlPlaneAtlas } from "@/components/home/ControlPlaneAtlas";
import { EvidenceStrip } from "@/components/home/EvidenceStrip";
import { FieldNotes } from "@/components/home/FieldNotes";
import { FinalApproach } from "@/components/home/FinalApproach";
import { GpuProofChapter } from "@/components/home/GpuProofChapter";
import { GuardedRunCinema } from "@/components/home/GuardedRunCinema";
import { MissionProfiles } from "@/components/home/MissionProfiles";
import styles from "@/components/VectantLanding.module.css";

export function VectantLanding() {
  return (
    <main id="main-content" tabIndex={-1} className={styles.page}>
      <CinematicHero />
      <EvidenceStrip />
      <GuardedRunCinema />
      <GpuProofChapter />
      <ControlPlaneAtlas />
      <MissionProfiles />
      <FieldNotes />
      <FinalApproach />
    </main>
  );
}
