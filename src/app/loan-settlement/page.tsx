import { Metadata } from "next";
import Link from "next/link";
import { MapPin, ArrowRight, Building2 } from "lucide-react";
import { citiesData } from "@/data/cities";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Pan-India Loan Settlement & DRT Legal Advisory by City | Debt Support Expert",
  description:
    "Find empanelled debt settlement advocates and DRT legal counsel across major Indian metropolitan hubs. Anti-harassment protection, Lok Adalat negotiation, and RBI compliant settlement.",
  alternates: {
    canonical: `${siteConfig.url}/loan-settlement`,
  },
};

export default function LoanSettlementCitiesPage() {
  const cityList = Object.values(citiesData);

  return (
    <div className="py-12 md:py-20 bg-background text-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/70 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-xs font-semibold">
            <MapPin className="h-4 w-4" />
            <span>Pan-India Legal Network</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            City-Wise Loan Settlement & Legal Representation
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Our High Court and DRT advocates provide localized legal protection against illegal recovery agent visits, negotiate bank One-Time Settlements (OTS), and secure formal No Dues Certificates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cityList.map((city) => (
            <Link
              key={city.slug}
              href={`/loan-settlement/${city.slug}`}
              className="p-6 rounded-3xl border border-border bg-card shadow-sm hover:shadow-xl hover:border-primary-400 dark:hover:border-primary-600 transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-2xl bg-primary-50 dark:bg-primary-950/80 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    Active Advocates
                  </span>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-foreground group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {city.cityName}
                  </h2>
                  <span className="text-xs text-muted-foreground font-medium">
                    {city.state} • {city.region} Region
                  </span>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {city.heroSubtitle}
                </p>

                <div className="pt-2 flex flex-wrap gap-1.5 text-[10px]">
                  {city.popularAreas.slice(0, 3).map((area: string, i: number) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground"
                    >
                      {area}
                    </span>
                  ))}
                  {city.popularAreas.length > 3 && (
                    <span className="px-1.5 py-0.5 rounded-md text-muted-foreground">
                      +{city.popularAreas.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-bold text-primary-600 dark:text-primary-400">
                <span>View Legal Advisory in {city.cityName}</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
