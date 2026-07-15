import { PageHeader, Section } from "@/components/ui/primitives";
import { ContactForm } from "@/components/contact-form";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Get in touch"
        description="Have a project, opportunity, or question? Send a message and I'll get back to you."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />
      <Section className="max-w-lg">
        <ContactForm />
      </Section>
    </>
  );
}
