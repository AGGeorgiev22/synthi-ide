import { SmoothScroll } from "@/components/SmoothScroll";
import { Navbar } from "@/components/Navbar";
import { VectantLanding } from "@/components/VectantLanding";
import { Footer } from "@/components/Footer";
import { SITE_SOCIAL_IMAGE } from "@/lib/seo";

export const metadata = {
  title: "Vectant | Runtime Control Plane for Production Agents",
  description:
    "Run production agents with scoped authority, live runtime state, and reviewable proof in a cloud development environment.",
  alternates: { canonical: "/" },
  openGraph: {
    url: "/",
    title: "Vectant | Runtime Control Plane for Production Agents",
    description:
      "Run production agents with scoped authority, live runtime state, and reviewable proof in a cloud development environment.",
    images: [SITE_SOCIAL_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vectant | Runtime Control Plane for Production Agents",
    description:
      "Run production agents with scoped authority, live runtime state, and reviewable proof in a cloud development environment.",
    images: [SITE_SOCIAL_IMAGE.url],
  },
};

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <a
        href="#main-content"
        data-scroll-focus="true"
        className="fixed left-4 top-3 z-[70] -translate-y-20 rounded-full bg-[var(--vectant-ui-deep)] px-4 py-2 text-[12px] font-semibold text-[#f2efe9] outline-none transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus:translate-y-0 focus:ring-2 focus:ring-[var(--vectant-ui-action)]"
      >
        Skip to content
      </a>
      <Navbar />
      <VectantLanding />
      <Footer />
    </>
  );
}
