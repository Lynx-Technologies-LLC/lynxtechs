"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getSiteConfig } from "@/lib/site";

export function ContactForm() {
  const site = getSiteConfig();

  return (
    <form
      className="space-y-4"
      action={`mailto:${site.salesEmail}`}
      method="POST"
      encType="text/plain"
    >
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label htmlFor="company" className="mb-1 block text-sm font-medium">
          Company
        </label>
        <input
          id="company"
          name="company"
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
      </div>
      <Button type="submit">Send Message</Button>
      <p className="text-sm text-muted-foreground">
        Or email us directly at{" "}
        <Link href={`mailto:${site.salesEmail}`} className="text-primary hover:underline">
          {site.salesEmail}
        </Link>
      </p>
    </form>
  );
}
