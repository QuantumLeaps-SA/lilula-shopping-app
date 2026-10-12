import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ContactCard } from "@/components/contact-card";
import {
  BOTTLE_PRICE,
  barCocktails,
  barPackages,
  barShots,
  eventTypes,
  prettyDate,
  rands,
} from "@/lib/catalog";
import { makeRef, useLilula } from "@/lib/store";

export const Route = createFileRoute("/bar")({ component: BarPage });

function tomorrowIso() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function BarPage() {
  const contact = useLilula((state) => state.contact);
  const placeEnquiry = useLilula((state) => state.placeEnquiry);
  const rememberContact = useLilula((state) => state.rememberContact);
  const navigate = useNavigate();
  const minDate = tomorrowIso();

  const [packageId, setPackageId] = useState(barPackages[0]?.id ?? "ultimate");
  const [name, setName] = useState(contact.name);
  const [phone, setPhone] = useState(contact.phone);
  const [eventType, setEventType] = useState<(typeof eventTypes)[number]>("Wedding");
  const [guests, setGuests] = useState("50");
  const [date, setDate] = useState(minDate);
  const [venue, setVenue] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selected = barPackages.find((item) => item.id === packageId) ?? barPackages[0];

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!selected) return;
    const guestCount = Number(guests);
    const next = validate({ name, phone, guests: guestCount, date, venue, minDate });
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    rememberContact({ name: cleanName, phone: cleanPhone, address: contact.address });
    const enquiry = {
      id: makeRef("BAR"),
      createdAt: new Date().toISOString(),
      name: cleanName,
      phone: cleanPhone,
      eventType,
      packageId: selected.id,
      packageName: selected.name,
      guests: guestCount,
      date,
      venue: venue.trim(),
      notes: notes.trim(),
      estimate: selected.price,
      whatsappOpened: false,
    };
    placeEnquiry(enquiry);
    void navigate({ to: "/enquiry/$enquiryId", params: { enquiryId: enquiry.id } });
  }

  return (
    <div className="flex flex-col gap-10">
      <section className="text-center">
        <p className="kicker">Unique gin</p>
        <h1 className="mt-2 font-display text-5xl text-gold-2 md:text-6xl">Mobile bar</h1>
        <p className="mt-3 text-sm tracking-widest text-muted uppercase">We bring the bar to you</p>
        <p className="mx-auto mt-5 max-w-sm border border-gold px-4 py-3 text-sm">
          Unique Gin bottles at the bar: only{" "}
          <span className="font-display text-xl text-gold">{rands(BOTTLE_PRICE)}</span> each
        </p>
        <p className="mx-auto mt-4 max-w-xl text-sm text-muted">
          Tell Lilula the date, venue and package. This saves the enquiry on your phone and prepares
          the WhatsApp message. The figure below is the published package estimate, not a paid booking.
        </p>
      </section>

      <section className="relative overflow-hidden border border-line">
        <img src="/spirits/bar.webp" alt="Lilula mobile bar setup" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-bg/70" />
        <div className="relative px-5 py-8">
          <h2 className="font-display text-3xl text-gold-2">Packages</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {barPackages.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={packageId === item.id}
                onClick={() => setPackageId(item.id)}
                className={`panel px-4 py-4 text-left ${packageId === item.id ? "border-gold" : ""}`}
              >
                <span className="font-display text-3xl text-gold">{rands(item.price)}</span>
                <span className="mt-2 block font-display text-xl">{item.name}</span>
                <span className="mt-1 block text-sm text-muted">{item.pitch}</span>
                <ul className="mt-3 flex flex-col gap-1 text-sm text-fg">
                  {item.includes.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </button>
            ))}
          </div>
        </div>
      </section>

      <form className="grid gap-4 md:grid-cols-2" onSubmit={submit} noValidate>
        <label>
          <span className="kicker">Your name</span>
          <input className="field mt-2" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} />
          {errors.name ? <Error text={errors.name} /> : null}
        </label>
        <label>
          <span className="kicker">Phone</span>
          <input className="field mt-2" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} />
          {errors.phone ? <Error text={errors.phone} /> : null}
        </label>
        <label>
          <span className="kicker">Event</span>
          <select className="field mt-2" value={eventType} onChange={(event) => setEventType(event.target.value as (typeof eventTypes)[number])}>
            {eventTypes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="kicker">Guests</span>
          <input className="field mt-2" inputMode="numeric" value={guests} onChange={(event) => setGuests(event.target.value)} />
          {errors.guests ? <Error text={errors.guests} /> : null}
        </label>
        <label>
          <span className="kicker">Date</span>
          <input className="field mt-2" type="date" min={minDate} value={date} onChange={(event) => setDate(event.target.value)} />
          {errors.date ? <Error text={errors.date} /> : null}
        </label>
        <label>
          <span className="kicker">Venue</span>
          <input className="field mt-2" value={venue} onChange={(event) => setVenue(event.target.value)} />
          {errors.venue ? <Error text={errors.venue} /> : null}
        </label>
        <label className="md:col-span-2">
          <span className="kicker">Notes (optional)</span>
          <textarea className="field mt-2 min-h-24 py-3" maxLength={400} value={notes} onChange={(event) => setNotes(event.target.value)} />
        </label>
        <div className="panel px-4 py-4 md:col-span-2">
          <p className="text-sm text-muted">
            {selected ? selected.name : "Package"} · {date ? prettyDate(date) : "Date"} · {guests || "0"} guests
          </p>
          <p className="mt-2 font-display text-3xl text-gold">{selected ? rands(selected.price) : ""}</p>
          <p className="mt-1 text-xs text-muted">Estimate only. Guest count can change the quotation Lilula sends back.</p>
        </div>
        <button type="submit" className="btn btn-gold md:col-span-2">
          Save enquiry
        </button>
      </form>

      <ContactCard
        heading="Book us for your next event"
        whatsappText="Hi, I'd like to book the Lilula mobile bar."
      />

      <section className="grid gap-3 md:grid-cols-2">
        <Menu title="Shots at the bar" rows={barShots} />
        <Menu title="Cocktails at the bar" rows={barCocktails} />
      </section>
    </div>
  );
}

function Menu({ title, rows }: { title: string; rows: { name: string; price: number }[] }) {
  return (
    <div className="panel p-4">
      <h2 className="font-display text-2xl text-gold">{title}</h2>
      <ul className="mt-3">
        {rows.map((row) => (
          <li key={row.name} className="flex items-center justify-between gap-3 border-b border-line py-2 text-sm last:border-0">
            <span>{row.name}</span>
            <span className="text-gold tabular-nums">{rands(row.price)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted">Served at events. Not added to a bottle order.</p>
    </div>
  );
}

function Error({ text }: { text: string }) {
  return (
    <span className="mt-1 block text-sm text-gold-2" role="alert">
      {text}
    </span>
  );
}

function validate(input: {
  name: string;
  phone: string;
  guests: number;
  date: string;
  venue: string;
  minDate: string;
}) {
  const errors: Record<string, string> = {};
  if (input.name.trim().length < 2) errors.name = "Enter your name.";
  const digits = input.phone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) errors.phone = "Enter a phone number Lilula can call.";
  if (!Number.isFinite(input.guests) || input.guests < 1 || input.guests > 5000) {
    errors.guests = "Enter how many guests you expect.";
  }
  if (!input.date || input.date < input.minDate) errors.date = "Choose a date from tomorrow onward.";
  if (input.venue.trim().length < 3) errors.venue = "Enter the venue or area.";
  return errors;
}
