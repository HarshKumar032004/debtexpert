import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob:",
      "font-src 'self'",
      "connect-src 'self' https://graph.facebook.com https://vitals.vercel-insights.com https://va.vercel-scripts.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/personal-loan-settlement",
        destination: "/services/personal-loan-settlement",
        permanent: true,
      },
      {
        source: "/credit-card-settlement",
        destination: "/services/credit-card-settlement",
        permanent: true,
      },
      {
        source: "/recovery-pressure",
        destination: "/services/anti-harassment",
        permanent: true,
      },
      {
        source: "/loan-default",
        destination: "/services/legal-notice-defense",
        permanent: true,
      },
      {
        source: "/debt-support",
        destination: "/services/personal-loan-settlement",
        permanent: true,
      },
      {
        source: "/secured-loan-assistance",
        destination: "/services/business-loan-settlement",
        permanent: true,
      },
      {
        source: "/fees",
        destination: "/pricing",
        permanent: true,
      },
      {
        source: "/get-expert-support",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/inquiry",
        destination: "/contact",
        permanent: true,
      },
      // Auxiliary legacy routes from original WordPress site
      {
        source: "/sbi-loan-settlement",
        destination: "/services/personal-loan-settlement",
        permanent: true,
      },
      {
        source: "/hdfc-loan-settlement",
        destination: "/services/personal-loan-settlement",
        permanent: true,
      },
      {
        source: "/icici-loan-settlement",
        destination: "/services/personal-loan-settlement",
        permanent: true,
      },
      {
        source: "/axis-loan-settlement",
        destination: "/services/personal-loan-settlement",
        permanent: true,
      },
      {
        source: "/borrower-rights",
        destination: "/services/anti-harassment",
        permanent: true,
      },
      {
        source: "/rbi-guidelines-loan-settlement",
        destination: "/services/anti-harassment",
        permanent: true,
      },
      {
        source: "/our-approach",
        destination: "/about",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
