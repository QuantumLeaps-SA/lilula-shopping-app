import { CONTACT_NAME, prettyDate, rands } from "@/lib/catalog";
import type { BarEnquiry, BottleOrder } from "@/lib/records";

export function bottleMessage(order: BottleOrder) {
  const lines = order.items
    .map((item) => `${item.qty} × ${item.name} — ${rands(item.unitPrice * item.qty)}`)
    .join("\n");
  const where =
    order.fulfilment === "delivery"
      ? `Delivery\nAddress: ${order.address}`
      : "Collection (please confirm the collection point)";
  const notes = order.notes.trim() ? `\nNotes:\n${order.notes.trim()}\n` : "";

  return `Hello ${CONTACT_NAME},

New bottle order ${order.id}

Name: ${order.name}
Phone: ${order.phone}
Fulfilment: ${where}

${lines}

Estimated bottle total: ${rands(order.estimate)}
Any delivery fee is still to be confirmed.

Please confirm availability, the final total and how to pay. Nothing has been paid yet.
I confirm I am 18 or older.
${notes}
Thank you.`;
}

export function enquiryMessage(enquiry: BarEnquiry) {
  const notes = enquiry.notes.trim() ? `\nNotes:\n${enquiry.notes.trim()}\n` : "";
  return `Hello ${CONTACT_NAME},

Mobile bar enquiry ${enquiry.id}

Name: ${enquiry.name}
Phone: ${enquiry.phone}
Event: ${enquiry.eventType}
Date: ${prettyDate(enquiry.date)}
Guests: ${enquiry.guests}
Venue: ${enquiry.venue}
Package: ${enquiry.packageName}
Package estimate: ${rands(enquiry.estimate)}

Please confirm availability and the final quotation. Nothing has been paid yet.
${notes}
Thank you.`;
}
