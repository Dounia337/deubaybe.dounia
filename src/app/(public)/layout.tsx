import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ScrollProgress } from "@/components/scroll-progress";
import { BackToTop } from "@/components/back-to-top";
import { CVRepo, SocialLinksRepo } from "@/db/repo";

const SITE_NAME_FALLBACK = "Deubaybe Dounia";

// Every public page reads live content from Postgres via an admin-editable
// CMS — force dynamic rendering (no build-time snapshot) so admin edits
// show up immediately instead of only after the next deploy.
export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [profile, allSocialLinks] = await Promise.all([CVRepo.profile(), SocialLinksRepo.all()]);
  const siteName = profile.full_name || SITE_NAME_FALLBACK;
  const socialLinks = allSocialLinks.filter((l) => l.visible && l.url.trim());

  return (
    <>
      <ScrollProgress />
      <SiteHeader siteName={siteName} photoUrl={profile.photo_url} />
      <main className="flex-1 hero-wash">{children}</main>
      <SiteFooter siteName={siteName} headline={profile.headline} socialLinks={socialLinks} />
      <BackToTop />
    </>
  );
}
