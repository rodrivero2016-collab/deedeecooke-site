import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Booking & Contact",
  description:
    "Book Dee Dee Cooke for your next show, festival, or event. Atlanta-based Soul, R&B and Southern Soul singer-songwriter.",
};

export default function BookingPage() {
  return (
    <section className="mx-auto max-w-2xl px-5 py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Get in touch</p>
      <h1 className="mt-3 font-display text-3xl text-wine-deep sm:text-4xl">Booking &amp; Contact</h1>
      <p className="mt-4 text-wine-deep/80">
        Interested in booking Dee Dee for a show, festival, private event, or session work?
        Send the details below and she&rsquo;ll be in touch.
      </p>
      <div className="mt-10">
        <ContactForm />
      </div>
    </section>
  );
}
