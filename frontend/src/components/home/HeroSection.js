"use client";
import Image from "next/image";
import Link from "next/link";
import LockIcon from "@mui/icons-material/Lock";
import TimelineIcon from "@mui/icons-material/Timeline";
import GroupIcon from "@mui/icons-material/Group";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import RefreshIcon from "@mui/icons-material/Refresh";
import BarChartIcon from "@mui/icons-material/BarChart";

export default function HeroSection() {
  return (
    <div className="pt-16">
      

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-4">
              Powerful Features
            </h2>
            <p className="text-[var(--color-text-muted)] text-lg max-w-2xl mx-auto">
              Everything you need to manage your files efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: LockIcon,
                title: "End-to-End Encryption",
                description:
                  "Your files are encrypted at rest and in transit for maximum security",
              },
              {
                icon: TimelineIcon,
                title: "Lightning Fast",
                description:
                  "Quick uploads and downloads with optimized cloud infrastructure",
              },
              {
                icon: GroupIcon,
                title: "Easy Sharing",
                description:
                  "Share files and folders with customizable permissions and expiration dates",
              },
              {
                icon: SmartphoneIcon,
                title: "Access Anywhere",
                description:
                  "Access your files from any device - desktop, tablet, or smartphone",
              },
              {
                icon: RefreshIcon,
                title: "Smart Sync",
                description:
                  "Automatic synchronization across all your devices in real-time",
              },
              {
                icon: BarChartIcon,
                title: "File Versioning",
                description:
                  "Recover previous versions of your files with complete version history",
              },
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="p-8 border border-[var(--color-border)] rounded-lg hover:shadow-lg transition"
                >
                  <IconComponent
                    sx={{ fontSize: 48, color: "var(--color-primary)", mb: 2 }}
                  />
                  <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-[var(--color-text-muted)]">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Image Showcase Section */}
      <section className="py-16 md:py-24 bg-[var(--color-bg)]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-6">
                Your Files, Always at Hand
              </h2>
              <p className="text-[var(--color-text-muted)] text-lg mb-6">
                CloudVault makes it easy to organize and access all your
                important files. With intelligent search, powerful organization
                tools, and seamless collaboration features.
              </p>
              <div className="space-y-4">
                {[
                  "Store unlimited files",
                  "Collaborate in real-time",
                  "Advanced search capabilities",
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-[var(--color-text-main)]">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-[400px]">
              <Image
                src="/home-pg-img.jpg"
                alt="CloudVault Interface"
                fill
                className="object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-[var(--color-primary)]">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Join thousands of users who trust CloudVault for secure file storage
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-3 bg-white text-[var(--color-primary)] rounded-lg hover:bg-gray-100 transition font-semibold"
          >
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}
