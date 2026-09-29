import { HeroImageSettings } from "@/components/admin/HeroImageSettings";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <><HeroImageSettings />{children}</>;
}
