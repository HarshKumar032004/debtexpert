"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  ChevronDown,
  Menu,
  X,
  PhoneCall,
  Scale,
  CreditCard,
  Building2,
  FileText,
  Calculator,
  ArrowRight,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const serviceIcons = {
  "/services/personal-loan-settlement": Scale,
  "/services/credit-card-settlement": CreditCard,
  "/services/anti-harassment": ShieldCheck,
  "/services/business-loan-settlement": Building2,
  "/services/legal-notice-defense": FileText,
};

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = React.useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    // Lock body scroll when mobile menu is open
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  React.useEffect(() => {
    // Close mobile menu on route change
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    // Click outside listener for dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setServicesDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-200">
      {/* Top Advisory Banner */}
      <div className="bg-slate-900 text-slate-100 text-xs py-2 px-4 border-b border-slate-800">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-emerald-400">
              RBI Advisory Notice:
            </span>
            <span className="text-slate-300 hidden sm:inline">
              Banks and recovery agents cannot harass or threaten you. You have legal consumer rights.
            </span>
            <span className="text-slate-300 sm:hidden">
              Protected by RBI Fair Practices Code.
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <a
              href={`tel:${siteConfig.phone.replace(/[^0-9+]/g, "")}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <PhoneCall className="h-3 w-3 text-emerald-400" />
              <span className="font-medium text-white">{siteConfig.phoneDisplay}</span>
              <span className="text-slate-400 text-[11px]">(9:00 AM - 5:00 PM)</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Glassmorphic Navigation Bar */}
      <nav
        aria-label="Main Navigation"
        className={cn(
          "w-full transition-all duration-200 border-b",
          isScrolled
            ? "glass-panel shadow-sm py-2.5"
            : "bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-slate-200/80 dark:border-slate-800/80 py-3.5"
        )}
      >
        <div className="container mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-md shadow-primary-500/25 group-hover:scale-105 transition-transform duration-200">
              <Scale className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                Debt Support <span className="text-primary-500 dark:text-primary-400">Expert</span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase text-emerald-600 dark:text-emerald-400">
                Legal & Loan Settlement
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-1">
            <Link
              href="/"
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                pathname === "/"
                  ? "text-primary-600 dark:text-primary-400 bg-primary-50/80 dark:bg-primary-950/40"
                  : "text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/50"
              )}
            >
              Home
            </Link>

            {/* Services Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setServicesDropdownOpen((prev) => !prev)}
                onMouseEnter={() => setServicesDropdownOpen(true)}
                className={cn(
                  "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  pathname.startsWith("/services")
                    ? "text-primary-600 dark:text-primary-400 bg-primary-50/80 dark:bg-primary-950/40"
                    : "text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/50"
                )}
                aria-expanded={servicesDropdownOpen}
              >
                Services
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    servicesDropdownOpen ? "rotate-180" : ""
                  )}
                />
              </button>

              {/* Mega Dropdown Menu */}
              {servicesDropdownOpen && (
                <div
                  onMouseLeave={() => setServicesDropdownOpen(false)}
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[540px] rounded-2xl glass-dropdown p-4 border shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="grid grid-cols-2 gap-2">
                    {siteConfig.services.map((service) => {
                      const Icon =
                        serviceIcons[service.href as keyof typeof serviceIcons] ||
                        Scale;
                      return (
                        <Link
                          key={service.href}
                          href={service.href}
                          onClick={() => setServicesDropdownOpen(false)}
                          className="group flex flex-col p-3 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <div className="h-7 w-7 rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Icon className="h-4 w-4" />
                              </div>
                              <span className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                                {service.shortTitle}
                              </span>
                            </div>
                            {service.badge && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                                {service.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                            {service.description}
                          </p>
                        </Link>
                      );
                    })}
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between px-2 text-xs">
                    <span className="text-slate-500 dark:text-slate-400">
                      Need custom corporate or high-ticket settlement?
                    </span>
                    <Link
                      href="/services"
                      onClick={() => setServicesDropdownOpen(false)}
                      className="font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                    >
                      View All Services
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/calculator"
              className={cn(
                "relative px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5",
                pathname === "/calculator"
                  ? "text-primary-600 dark:text-primary-400 bg-primary-50/80 dark:bg-primary-950/40"
                  : "text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/50"
              )}
            >
              <Calculator className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Calculator</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Free
              </span>
            </Link>

            <Link
              href="/pricing"
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5",
                pathname === "/pricing"
                  ? "text-primary-600 dark:text-primary-400 bg-primary-50/80 dark:bg-primary-950/40"
                  : "text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/50"
              )}
            >
              <span>Pricing</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20">
                Plans
              </span>
            </Link>

            <Link
              href="/about"
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                pathname === "/about"
                  ? "text-primary-600 dark:text-primary-400 bg-primary-50/80 dark:bg-primary-950/40"
                  : "text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/50"
              )}
            >
              About Lawyers
            </Link>

            <Link
              href="/blog"
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                pathname.startsWith("/blog")
                  ? "text-primary-600 dark:text-primary-400 bg-primary-50/80 dark:bg-primary-950/40"
                  : "text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/50"
              )}
            >
              RBI Guides & Blog
            </Link>

            <Link
              href="/contact"
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                pathname === "/contact"
                  ? "text-primary-600 dark:text-primary-400 bg-primary-50/80 dark:bg-primary-950/40"
                  : "text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/50"
              )}
            >
              Contact
            </Link>
          </div>

          {/* Action CTAs, Compact Call Button & Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile/Tablet Compact Call Button (< 1024px) */}
            <a
              href={`tel:${siteConfig.phone.replace(/[^0-9+]/g, "")}`}
              aria-label={`Call Helpline ${siteConfig.phoneDisplay}`}
              className="lg:hidden flex items-center justify-center h-11 w-11 sm:h-9 sm:w-auto sm:px-3 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/80 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-semibold text-xs active:scale-95 transition-transform shrink-0"
            >
              <PhoneCall className="h-4 w-4 shrink-0 sm:mr-1.5" />
              <span className="hidden sm:inline">Call Help</span>
            </a>

            <ThemeToggle />

            {/* Desktop CTA Button */}
            <Link
              href="/contact"
              className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-primary-600 to-blue-700 hover:from-primary-700 hover:to-blue-800 shadow-md shadow-primary-600/25 hover:shadow-lg hover:shadow-primary-600/35 transition-all duration-200 active:scale-95 group"
            >
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span>Free Consultation</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            {/* Mobile Menu Hamburger (minimum 44x44px tap target) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="lg:hidden flex items-center justify-center min-h-[44px] min-w-[44px] h-11 w-11 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-95 transition-transform shrink-0"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer Modal / Slide-over */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex justify-end">
            {/* Smooth Backdrop */}
            <div
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer Panel */}
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation Menu"
              className="relative w-full max-w-[340px] sm:max-w-md h-full bg-white dark:bg-slate-950 z-10 flex flex-col shadow-2xl border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300 ease-out"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/60 shrink-0">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-sm">
                    <Scale className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                      Debt Support <span className="text-primary-600 dark:text-primary-400">Expert</span>
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Legal & Loan Settlement
                    </span>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center min-h-[44px] min-w-[44px] rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 active:scale-95 transition-all"
                  aria-label="Close navigation menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable Links Area */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2.5">
                {/* Home Link */}
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between py-2.5 px-3.5 rounded-xl text-sm font-semibold transition-colors",
                    pathname === "/"
                      ? "bg-primary-50 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300"
                      : "text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                  )}
                >
                  <span>Home</span>
                </Link>

                {/* Services Collapsible Accordion */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50/50 dark:bg-slate-900/30">
                  <button
                    type="button"
                    onClick={() => setMobileServicesOpen((prev) => !prev)}
                    className="flex items-center justify-between w-full py-3 px-3.5 text-sm font-bold text-slate-900 dark:text-white"
                    aria-expanded={mobileServicesOpen}
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                      <span>Services & Debt Relief</span>
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-slate-500 transition-transform duration-200",
                        mobileServicesOpen ? "rotate-180" : ""
                      )}
                    />
                  </button>

                  {mobileServicesOpen && (
                    <div className="space-y-1 px-2.5 pb-2.5 pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                      {siteConfig.services.map((service) => {
                        const Icon =
                          serviceIcons[service.href as keyof typeof serviceIcons] ||
                          Scale;
                        return (
                          <Link
                            key={service.href}
                            href={service.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-start gap-2.5 p-2 rounded-xl text-xs text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800/80 transition-colors"
                          >
                            <div className="h-6 w-6 rounded-lg bg-primary-100/70 dark:bg-primary-950 text-primary-700 dark:text-primary-300 flex items-center justify-center shrink-0 mt-0.5">
                              <Icon className="h-3.5 w-3.5" />
                            </div>
                            <div className="flex-1">
                              <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                                <span>{service.shortTitle}</span>
                                {service.badge && (
                                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                    {service.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                                {service.description}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                      <Link
                        href="/services"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 px-2.5 text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        View All Services Overview →
                      </Link>
                    </div>
                  )}
                </div>

                {/* Calculator Link with Free badge */}
                <Link
                  href="/calculator"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between py-2.5 px-3.5 rounded-xl text-sm font-semibold transition-colors",
                    pathname === "/calculator"
                      ? "bg-primary-50 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300"
                      : "text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Calculator className="h-4 w-4 text-emerald-500" />
                    <span>Settlement Calculator</span>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Free
                  </span>
                </Link>

                {/* Pricing Link */}
                <Link
                  href="/pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between py-2.5 px-3.5 rounded-xl text-sm font-semibold transition-colors",
                    pathname === "/pricing"
                      ? "bg-primary-50 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300"
                      : "text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary-500" />
                    <span>Advisory Pricing</span>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-primary-100 text-primary-800 dark:bg-primary-950 dark:text-primary-300">
                    Transparent
                  </span>
                </Link>

                {/* About Lawyers */}
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between py-2.5 px-3.5 rounded-xl text-sm font-semibold transition-colors",
                    pathname === "/about"
                      ? "bg-primary-50 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300"
                      : "text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                  )}
                >
                  <span>About Our Advocates</span>
                </Link>

                {/* Blog */}
                <Link
                  href="/blog"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between py-2.5 px-3.5 rounded-xl text-sm font-semibold transition-colors",
                    pathname.startsWith("/blog")
                      ? "bg-primary-50 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300"
                      : "text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                  )}
                >
                  <span>RBI Guides & Blog</span>
                </Link>

                {/* Contact */}
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between py-2.5 px-3.5 rounded-xl text-sm font-semibold transition-colors",
                    pathname === "/contact"
                      ? "bg-primary-50 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300"
                      : "text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                  )}
                >
                  <span>Contact & Offices</span>
                </Link>

                {/* Emergency Harassment Advisory Pill */}
                <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-900/50 text-[11px] text-blue-900 dark:text-blue-300 leading-relaxed mt-2">
                  <div className="font-bold flex items-center gap-1.5 mb-0.5 text-xs">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>RBI Protection Active:</span>
                  </div>
                  <span>Unannounced recovery home visits and calls to family members are illegal under RBI guidelines.</span>
                </div>
              </div>

              {/* Full-Width Sticky Bottom Drawer CTA */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-md space-y-2.5 shrink-0">
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-primary-600 via-primary-700 to-blue-700 shadow-md active:scale-95 transition-transform"
                >
                  <Sparkles className="h-4 w-4 text-amber-300" />
                  <span>Get Free Legal Help</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <a
                  href={siteConfig.getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-xs text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm active:scale-95 transition-transform"
                >
                  <MessageCircle className="h-4 w-4 fill-white" />
                  <span>WhatsApp Legal Helpline</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
