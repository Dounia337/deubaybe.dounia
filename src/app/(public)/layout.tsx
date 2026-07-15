import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ScrollProgress } from "@/components/scroll-progress";
import { BackToTop } from "@/components/back-to-top";
import { CVRepo } from "@/db/repo";

const SITE_NAME_FALLBACK = "Deubaybe Dounia";

// Every public page reads live content from Postgres via an admin-editable
// CMS — force dynamic rendering (no build-time snapshot) so admin edits
// show up immediately instead of only after the next deploy.
export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const profile = await CVRepo.profile();
  const siteName = profile.full_name || SITE_NAME_FALLBACK;

  return (
    <>
      <ScrollProgress />
      <SiteHeader siteName={siteName} photoUrl={profile.photo_url} />
      <main className="flex-1 hero-wash">{children}</main>
      <SiteFooter siteName={siteName} />
      <BackToTop />
    </>
  );
}
