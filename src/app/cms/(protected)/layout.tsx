import { redirect } from "next/navigation";
import { getCmsSessionFromCookies } from "@/lib/cmsAuth";

export default async function CmsProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCmsSessionFromCookies();
  if (!session) redirect("/cms/login");
  return (
    <div className="min-h-dvh bg-gradient-to-br from-accent/5 via-background to-primary/5 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">{children}</div>
    </div>
  );
}
