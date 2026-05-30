import { contactSchema } from "@/features/home/schema/contact.schema";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import z from "zod";

let resendClient: Resend | null = null;

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND API key is missing");
  }

  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }

  return resendClient;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          message: "Invalid form data",
          errors: z.treeifyError(result.error),
        },
        {
          status: 400,
        },
      );
    }

    const { name, email, subject, message } = result.data;

    const contactEmail = process.env.CONTACT_EMAIL;

    if (!contactEmail) {
      return NextResponse.json(
        { message: "Contact Email is missing" },
        { status: 500 },
      );
    }

    const { error } = await getResendClient().emails.send({
      from: "Khant Wai Yan <hello@khantwaiyan.cloud>",
      to: contactEmail,
      replyTo: email,
      subject: `Portfolio contact: ${subject}`,
      text: `
        Name: ${name}
        Email: ${email}
        Message:${message}
      `,
    });

    if (error) {
      return NextResponse.json(
        { message: "Failed to send message" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "Message sent successfully" },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { message: "Failed to send message" },
      { status: 500 },
    );
  }
}
