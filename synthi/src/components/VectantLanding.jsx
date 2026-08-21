import { CinematicHero } from "@/components/home/CinematicHero";
import { EvidenceStrip } from "@/components/home/EvidenceStrip";
import { EnterpriseConfidence } from "@/components/home/EnterpriseConfidence";
import { FieldNotes } from "@/components/home/FieldNotes";
import { FinalApproach } from "@/components/home/FinalApproach";
import { GpuProofChapter } from "@/components/home/GpuProofChapter";
import { GuardedRunCinema } from "@/components/home/GuardedRunCinema";
import { MissionProfiles } from "@/components/home/MissionProfiles";
import { NewsRegardingVectant } from "@/components/home/NewsRegardingVectant";
import { OutcomeChapters } from "@/components/home/OutcomeChapters";
import styles from "@/components/VectantLanding.module.css";

export function VectantLanding() {
  return (
    <main id="main-content" tabIndex={-1} className={styles.page}>
      <CinematicHero />
      <EvidenceStrip />
      <GuardedRunCinema />
      <GpuProofChapter />
      <NewsRegardingVectant />
      <OutcomeChapters />
      <MissionProfiles />
      <EnterpriseConfidence />
      <FieldNotes />
      <FinalApproach />
    </main>
  );
}
