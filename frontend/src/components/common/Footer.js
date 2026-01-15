import Link from "next/link";
import { Facebook, Twitter, LinkedIn, GitHub } from "@mui/icons-material";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-text-main)] text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-[var(--color-accent)] rounded-lg flex items-center justify-center">
                <span className="font-bold text-white">CV</span>
              </div>
              <span className="text-xl font-bold">CloudVault</span>
            </div>
            <p className="text-blue-200 text-sm">
              Secure cloud storage for everyone. Store, sync, and share files
              with confidence.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-blue-200">
              <li>
                <Link href="#" className="hover:text-white transition">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Security
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Updates
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-blue-200">
              <li>
                <Link href="#" className="hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-blue-200">
              <li>
                <Link href="#" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  GDPR
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-blue-400 mb-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-blue-200 text-sm mb-4 md:mb-0">
            &copy; 2025 CloudVault. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex space-x-6">
            <a href="#" className="text-blue-200 hover:text-white transition">
              <Facebook fontSize="small" />
            </a>
            <a href="#" className="text-blue-200 hover:text-white transition">
              <Twitter fontSize="small" />
            </a>
            <a href="#" className="text-blue-200 hover:text-white transition">
              <LinkedIn fontSize="small" />
            </a>
            <a href="#" className="text-blue-200 hover:text-white transition">
              <GitHub fontSize="small" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
