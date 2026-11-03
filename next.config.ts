import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
