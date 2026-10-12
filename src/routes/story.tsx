import { createFileRoute } from "@tanstack/react-router";
import { ContactCard } from "@/components/contact-card";

export const Route = createFileRoute("/story")({ component: StoryPage });

const team = [
  { mark: "R", name: "Roger", role: "Founder" },
  { mark: "MM", name: "Mohomotsi Mabula", role: "IT & Partner" },
  { mark: "…", name: "And many more", role: "Our growing team" },
];

function StoryPage() {
  return (
    <div className="flex flex-col gap-10">
      <section className="text-center">
        <img src="/spirits/lf.webp" alt="Lilula Beverages" className="mx-auto h-28 w-auto" />
        <p className="kicker mt-5">Lilula Beverages</p>
        <h1 className="mt-2 font-display text-5xl text-gold-2 md:text-6xl">Our story</h1>
        <span className="rule mt-4" />
        <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-muted">
          Lilula Beverages is a South African drinks brand rooted in passion and driven by quality.
          We craft Unique Gin in five distinctive flavours alongside Toffolux Vodka, all produced
          and packed in South Africa, and we bring the bar to you with our mobile bar for weddings,
          birthdays, corporate events, festivals and private parties. Our promise is simple:
          uniquely crafted, uniquely yours.
        </p>
      </section>

      <section>
        <div className="text-center">
          <p className="kicker">The people behind the brand</p>
          <h2 className="mt-2 font-display text-3xl">Meet the team</h2>
        </div>
        <ul className="mt-6 grid gap-3 sm:grid-cols-3">
          {team.map((person) => (
            <li key={person.name} className="panel flex flex-col items-center px-4 py-6 text-center">
              <span className="flex size-14 items-center justify-center border border-gold font-display text-lg text-gold">
                {person.mark}
              </span>
              <h3 className="mt-4 font-display text-xl leading-tight">{person.name}</h3>
              <p className="mt-1 text-sm text-muted">{person.role}</p>
            </li>
          ))}
        </ul>
      </section>

      <ContactCard heading="Get in touch" whatsappText="Hi Lilula Beverages!" />
    </div>
  );
}
