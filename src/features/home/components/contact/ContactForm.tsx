"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
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

    try {
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
    } catch {
      setStatus("error");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 bg-card p-6 sm:p-8 lg:p-10"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          name="subject"
          type="text"
          placeholder="Subject"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Your message"
          className="min-h-40 resize-y"
          required
        />
      </div>
      <Button
        type="submit"
        disabled={status === "loading"}
        className="self-start sm:self-end"
      >
        <Send data-icon="inline-start" />
        {status === "loading" ? "Sending..." : "Send message"}
      </Button>
      <div aria-live="polite">
        {status === "success" && (
          <p className="text-sm text-muted-foreground">
            Message sent successfully.
          </p>
        )}
        {status === "error" && (
          <p className="text-sm text-destructive">
            Something went wrong. Please try again.
          </p>
        )}
      </div>
    </form>
  );
}
