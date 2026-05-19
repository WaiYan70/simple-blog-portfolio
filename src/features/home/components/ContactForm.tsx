"use client";

import { Button } from "@/components/ui/button";
import { SubmitEvent, useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;

    setStatus("loading");

    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      subject: String(formData.get("subject") || ""),
      message: String(formData.get("message") || ""),
    };

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setStatus("error");
      return;
    }

    setStatus("success");
    form.reset();
  }

  return (
    <div className="border border-border">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 my-4">
        <label>Name</label>
        <input
          name="name"
          type="text"
          placeholder="Your Name"
          className="border border-border"
          required
        />
        <label>Email</label>
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="border border-border"
          required
        />
        <label>Subject</label>
        <input
          name="subject"
          type="text"
          placeholder="Subject"
          className="border border-border"
          required
        />
        <label>Message</label>
        <textarea
          name="message"
          placeholder="Your message"
          className="border border-border"
          required
        />

        <Button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Sending..." : "Send Message"}
        </Button>
        {status === "success" && <p>Message Sent Successfully</p>}
        {status === "error" && <p>Something went wrong. Please try again </p>}
      </form>
    </div>
  );
}
