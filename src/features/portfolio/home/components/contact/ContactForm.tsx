"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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
      <FieldSet>
        <FieldLegend variant="legend">Contact Form</FieldLegend>
        <FieldDescription>Feel Free to reach out</FieldDescription>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Please Enter Your Name"
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Please Enter Your Email"
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="subject">Subject</FieldLabel>
            <Input
              id="subject"
              name="subject"
              type="text"
              placeholder="Subject"
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="message">Message</FieldLabel>
            <Textarea
              id="message"
              name="message"
              placeholder="Your message"
              className="min-h-40 resize-y"
              required
            />
          </Field>

          <Field>
            <Button
              type="submit"
              disabled={status === "loading"}
              className="self-start sm:self-end"
            >
              <Send data-icon="inline-start" />
              {status === "loading" ? "Sending..." : "Send message"}
            </Button>
          </Field>

          <Field aria-live="polite">
            {status === "success" && (
              <FieldDescription>Message sent successfully.</FieldDescription>
            )}

            {status === "error" && (
              <FieldError>Something went wrong. Please try again.</FieldError>
            )}
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
