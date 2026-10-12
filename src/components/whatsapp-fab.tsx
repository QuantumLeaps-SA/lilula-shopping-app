import { MessageCircle } from "lucide-react";
import { whatsappHref } from "@/lib/catalog";

/** Floating WhatsApp shortcut. Sits above the mobile bottom nav. */
export function WhatsAppFab() {
  return (
    <a
      href={whatsappHref("Hi Lilula Beverages!")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Lilula on WhatsApp"
      className="fixed right-4 bottom-20 z-30 flex size-14 items-center justify-center rounded-full bg-green text-fg shadow-lg shadow-black/50 md:bottom-6"
    >
      <MessageCircle className="size-7" />
    </a>
  );
}
