import { contactSchema } from "@/features/home/schema/contact.schema";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          message: "Invalid form data",
          error: "Error Message",
        },
        {
          status: 400,
        },
      );
    }

    const { name, email, subject, message } = result.data;

    const { error } = await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL!,
      replyTo: email,
      subject: `Portfolio contact: ${subject}`,
      text: `Name: ${name} Email: ${email} Message:${message}`,
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
