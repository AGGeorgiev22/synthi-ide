import { SmoothScroll } from "@/components/SmoothScroll";
import { Navbar } from "@/components/Navbar";
import { VectantLanding } from "@/components/VectantLanding";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <a
        href="#main-content"
        className="fixed left-4 top-3 z-[70] -translate-y-20 rounded-full bg-[#ff7757] px-4 py-2 text-[12px] font-semibold text-[#16100e] outline-none transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus:translate-y-0 focus:ring-2 focus:ring-cyan"
      >
        Skip to content
      </a>
      <Navbar />
      <VectantLanding />
      <Footer />
    </>
  );
}
