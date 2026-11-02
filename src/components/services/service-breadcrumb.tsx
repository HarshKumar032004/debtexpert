import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { ServiceBreadcrumbItem } from "@/types/service";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site";

interface ServiceBreadcrumbProps {
  items: ServiceBreadcrumbItem[];
}

export function ServiceBreadcrumb({ items }: ServiceBreadcrumbProps) {
  // Format items for Schema.org JSON-LD
  const schemaItems = items.map((item) => ({
    name: item.label,
    url: item.href.startsWith("http") ? item.href : `${siteConfig.url}${item.href}`,
  }));

  return (
    <>
      <BreadcrumbJsonLd items={schemaItems} />
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs text-muted-foreground overflow-x-auto py-1 scrollbar-none"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-1 hover:text-primary-600 transition-colors shrink-0 font-medium"
        >
          <Home className="h-3.5 w-3.5" />
          <span>Home</span>
        </Link>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <div key={item.href} className="inline-flex items-center gap-1.5 shrink-0">
              <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
              {isLast ? (
                <span
                  aria-current="page"
                  className="font-semibold text-foreground truncate max-w-[220px] sm:max-w-none"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-primary-600 transition-colors font-medium"
                >
                  {item.label}
                </Link>
              )}
            </div>
          );
        })}
      </nav>
    </>
  );
}
