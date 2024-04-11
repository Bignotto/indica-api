import { NextResponse } from "next/server";
import twilio from "twilio";

interface PhoneVerifyPostData {
  phone: string;
}

export async function POST(request: Request) {
  const data: PhoneVerifyPostData = await request.json();

  try {
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const verification = await client.verify.v2
      .services(process.env.TWILIO_SERVICE!)
      .verifications.create({ to: data.phone, channel: "sms" });

    return NextResponse.json(
      { message: "code sent", phone: data.phone },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.error();
  }
}
