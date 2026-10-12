import { MessageCircle, Phone } from "lucide-react";
import { CONTACT_NAME, PHONE_DISPLAY, WHATSAPP_NUMBER, whatsappHref } from "@/lib/catalog";

export function ContactCard({ heading, whatsappText }: { heading: string; whatsappText: string }) {
  return (
    <section className="panel px-4 py-6 text-center">
      <h2 className="font-display text-2xl text-gold-2">{heading}</h2>
      <p className="mt-2 text-sm text-muted">Ask for {CONTACT_NAME}</p>
      <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
        <a className="btn btn-ghost" href={`tel:+${WHATSAPP_NUMBER}`}>
          <Phone className="size-4" />
          {PHONE_DISPLAY}
        </a>
        <a
          className="btn btn-green"
          href={whatsappHref(whatsappText)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle className="size-4" />
          WhatsApp
        </a>
      </div>
    </section>
  );
}
