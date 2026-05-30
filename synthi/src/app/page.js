import { SmoothScroll } from "@/components/SmoothScroll";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { StatBand } from "@/components/StatBand";
import { EyesAndHands } from "@/components/EyesAndHands";
import { FeedbackLoop } from "@/components/FeedbackLoop";
import { LivePlayground } from "@/components/LivePlayground";
import { WorkflowSection } from "@/components/WorkflowSection";
import { AudienceBand } from "@/components/AudienceBand";
import { CollaborationSection } from "@/components/CollaborationSection";
import { BringYourAgent } from "@/components/BringYourAgent";
import { StatementBand } from "@/components/StatementBand";
import { Comparison } from "@/components/Comparison";
import { SwitchSteps } from "@/components/SwitchSteps";
import { Pricing } from "@/components/Pricing";
import { FAQ } from "@/components/FAQ";
import { SecuritySection } from "@/components/SecuritySection";
import { BetaSection } from "@/components/BetaSection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <ScrollProgress />
      <Navbar />
      <main className="relative">
        <Hero />
        <StatBand />
        <EyesAndHands />
        <FeedbackLoop />
        <LivePlayground />
        <WorkflowSection />
        <AudienceBand />
        <CollaborationSection />
        <BringYourAgent />
        <StatementBand />
        <Comparison />
        <SwitchSteps />
        <Pricing />
        <FAQ />
        <SecuritySection />
        <BetaSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
