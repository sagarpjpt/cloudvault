import Navbar from "@/components/common/Navbar";
import HeroSection from "@/components/home/HeroSection";
import Footer from "@/components/common/Footer";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Hero Banner */}
      <section className="relative w-full h-screen overflow-hidden">
        <Image
          src="/hero-banner.jpg"
          alt="Hero Banner"
          fill
          className="object-cover absolute inset-0"
          priority
        />
        {/* <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div> */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-20 pt-20">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Secure Cloud Storage
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl">
            Store, sync, and share your files securely with CloudVault. Access
            your documents anywhere, anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/register"
              className="px-8 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition font-semibold"
            >
              Start Free Trial
            </Link>
            <Link
              href="#features"
              className="px-8 py-3 bg-white text-[var(--color-primary)] rounded-lg hover:bg-gray-100 transition font-semibold"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
      <HeroSection />
      <Footer />
    </div>
  );
}
