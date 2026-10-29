import { contactSchema } from "./contact.schema";
import { expect, test } from "vitest";

test("accepts valide contact details", () => {
  const validContact = {
    name: "Alex",
    email: "alex@example.com",
    subject: "Portfolio enquiry",
    message: "I would like to discuss a project.",
  };

  const result = contactSchema.safeParse(validContact);
  expect(result.success).toBe(true);
})

test("rejects an invalid email address", () => {
  const validContact = {
    name: "Alex",
    email: "invalid-email",
    subject: "Portfolio enquiry",
    message: "I would like to discuss a project.",
  };

  const result = contactSchema.safeParse(validContact);
  expect(result.success).toBe(false);
});

test("rejects an invalid email address", () => {
  const validContact = {
    name: "Alex",
    email: "invalid-email",
    subject: "Portfolio enquiry",
    message: "I would like to discuss a project.",
  };

  const result = contactSchema.safeParse(validContact);
  expect(result.success).toBe(false);
});
