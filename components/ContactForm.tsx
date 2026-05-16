"use client";

import { useState } from "react";

type Status = { state: "idle" | "loading" | "ok" | "err"; msg: string };

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ state: "idle", msg: "READY" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      subject: String(fd.get("subject") || ""),
      message: String(fd.get("message") || ""),
      website: String(fd.get("website") || ""), // honeypot
    };
    setStatus({ state: "loading", msg: "TRANSMITTING…" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Request failed");
      }
      setStatus({ state: "ok", msg: "✓ MESSAGE RECEIVED · I'LL REPLY SOON" });
      e.currentTarget.reset();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setStatus({ state: "err", msg: `✗ ${msg.toUpperCase()}` });
    }
  }

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate>
      <div className="row">
        <div className="field">
          <label htmlFor="cf-name">Name</label>
          <input id="cf-name" name="name" type="text" required maxLength={120} placeholder="Ada Lovelace" />
        </div>
        <div className="field">
          <label htmlFor="cf-email">Email</label>
          <input id="cf-email" name="email" type="email" required maxLength={200} placeholder="you@domain.com" />
        </div>
      </div>
      <div className="field" style={{ marginBottom: 14 }}>
        <label htmlFor="cf-subject">Subject</label>
        <input id="cf-subject" name="subject" type="text" maxLength={200} placeholder="Research collab / role / question" />
      </div>
      <div className="field">
        <label htmlFor="cf-message">Message</label>
        <textarea id="cf-message" name="message" required maxLength={4000} placeholder="Tell me what you're building." />
      </div>
      {/* honeypot — bots fill it, humans don't see it */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
        aria-hidden="true"
      />
      <div className="actions">
        <button
          type="submit"
          disabled={status.state === "loading"}
          aria-busy={status.state === "loading"}
        >
          {status.state === "loading" ? "Sending…" : <>Send signal <span aria-hidden="true">→</span></>}
        </button>
        <span
          className={`status ${status.state === "ok" ? "ok" : status.state === "err" ? "err" : ""}`}
          role="status"
          aria-live="polite"
        >
          [{status.msg}]
        </span>
      </div>
    </form>
  );
}
