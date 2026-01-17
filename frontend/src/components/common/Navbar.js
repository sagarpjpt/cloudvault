"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "@mui/icons-material";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-transparent shadow-none"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-all ${
                isScrolled
                  ? "bg-[var(--color-primary)]/10 border-[var(--color-primary)]/30"
                  : "bg-white/20 border-white/30"
              }`}
            >
              <span
                className={`font-bold text-lg ${
                  isScrolled ? "text-[var(--color-primary)]" : "text-white"
                }`}
              >
                CV
              </span>
            </div>
            <span
              className={`text-xl font-bold transition-all ${
                isScrolled ? "text-[var(--color-primary)]" : "text-white"
              }`}
            >
              CloudVault
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 font-bold">
            <Link
              href="#features"
              className={`transition ${
                isScrolled
                  ? "text-[var(--color-text-main)] hover:text-[var(--color-primary)]"
                  : "text-white hover:text-gray-200"
              }`}
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className={`transition ${
                isScrolled
                  ? "text-[var(--color-text-main)] hover:text-[var(--color-primary)]"
                  : "text-white hover:text-gray-200"
              }`}
            >
              How It Works
            </Link>
            <Link
              href="#pricing"
              className={`transition ${
                isScrolled
                  ? "text-[var(--color-text-main)] hover:text-[var(--color-primary)]"
                  : "text-white hover:text-gray-200"
              }`}
            >
              Pricing
            </Link>
            <Link
              href="#about"
              className={`transition ${
                isScrolled
                  ? "text-[var(--color-text-main)] hover:text-[var(--color-primary)]"
                  : "text-white hover:text-gray-200"
              }`}
            >
              About
            </Link>
            <Link
              href="/register"
              className={`px-6 py-2 rounded-lg transition font-semibold ${
                isScrolled
                  ? "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]"
                  : "bg-white text-[var(--color-primary)] hover:bg-gray-100"
              }`}
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden transition ${
              isScrolled ? "text-[var(--color-primary)]" : "text-white"
            }`}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div
            className={`md:hidden pb-4 space-y-2 rounded transition ${
              isScrolled
                ? "bg-white border-t border-[var(--color-border)]"
                : "bg-black/40 backdrop-blur-md"
            }`}
          >
            <Link
              href="#features"
              className={`block px-4 py-2 rounded transition ${
                isScrolled
                  ? "text-[var(--color-text-main)] hover:bg-[var(--color-bg)]"
                  : "text-white hover:bg-white/10"
              }`}
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className={`block px-4 py-2 rounded transition ${
                isScrolled
                  ? "text-[var(--color-text-main)] hover:bg-[var(--color-bg)]"
                  : "text-white hover:bg-white/10"
              }`}
            >
              How It Works
            </Link>
            <Link
              href="#pricing"
              className={`block px-4 py-2 rounded transition ${
                isScrolled
                  ? "text-[var(--color-text-main)] hover:bg-[var(--color-bg)]"
                  : "text-white hover:bg-white/10"
              }`}
            >
              Pricing
            </Link>
            <Link
              href="#about"
              className={`block px-4 py-2 rounded transition ${
                isScrolled
                  ? "text-[var(--color-text-main)] hover:bg-[var(--color-bg)]"
                  : "text-white hover:bg-white/10"
              }`}
            >
              About
            </Link>
            <Link
              href="/register"
              className={`block px-4 py-2 rounded transition font-semibold ${
                isScrolled
                  ? "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]"
                  : "bg-white text-[var(--color-primary)] hover:bg-gray-100"
              }`}
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
