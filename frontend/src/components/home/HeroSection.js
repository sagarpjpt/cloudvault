"use client";
import Image from "next/image";
import Link from "next/link";
import LockIcon from "@mui/icons-material/Lock";
import TimelineIcon from "@mui/icons-material/Timeline";
import GroupIcon from "@mui/icons-material/Group";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import RefreshIcon from "@mui/icons-material/Refresh";
import BarChartIcon from "@mui/icons-material/BarChart";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SecurityIcon from "@mui/icons-material/Security";

export default function HeroSection() {
  const pricingPlans = [
    {
      name: "Basic",
      price: "₹499",
      period: "/month",
      storage: "100GB",
      description: "Perfect for individuals",
      features: [
        "100GB Storage",
        "Basic Sharing",
        "Email Support",
        "30-day Version History",
      ],
    },
    {
      name: "Professional",
      price: "₹999",
      period: "/month",
      storage: "1TB",
      description: "For power users",
      features: [
        "1TB Storage",
        "Advanced Sharing",
        "Priority Support",
        "180-day Version History",
        "File Recovery",
      ],
      featured: true,
    },
    {
      name: "Business",
      price: "₹2999",
      period: "/month",
      storage: "5TB",
      description: "For teams and businesses",
      features: [
        "5TB Storage",
        "Team Collaboration",
        "24/7 Premium Support",
        "1-year Version History",
        "Admin Controls",
        "Audit Logs",
      ],
    },
  ];

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

      {/* How It Works Section with Image */}
      <section id="how-it-works" className="py-16 md:py-24 bg-[var(--color-bg)]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] order-2 md:order-1">
              <Image
                src="/home-pg-img2.jpg"
                alt="CloudVault Dashboard"
                fill
                className="object-cover rounded-lg shadow-lg"
              />
            </div>
            <div className="order-1 md:order-2">
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
                    <CheckCircleIcon sx={{ color: "var(--color-primary)", fontSize: 24 }} />
                    <span className="text-[var(--color-text-main)]">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Storage Banner */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-primary)]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Get 2GB Free Storage
            </h3>
            <p className="text-lg text-blue-100 mb-4">
              Create your CloudVault account today and enjoy 2GB of complimentary storage instantly. No credit card required.
            </p>
            <div className="flex justify-center">
              <Link
                href="/register"
                className="inline-block px-8 py-2 bg-white text-[var(--color-primary)] rounded-lg hover:bg-gray-100 transition font-semibold"
              >
                Start Your Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-[var(--color-text-muted)] text-lg max-w-2xl mx-auto">
              Choose the perfect plan for your needs. All plans include end-to-end encryption, 24/7 support, and 2GB free storage.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`rounded-lg border transition ${
                  plan.featured
                    ? "border-[var(--color-primary)] bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-accent)]/5 shadow-xl scale-105"
                    : "border-[var(--color-border)] hover:shadow-lg"
                }`}
              >
                <div className="p-8">
                  {plan.featured && (
                    <div className="mb-4 inline-block px-3 py-1 bg-[var(--color-primary)] text-white text-xs font-semibold rounded-full">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-[var(--color-primary)] mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-[var(--color-text-muted)] text-sm mb-6">
                    {plan.description}
                  </p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-[var(--color-primary)]">
                      {plan.price}
                    </span>
                    <span className="text-[var(--color-text-muted)]">
                      {plan.period}
                    </span>
                    <p className="text-sm text-[var(--color-text-muted)] mt-2">
                      {plan.storage} Storage
                    </p>
                  </div>

                  <button
                    className={`w-full py-3 rounded-lg font-semibold transition mb-8 ${
                      plan.featured
                        ? "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]"
                        : "border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5"
                    }`}
                  >
                    Get Started
                  </button>

                  <div className="space-y-4">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <CheckCircleIcon
                          sx={{
                            color: "var(--color-primary)",
                            fontSize: 20,
                          }}
                        />
                        <span className="text-[var(--color-text-main)] text-sm">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section with Background Image */}
      <section
        id="about"
        className="py-16 md:py-24 bg-cover bg-center bg-fixed relative"
        style={{
          backgroundImage: "url('/section-background-img.jpg')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Why Choose CloudVault?
              </h2>
              <p className="text-gray-200 text-lg mb-8">
                CloudVault is trusted by millions of users worldwide for secure and reliable cloud storage. 
                We've been pioneering secure file storage technology since 2020.
              </p>

              <div className="space-y-6">
                {[
                  {
                    title: "Enterprise-Grade Security",
                    description: "Military-grade AES-256 encryption protects your files at rest and in transit.",
                  },
                  {
                    title: "Privacy First Approach",
                    description: "Your data is yours alone. We never sell or share your information with third parties.",
                  },
                  {
                    title: "Global Infrastructure",
                    description: "Servers distributed across multiple continents ensure fast access from anywhere.",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex space-x-4">
                    <SecurityIcon sx={{ color: "#4988C4", fontSize: 28 }} className="flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-300 text-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative h-[400px]">
              <Image
                src="/home-pg-img3.jpg"
                alt="CloudVault Security"
                fill
                className="object-cover rounded-lg shadow-xl"
              />
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid md:grid-cols-3 gap-8 mt-16 pt-16 border-t border-white/20">
            {[
              { number: "50M+", label: "Users Worldwide" },
              { number: "99.99%", label: "Uptime Guarantee" },
              { number: "500M+", label: "Files Protected" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-[var(--color-accent)] mb-2">
                  {stat.number}
                </div>
                <p className="text-gray-200">{stat.label}</p>
              </div>
            ))}
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
