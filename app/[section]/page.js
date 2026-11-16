import CRMApp from "@/components/CRMApp";

export function generateStaticParams() {
  return ["dashboard", "customers", "deals", "tasks", "settings", "login"].map((section) => ({ section }));
}

export default async function SectionPage({ params }) {
  const { section } = await params;
  return <CRMApp section={section} />;
}
