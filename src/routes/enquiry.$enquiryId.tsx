import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { formatWhen, prettyDate, rands, whatsappHref } from "@/lib/catalog";
import { enquiryMessage } from "@/lib/messages";
import { useLilula } from "@/lib/store";

export const Route = createFileRoute("/enquiry/$enquiryId")({ component: EnquiryDetail });

function EnquiryDetail() {
  const { enquiryId } = Route.useParams();
  const enquiry = useLilula((state) => state.enquiries.find((item) => item.id === enquiryId));
  const mark = useLilula((state) => state.markEnquiryWhatsapp);
  const [copied, setCopied] = useState(false);

  if (!enquiry) {
    return (
      <div className="panel px-4 py-10 text-center">
        <h1 className="font-display text-3xl">Enquiry not on this phone</h1>
        <Link to="/bar" className="btn btn-gold mt-5">
          Back to the bar
        </Link>
      </div>
    );
  }

  const message = enquiryMessage(enquiry);

  async function copy() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-5">
      <div className="md:col-span-3">
        <p className="kicker">Bar enquiry saved</p>
        <h1 className="mt-2 font-display text-4xl">{enquiry.id}</h1>
        <p className="mt-2 text-sm text-muted">{formatWhen(enquiry.createdAt)}</p>
        <p className="mt-4 text-sm text-muted">
          Nothing is booked until Lilula replies and confirms the quotation and payment.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            className="btn btn-green"
            href={whatsappHref(message)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => mark(enquiry.id)}
          >
            <MessageCircle className="size-4" />
            Open WhatsApp
          </a>
          <button type="button" className="btn btn-ghost" onClick={() => void copy()}>
            {copied ? "Copied" : "Copy message"}
          </button>
        </div>
        <pre className="panel mt-4 overflow-x-auto p-4 text-sm whitespace-pre-wrap text-muted">{message}</pre>
      </div>
      <aside className="panel h-fit p-4 md:col-span-2">
        <h2 className="font-display text-xl">{enquiry.packageName}</h2>
        <dl className="mt-3 flex flex-col gap-2 text-sm">
          <Item label="Event" value={enquiry.eventType} />
          <Item label="Date" value={prettyDate(enquiry.date)} />
          <Item label="Guests" value={String(enquiry.guests)} />
          <Item label="Venue" value={enquiry.venue} />
          <Item label="Name" value={enquiry.name} />
          <Item label="Phone" value={enquiry.phone} />
        </dl>
        <p className="mt-4 font-display text-3xl text-gold">{rands(enquiry.estimate)}</p>
        <p className="mt-1 text-xs text-muted">Package estimate. Lilula confirms the quote.</p>
        <Link to="/orders" className="btn btn-ghost mt-5 w-full">
          All orders
        </Link>
      </aside>
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs tracking-widest text-muted uppercase">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
