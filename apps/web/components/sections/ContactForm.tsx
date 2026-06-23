"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { getSiteConfig } from "@/lib/site";

export function ContactForm() {
  const site = getSiteConfig();
  const [status, setStatus] = useState<"idle" | "opened">("idle");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const name = String(data.get("name") ?? "");
    const company = String(data.get("company") ?? "");
    const email = String(data.get("email") ?? "");
    const message = String(data.get("message") ?? "");

    const subject = encodeURIComponent(
      `Contact from ${name}${company ? ` (${company})` : ""}`,
    );
    const body = encodeURIComponent(
      `Name: ${name}\nCompany: ${company || "—"}\nEmail: ${email}\n\n${message}`,
    );

    window.location.href = `mailto:${site.salesEmail}?subject=${subject}&body=${body}`;
    setStatus("opened");
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
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
          type="text"
          autoComplete="organization"
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
          autoComplete="email"
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
          autoComplete="off"
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
      </div>
      <Button type="submit">Send Message</Button>
      {status === "opened" ? (
        <p className="text-sm text-muted-foreground">
          Your email app should open with the message ready to send. If it
          didn&apos;t, email us at{" "}
          <Link
            href={`mailto:${site.salesEmail}`}
            className="text-primary hover:underline"
          >
            {site.salesEmail}
          </Link>
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">
          Submit opens your email app with the message addressed to{" "}
          <Link
            href={`mailto:${site.salesEmail}`}
            className="text-primary hover:underline"
          >
            {site.salesEmail}
          </Link>
        </p>
      )}
    </form>
  );
}
