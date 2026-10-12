import { createFileRoute } from "@tanstack/react-router";
import { PHONE_DISPLAY } from "@/lib/catalog";

export const Route = createFileRoute("/privacy")({ component: PrivacyPage });

const sections: { heading: string; body: string }[] = [
  {
    heading: "What you give us",
    body: "When you place an order or send a mobile bar enquiry you can enter your name, phone number, delivery address, event details and notes.",
  },
  {
    heading: "Where it goes",
    body: "This information is saved only on your own device so you can see your orders and reuse your details. The website and app do not send it to Lilula. It reaches us only when you tap the WhatsApp button and send the message yourself. WhatsApp handles that message under its own privacy policy.",
  },
  {
    heading: "What stays on your device",
    body: "Your bag, saved orders, the contact details you typed in, and your confirmation that you are 18 or older. Clear the app's storage or your browser data to remove all of it.",
  },
  {
    heading: "Technical data",
    body: "The website is hosted by Vercel and loads its fonts from Google Fonts, so those providers may receive technical data such as your IP address when a page loads. We do not use advertising or analytics tools.",
  },
  {
    heading: "Payments",
    body: "Nothing is paid in the website or app. Payment is arranged directly with Lilula after you send your order.",
  },
  {
    heading: "Age",
    body: "Alcohol. 18+. The website and app are for adults only.",
  },
  {
    heading: "The Android app",
    body: "The app shows this website. It asks for no permission other than internet access and collects nothing beyond what is described here.",
  },
  {
    heading: "Contact us",
    body: `Questions, or a request to delete information you sent us on WhatsApp: call or WhatsApp ${PHONE_DISPLAY}.`,
  },
];

function PrivacyPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8">
      <header className="text-center">
        <p className="kicker">Lilula Beverages</p>
        <h1 className="mt-2 font-display text-4xl text-gold-2 md:text-5xl">Privacy policy</h1>
        <span className="rule mt-4" />
        <p className="mt-4 text-sm text-muted">Last updated 12 October 2026</p>
      </header>
      <p className="text-sm leading-relaxed text-muted">
        This policy explains what the Lilula Beverages website and Android app do with your
        information. Lilula Beverages is a South African drinks brand.
      </p>
      {sections.map((section) => (
        <section key={section.heading}>
          <h2 className="font-display text-2xl">{section.heading}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">{section.body}</p>
        </section>
      ))}
    </div>
  );
}
