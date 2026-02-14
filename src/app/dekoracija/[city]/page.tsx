import { redirect } from "next/navigation";
import { CategoryCityResults } from "@/components/CategoryCityResults";
import { cityInputToCanonicalSlug } from "@/lib/cities";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ city: string }>;
  searchParams: Promise<{ event?: string; subcategory?: string; q?: string }>;
};

export default async function DekoracijaCityPage({ params, searchParams }: Props) {
  const { city: citySlug } = await params;
  const sp = await searchParams;
  const canonical = cityInputToCanonicalSlug(citySlug);
  if (canonical && canonical !== citySlug) {
    const eventQ = sp.event && sp.event !== "wedding" ? `?event=${sp.event}` : "";
    redirect(`/dekoracija/${canonical}${eventQ}`);
  }
  return (
    <CategoryCityResults
        categorySlug="decoration"
        citySlug={citySlug}
        basePath="/dekoracija"
        eventType={sp.event}
        subcategory={sp.subcategory}
        q={sp.q}
    />
  );
}
