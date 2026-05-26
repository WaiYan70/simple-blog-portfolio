import { Section } from "@/components/shared/Section";
import { ContactForm } from "../components/contact/ContactForm";
import { ContactInfo } from "../components/contact/ContactInfo";

export function ContactMe() {
  return (
    <Section
      className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
      id="contact"
    >
      <div className="grid md:grid-cols-[0.95fr_1.05fr]">
        <ContactInfo />
        <ContactForm />
      </div>
    </Section>
  );
}
